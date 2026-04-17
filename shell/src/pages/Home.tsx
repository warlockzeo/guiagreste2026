import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { BrandCard } from '../components/BrandCard';
import { PostCard } from '../components/PostCard';
import type { Brand, Post } from '../types';
import styles from './Home.module.css';

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=600&fit=crop',
];

export function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [brandsRes, postsRes] = await Promise.all([
        api.get('/api/brands?limit=8'),
        api.get('/api/posts?limit=10'),
      ]);
      setBrands(brandsRes.data.brands || []);
      setPosts(postsRes.data.posts || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <motion.div
      className={styles.home}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <section className={styles.home__hero}>
        <div className={styles.home__carousel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className={styles.home__carouselSlide}
              style={{ backgroundImage: `url(${CAROUSEL_IMAGES[currentSlide]})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <div className={styles.home__carouselOverlay} />
        </div>
        <div className={styles.home__heroContent}>
          <h1 className={styles.home__title}>
            Guiagreste <span className={styles.home__titleAccent}>⭐</span>
          </h1>
          <p className={styles.home__subtitle}>
            Descubra as melhores marcas de roupas do agreste de Pernambuco
          </p>
          <form className={styles.home__search} onSubmit={handleSearch}>
            <input
              type="text"
              className={styles.home__searchInput}
              placeholder="Buscar marcas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className={styles.home__searchBtn}>
              Buscar
            </button>
          </form>
        </div>
        <div className={styles.home__carouselDots}>
          {CAROUSEL_IMAGES.map((_, index) => (
            <button
              key={index}
              className={`${styles.home__carouselDot} ${index === currentSlide ? styles['home__carouselDot--active'] : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className={styles.home__feed}>
          <div className={styles.home__sectionHeader}>
            <h2 className={styles.home__sectionTitle}>Feed de Novidades</h2>
          </div>
          <div className={styles.home__feedList}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.home__brands}>
        <div className={styles.home__sectionHeader}>
          <h2 className={styles.home__sectionTitle}>Marcas em Destaque</h2>
        </div>
        {loading ? (
          <p className={styles.home__loading}>Carregando...</p>
        ) : (
          <div className={styles.home__brandsGrid}>
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
