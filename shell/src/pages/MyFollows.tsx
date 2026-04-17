import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { BrandCard } from '../components/BrandCard';
import type { Brand } from '../types';
import styles from './MyFollows.module.css';

export function MyFollows() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'user') {
      navigate('/login');
      return;
    }
    fetchFollows();
  }, [isAuthenticated, user]);

  const fetchFollows = async () => {
    try {
      const res = await api.get(`/api/users/${user?.id}/follows`);
      setBrands(res.data.brands || []);
    } catch (error) {
      console.error('Erro ao carregar marcas seguidas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className={styles['my-follows__loading']}>Carregando...</p>;
  }

  return (
    <motion.div
      className={styles['my-follows']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className={styles['my-follows__title']}>Marcas Seguidas</h1>

      {brands.length === 0 ? (
        <p className={styles['my-follows__empty']}>
          Você ainda não segue nenhuma marca.{' '}
          <a href="/catalog">Explorar catálogo</a>
        </p>
      ) : (
        <div className={styles['my-follows__grid']}>
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
