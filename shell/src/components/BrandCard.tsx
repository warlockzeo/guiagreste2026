import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import type { Brand, Post } from '../types';
import styles from './BrandCard.module.css';

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [latestPost, setLatestPost] = useState<Post | null>(null);

  useEffect(() => {
    checkIfFollowing();
    fetchLatestPost();
  }, [user]);

  const fetchLatestPost = async () => {
    try {
      const res = await api.get(`/api/brands/${brand.id}/posts?limit=1`);
      const posts = res.data.posts || [];
      if (posts.length > 0) {
        setLatestPost(posts[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar último post:', error);
    }
  };

  const getRandomTime = () => {
    const times = ['2 min', '15 min', '1h', '3h', '5h', '1 dia'];
    return times[Math.floor(Math.random() * times.length)];
  };

  const getRandomLikes = () => {
    return Math.floor(Math.random() * 500) + 10;
  };

  const checkIfFollowing = async () => {
    if (!user || user.type === 'brand') return;
    try {
      const res = await api.get(`/api/users/${user.id}/follows`);
      const follows = res.data.brands || [];
      setIsFollowing(follows.some((b: Brand) => b.id === brand.id));
    } catch (error) {
      console.error('Erro ao verificar follow:', error);
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user || user.type === 'brand') {
      addToast('Faça login para seguir marcas', 'error');
      navigate('/login');
      return;
    }

    try {
      if (isFollowing) {
        await api.delete(`/api/users/${user.id}/follows/${brand.id}`);
        setIsFollowing(false);
        addToast(`Você deixou de seguir ${brand.name}`, 'info');
      } else {
        await api.post(`/api/users/${user.id}/follows`, { brandId: brand.id });
        setIsFollowing(true);
        addToast(`Você agora segue ${brand.name}!`, 'success');
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
      addToast('Erro ao atualizar follow', 'error');
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user || user.type === 'brand') {
      addToast('Faça login para enviar mensagens', 'error');
      navigate('/login');
      return;
    }

    navigate(`/chat/${brand.id}`);
  };

  return (
    <motion.article
      className={styles['feed-card']}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles['feed-card__header']}>
        <Link to={`/brand/${brand.id}`}>
          <img
            src={brand.logo || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop'}
            alt={brand.name}
            className={styles['feed-card__avatar']}
          />
        </Link>
        <div className={styles['feed-card__info']}>
          <Link to={`/brand/${brand.id}`} style={{ textDecoration: 'none' }}>
            <h3 className={styles['feed-card__name']}>{brand.name}</h3>
          </Link>
          <span className={styles['feed-card__meta']}>
            {getRandomTime()} · 🌎
          </span>
        </div>
        {isAuthenticated && user?.type === 'user' && (
          <button
            className={`${styles['feed-card__follow']} ${isFollowing ? styles['feed-card__follow--following'] : ''}`}
            onClick={handleFollow}
          >
            {isFollowing ? 'Seguindo' : '+ Seguir'}
          </button>
        )}
      </div>

      <div className={styles['feed-card__image-container']}>
        <Link to={`/brand/${brand.id}`}>
          <img
            src={latestPost?.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop'}
            alt={brand.name}
            className={styles['feed-card__image']}
          />
        </Link>
      </div>

      <div className={styles['feed-card__content']}>
        <div className={styles['feed-card__categories']}>
          {brand.categories?.slice(0, 3).map((category) => (
            <span key={category} className={styles['feed-card__category']}>
              {category}
            </span>
          ))}
        </div>
        <p className={styles['feed-card__description']}>{brand.description}</p>
      </div>

      <div className={styles['feed-card__footer']}>
        <span className={styles['feed-card__stat']}>
          ❤️ {getRandomLikes()}
        </span>
        <div className={styles['feed-card__actions']}>
          <Link to={`/brand/${brand.id}`}>
            <button className={styles['feed-card__action']}>
              <span>👁️</span> Ver mais
            </button>
          </Link>
          <button className={styles['feed-card__action']} onClick={handleContact}>
            <span>💬</span> Contato
          </button>
        </div>
      </div>
    </motion.article>
  );
}
