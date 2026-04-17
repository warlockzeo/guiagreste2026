import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import type { Brand, Post } from '../types';
import styles from './BrandDetail.module.css';

export function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBrand();
      fetchPosts();
    }
  }, [id]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const fetchBrand = async () => {
    try {
      const res = await api.get(`/api/brands/${id}`);
      setBrand(res.data);
      checkIfFollowing();
    } catch (error) {
      console.error('Erro ao carregar marca:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/api/brands/${id}/posts`);
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  };

  const checkIfFollowing = async () => {
    if (!user || user.type === 'brand') return;
    try {
      const res = await api.get(`/api/users/${user.id}/follows`);
      const follows = res.data.brands || [];
      setIsFollowing(follows.some((b: Brand) => b.id === Number(id)));
    } catch (error) {
      console.error('Erro ao verificar follow:', error);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated || !user || user.type === 'brand') {
      addToast('Faça login para seguir marcas', 'error');
      return;
    }
    try {
      await api.post(`/api/users/${user.id}/follows`, { brandId: Number(id) });
      setIsFollowing(true);
      addToast(`Você agora segue ${brand?.name}!`, 'success');
    } catch (error) {
      console.error('Erro ao seguir:', error);
      addToast('Erro ao seguir marca', 'error');
    }
  };

  const handleUnfollow = async () => {
    if (!isAuthenticated || !user || user.type === 'brand') return;
    try {
      await api.delete(`/api/users/${user.id}/follows/${id}`);
      setIsFollowing(false);
      addToast(`Você deixou de seguir ${brand?.name}`, 'info');
    } catch (error) {
      console.error('Erro ao deixar de seguir:', error);
      addToast('Erro ao deixar de seguir', 'error');
    }
  };

  const handleMessage = () => {
    if (!isAuthenticated || !user || user.type === 'brand') {
      addToast('Faça login para enviar mensagens', 'error');
      return;
    }
    window.location.href = `/chat/${id}`;
  };

  const openWhatsApp = () => {
    if (brand?.whatsapp) {
      const phone = brand.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const formatWhatsApp = (whatsapp: string) => {
    return whatsapp.replace(/\D/g, '');
  };

  const openInstagram = () => {
    if (brand?.instagram) {
      const username = brand.instagram.replace('@', '');
      window.open(`https://instagram.com/${username}`, '_blank');
    }
  };

  if (loading) {
    return <p className={styles['brand-detail__loading']}>Carregando...</p>;
  }

  if (!brand) {
    return <p className={styles['brand-detail__loading']}>Marca não encontrada.</p>;
  }

  return (
    <>
      <motion.div
        className={styles['brand-detail']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <header className={styles['brand-detail__header']}>
          <div className={styles['brand-detail__hero']}>
            <img
              src={brand.logo || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=600&fit=crop'}
              alt=""
              className={styles['brand-detail__banner']}
            />
            <div className={styles['brand-detail__heroOverlay']} />
            <div className={styles['brand-detail__heroContent']}>
              <div className={styles['brand-detail__heroLeft']}>
                <img
                  src={brand.logo || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop'}
                  alt={brand.name}
                  className={styles['brand-detail__logo']}
                  onClick={() => setSelectedImage(brand.logo || '')}
                />
                <div className={styles['brand-detail__info']}>
                  <h1 className={styles['brand-detail__name']}>{brand.name}</h1>
                  <div className={styles['brand-detail__categories']}>
                    {brand.categories?.map((cat) => (
                      <span key={cat} className={styles['brand-detail__category']}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {isAuthenticated && user?.type === 'user' && (
                <div className={styles['brand-detail__actions']}>
                  {isFollowing ? (
                    <button
                      className={`${styles['brand-detail__btn']} ${styles['brand-detail__btn--outline']}`}
                      onClick={handleUnfollow}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                      </svg>
                      Deixar de seguir
                    </button>
                  ) : (
                    <button
                      className={`${styles['brand-detail__btn']} ${styles['brand-detail__btn--primary']}`}
                      onClick={handleFollow}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                      </svg>
                      Seguir
                    </button>
                  )}
                  <button
                    className={`${styles['brand-detail__btn']} ${styles['brand-detail__btn--icon']}`}
                    onClick={handleMessage}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className={styles['brand-detail__contact-section']}>
          <div className={styles['brand-detail__contact-grid']}>
            <div className={styles['brand-detail__contact-column']}>
              <h3 className={styles['brand-detail__contact-column-title']}>Contato</h3>
              {brand.phone && (
                <motion.div
                  className={styles['brand-detail__contact-card']}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles['brand-detail__contact-icon']} style={{ backgroundColor: '#1E3A8A' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                  <div className={styles['brand-detail__contact-content']}>
                    <span className={styles['brand-detail__contact-value']}>{brand.phone}</span>
                  </div>
                </motion.div>
              )}
              {brand.whatsapp && (
                <motion.div
                  className={styles['brand-detail__contact-card']}
                  whileHover={{ y: -4 }}
                  onClick={openWhatsApp}
                >
                  <div className={styles['brand-detail__contact-icon']} style={{ backgroundColor: '#25D366' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className={styles['brand-detail__contact-content']}>
                    <span className={styles['brand-detail__contact-value']}>{formatWhatsApp(brand.whatsapp)}</span>
                  </div>
                </motion.div>
              )}
              {brand.email && (
                <motion.div
                  className={styles['brand-detail__contact-card']}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles['brand-detail__contact-icon']} style={{ backgroundColor: '#EA4335' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className={styles['brand-detail__contact-content']}>
                    <span className={styles['brand-detail__contact-value']}>{brand.email}</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className={styles['brand-detail__contact-column']}>
              <h3 className={styles['brand-detail__contact-column-title']}>Endereço</h3>
              {brand.address && (
                <motion.div
                  className={styles['brand-detail__contact-card']}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles['brand-detail__contact-icon']} style={{ backgroundColor: '#FF5722' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div className={styles['brand-detail__contact-content']}>
                    <span className={styles['brand-detail__contact-value']}>{brand.address}</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className={styles['brand-detail__contact-column']}>
              <h3 className={styles['brand-detail__contact-column-title']}>Redes Sociais</h3>
              {brand.instagram && (
                <motion.div
                  className={styles['brand-detail__contact-card']}
                  whileHover={{ y: -4 }}
                  onClick={openInstagram}
                >
                  <div className={styles['brand-detail__contact-icon']} style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className={styles['brand-detail__contact-content']}>
                    <span className={styles['brand-detail__contact-value']}>{brand.instagram}</span>
                  </div>
                </motion.div>
              )}
              {brand.email && (
                <motion.div
                  className={styles['brand-detail__contact-card']}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles['brand-detail__contact-icon']} style={{ backgroundColor: '#EA4335' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className={styles['brand-detail__contact-content']}>
                    <span className={styles['brand-detail__contact-value']}>{brand.email}</span>
                  </div>
                </motion.div>
              )}
              {brand.website && (
                <motion.div
                  className={styles['brand-detail__contact-card']}
                  whileHover={{ y: -4 }}
                  onClick={() => window.open(brand.website, '_blank')}
                >
                  <div className={styles['brand-detail__contact-icon']} style={{ backgroundColor: '#333' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                    </svg>
                  </div>
                  <div className={styles['brand-detail__contact-content']}>
                    <span className={styles['brand-detail__contact-value']}>{brand.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {isAuthenticated && user?.type === 'user' && (
            <div className={styles['brand-detail__contact-actions']}>
              {isFollowing ? (
                <motion.button
                  className={styles['brand-detail__contact-action']}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnfollow}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Deixar de seguir
                </motion.button>
              ) : (
                <motion.button
                  className={`${styles['brand-detail__contact-action']} ${styles['brand-detail__contact-action--primary']}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFollow}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Seguir
                </motion.button>
              )}
              <motion.button
                className={styles['brand-detail__contact-action']}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMessage}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Enviar mensagem
              </motion.button>
            </div>
          )}
        </section>

        {brand.description && (
          <section className={styles['brand-detail__about']}>
            <h2 className={styles['brand-detail__section-title']}>Sobre</h2>
            <p className={styles['brand-detail__description']}>{brand.description}</p>
          </section>
        )}

        <section className={styles['brand-detail__posts']}>
          <h2 className={styles['brand-detail__section-title']}>Produtos</h2>
          <div className={styles['brand-detail__posts-grid']}>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className={styles['brand-detail__post']}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedImage(post.image)}
              >
                <img src={post.image} alt={post.caption} />
                <div className={styles['brand-detail__post-overlay']}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={styles['brand-detail__modal']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className={styles['brand-detail__modal-content']}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles['brand-detail__modal-close']}
                onClick={() => setSelectedImage(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <img src={selectedImage} alt="Zoom" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
