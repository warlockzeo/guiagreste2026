import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import type { Conversation } from '../types';
import styles from './Messages.module.css';

export function Messages() {
  const { user, isAuthenticated } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations();
    }
  }, [isAuthenticated, user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      const endpoint = user.type === 'brand'
        ? `/api/conversations/brand/${user.id}`
        : `/api/conversations/user/${user.id}`;
      const res = await api.get(endpoint);
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className={styles.messages__loading}>Carregando...</p>;
  }

  return (
    <motion.div
      className={styles.messages}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className={styles.messages__title}>Mensagens</h1>

      {conversations.length === 0 ? (
        <p className={styles.messages__empty}>Nenhuma conversa ainda.</p>
      ) : (
        <div className={styles.messages__list}>
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/chat/${conv.brandId}`}
              className={styles.messages__item}
            >
              <img
                src={conv.brandLogo || 'https://via.placeholder.com/50'}
                alt={conv.brandName}
                className={styles.messages__avatar}
              />
              <div className={styles.messages__info}>
                <div className={styles.messages__name}>{conv.brandName}</div>
                <div className={styles.messages__lastMessage}>
                  {conv.lastMessage || 'Inicie uma conversa...'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
