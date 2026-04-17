import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import type { Brand, Message } from '../types';
import styles from './Chat.module.css';

export function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBrand();
    fetchOrCreateConversation();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchBrand = async () => {
    try {
      const res = await api.get(`/api/brands/${id}`);
      setBrand(res.data);
    } catch (error) {
      console.error('Erro ao carregar marca:', error);
    }
  };

  const fetchOrCreateConversation = async () => {
    if (!user) return;
    
    try {
      const res = await api.post('/api/conversations', { 
        userId: user.id, 
        brandId: Number(id) 
      });
      setConversationId(res.data.id);
      fetchMessages(res.data.id);
    } catch (error) {
      console.error('Erro ao criar/buscar conversa:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: number) => {
    try {
      const res = await api.get(`/api/conversations/${convId}/messages`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || !user) return;

    try {
      await api.post(`/api/conversations/${conversationId}/messages`, {
        senderId: user.id,
        senderType: user.type,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages(conversationId);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <p className={styles.chat__loading}>Carregando...</p>;
  }

  return (
    <motion.div
      className={styles.chat}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className={styles.chat__header}>
        <button className={styles.chat__back} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <img
          src={brand?.logo || 'https://via.placeholder.com/40'}
          alt={brand?.name}
          className={styles.chat__avatar}
        />
        <span className={styles.chat__name}>{brand?.name}</span>
      </header>

      <div className={styles.chat__messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.chat__message} ${
              msg.senderId === user?.id
                ? styles['chat__message--sent']
                : styles['chat__message--received']
            }`}
          >
            <div>{msg.content}</div>
            <div className={styles.chat__messageTime}>{formatTime(msg.createdAt)}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles['chat__input-container']} onSubmit={handleSend}>
        <input
          type="text"
          className={styles.chat__input}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
        />
        <button type="submit" className={styles.chat__send}>
          Enviar
        </button>
      </form>
    </motion.div>
  );
}
