import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { BrandCard } from '../components/BrandCard';
import type { Brand } from '../types';
import styles from './Catalog.module.css';

const CATEGORIES = [
  'Feminino',
  'Masculino',
  'Infantil',
  'Acessórios',
  'Calçados',
  'Moda Praia',
  'Esportivo',
  'Jeans',
  'Lingerie',
];

const ITEMS_PER_PAGE = 6;

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchBrands = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const params = new URLSearchParams();
      if (searchParams.get('search')) params.set('search', searchParams.get('search')!);
      if (searchParams.get('category')) params.set('category', searchParams.get('category')!);
      params.set('limit', '100');
      
      const res = await api.get(`/api/brands?${params.toString()}`);
      const fetchedBrands = res.data.brands || [];
      
      setAllBrands(fetchedBrands);
      setBrands(fetchedBrands.slice(0, ITEMS_PER_PAGE));
      setHasMore(fetchedBrands.length > ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBrands(true);
  }, [searchParams]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    const nextPage = page + 1;
    const nextItems = allBrands.slice(0, nextPage * ITEMS_PER_PAGE);
    setBrands(nextItems);
    setPage(nextPage);
    setHasMore(nextItems.length < allBrands.length);
  }, [page, allBrands, loadingMore, hasMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params.toString());
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== selectedCategory) params.set('category', category);
    setSearchParams(params.toString());
  };

  return (
    <motion.div
      className={styles.catalog}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.catalog__hero}>
        <div className={styles.catalog__heroOverlay} />
        <div className={styles.catalog__heroContent}>
          <h1 className={styles.catalog__title}>
            {searchParams.get('search')
              ? `Resultados para "${searchParams.get('search')}"`
              : searchParams.get('category')
              ? searchParams.get('category')
              : 'Catálogo de Marcas'}
          </h1>
          <form className={styles.catalog__search} onSubmit={handleSearch}>
            <input
              type="text"
              className={styles.catalog__searchInput}
              placeholder="Buscar marcas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className={styles.catalog__searchBtn}>
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className={styles.catalog__stickyCategories}>
        <div className={styles.catalog__categoriesWrapper}>
          <div className={styles.catalog__categories}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`${styles.catalog__categoryBtn} ${
                  selectedCategory === category || searchParams.get('category') === category
                    ? styles['catalog__categoryBtn--active']
                    : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.catalog__loading}>
          <div className={styles.catalog__spinner} />
        </div>
      ) : brands.length === 0 ? (
        <p className={styles.catalog__empty}>Nenhuma marca encontrada.</p>
      ) : (
        <>
          <div className={styles.catalog__grid}>
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
          {hasMore && (
            <div ref={loadMoreRef} className={styles.catalog__loadMore}>
              {loadingMore && (
                <div className={styles.catalog__spinner} />
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
