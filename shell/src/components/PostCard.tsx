import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiUrl } from '../utils/api';
import type { Post } from '../types';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR');
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop';
    if (path.startsWith('http')) return path;
    return `${apiUrl}${path}`;
  };

  return (
    <motion.article
      className={styles['post-card']}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles['post-card__header']}>
        <Link to={`/brand/${post.brandId}`}>
          <img
            src={getImageUrl(post.brandLogo)}
            alt={post.brandName}
            className={styles['post-card__avatar']}
          />
        </Link>
        <div className={styles['post-card__info']}>
          <Link to={`/brand/${post.brandId}`} style={{ textDecoration: 'none' }}>
            <h3 className={styles['post-card__name']}>{post.brandName}</h3>
          </Link>
          <span className={styles['post-card__meta']}>
            {formatTime(post.createdAt)} · 🌎
          </span>
        </div>
      </div>

      <div className={styles['post-card__image-container']}>
        <img
          src={getImageUrl(post.image)}
          alt={post.caption}
          className={styles['post-card__image']}
        />
      </div>

      <div className={styles['post-card__content']}>
        <p className={styles['post-card__caption']}>{post.caption}</p>
      </div>

      <div className={styles['post-card__footer']}>
        <span className={styles['post-card__stat']}>
          ❤️ {Math.floor(Math.random() * 200) + 10}
        </span>
        <div className={styles['post-card__actions']}>
          <Link to={`/brand/${post.brandId}`}>
            <button className={styles['post-card__action']}>
              <span>👁️</span> Ver mais
            </button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
