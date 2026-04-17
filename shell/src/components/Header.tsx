import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { api } from '../utils/api';
import logoImg from '../../assets/logo.png';
import styles from './Header.module.css';

interface Follower {
  id: number;
  name: string;
  email: string;
  interests: string[];
}

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggleTheme } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  const isBrand = (user as { type?: string })?.type === 'brand';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (registerRef.current && !registerRef.current.contains(event.target as Node)) {
        setShowRegisterDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen && isBrand && user?.id) {
      fetchFollowers();
    }
  }, [menuOpen, isBrand, user?.id]);

  const fetchFollowers = async () => {
    try {
      const res = await api.get(`/api/brands/${user?.id}/followers`);
      setFollowers(res.data.followers || []);
    } catch (error) {
      console.error('Erro ao buscar seguidores:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" className={styles.header__logo}>
          <img src={logoImg} alt="Guiagreste" className={styles.header__logoImg} />
        </Link>

        <nav className={styles.header__nav}>
          <Link to="/" className={styles.header__link}>
            Início
          </Link>
          <Link to="/catalog" className={styles.header__link}>
            Catálogo
          </Link>
          <Link to="/plans" className={styles.header__link}>
            Planos
          </Link>
        </nav>

        <div className={styles.header__actions}>
          <button
            className={styles['header__theme-toggle']}
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            <div className={styles['header__theme-knob']}>
              <svg className={styles['header__theme-icon']} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              <svg className={styles['header__theme-icon--alt']} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </div>
          </button>

          {isAuthenticated ? (
            <div className={styles.header__userMenu} ref={menuRef}>
              <button
                className={styles.header__userBtn}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className={styles.header__userAvatar}>
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
                <span className={styles.header__userName}>
                  {user?.name?.split(' ')[0]}
                </span>
                <svg 
                  className={`${styles.header__userArrow} ${menuOpen ? styles.header__userArrowOpen : ''}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              
              {menuOpen && (
                <motion.div
                  className={styles.header__dropdown}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className={styles.header__dropdownHeader}>
                    <span className={styles.header__dropdownName}>{user?.name}</span>
                    <span className={styles.header__dropdownType}>
                      {(user as { type?: string })?.type === 'brand' ? 'Loja' : 'Usuário'}
                    </span>
                  </div>
                  <div className={styles.header__dropdownDivider} />
                  {!isBrand ? (
                    <Link
                      to="/my-follows"
                      className={styles.header__dropdownItem}
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                      </svg>
                      Marcas Seguidas
                    </Link>
                  ) : (
                    <div className={styles.header__dropdownFollowers}>
                      <button
                        className={styles.header__dropdownItem}
                        onClick={() => setShowFollowers(!showFollowers)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                          <path d="M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                        Seguidores ({followers.length})
                        <svg
                          className={`${styles.header__arrowSmall} ${showFollowers ? styles.header__arrowOpen : ''}`}
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                      <AnimatePresence>
                        {showFollowers && (
                          <motion.div
                            className={styles.header__followersList}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {followers.length === 0 ? (
                              <p className={styles.header__followersEmpty}>Nenhum seguidor ainda</p>
                            ) : (
                              followers.slice(0, 5).map((follower) => (
                                <div key={follower.id} className={styles.header__followerItem}>
                                  <div className={styles.header__followerAvatar}>
                                    {follower.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className={styles.header__followerInfo}>
                                    <span className={styles.header__followerName}>{follower.name}</span>
                                    {follower.interests.length > 0 && (
                                      <div className={styles.header__followerInterests}>
                                        {follower.interests.map((interest, idx) => (
                                          <span key={idx} className={styles.header__followerTag}>{interest}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <Link
                    to="/messages"
                    className={styles.header__dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    Mensagens
                  </Link>
                  {(user as { type?: string })?.type === 'brand' && (
                    <Link
                      to="/dashboard"
                      className={styles.header__dropdownItem}
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Dashboard
                    </Link>
                  )}
                  <div className={styles.header__dropdownDivider} />
                  <button
                    className={styles.header__dropdownItem}
                    onClick={handleLogout}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sair
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={`${styles.header__authBtn} ${styles['header__authBtn--login']}`}>
                Entrar
              </Link>
              <div className={styles.header__registerDropdown} ref={registerRef}>
                <button
                  className={`${styles.header__authBtn} ${styles['header__authBtn--register']}`}
                  onClick={() => setShowRegisterDropdown(!showRegisterDropdown)}
                >
                  Cadastrar
                  <svg
                    className={`${styles.header__arrowSmall} ${showRegisterDropdown ? styles.header__arrowOpen : ''}`}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                <AnimatePresence>
                  {showRegisterDropdown && (
                    <motion.div
                      className={styles.header__registerMenu}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link
                        to="/register?type=user"
                        className={styles.header__registerItem}
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <span className={styles.header__registerIcon}>👤</span>
                        <div>
                          <span className={styles.header__registerLabel}>Usuário</span>
                          <span className={styles.header__registerDesc}>Comprar e seguir lojas</span>
                        </div>
                      </Link>
                      <div className={styles.header__registerDivider} />
                      <Link
                        to="/register?type=brand&plan=free"
                        className={styles.header__registerItem}
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <span className={styles.header__registerIcon}>🏪</span>
                        <div>
                          <span className={styles.header__registerLabel}>Loja - Grátis</span>
                          <span className={styles.header__registerDesc}>5 fotos, sem destaque</span>
                        </div>
                      </Link>
                      <Link
                        to="/register?type=brand&plan=vip"
                        className={`${styles.header__registerItem} ${styles['header__registerItem--vip']}`}
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <span className={styles.header__registerIcon}>⭐</span>
                        <div>
                          <span className={styles.header__registerLabel}>Loja - VIP</span>
                          <span className={styles.header__registerDesc}>Fotos ilimitadas + Destaque</span>
                        </div>
                      </Link>
                      <div className={styles.header__registerDivider} />
                      <Link
                        to="/plans"
                        className={styles.header__registerItem}
                        onClick={() => setShowRegisterDropdown(false)}
                      >
                        <span className={styles.header__registerIcon}>📋</span>
                        <div>
                          <span className={styles.header__registerLabel}>Ver Planos</span>
                          <span className={styles.header__registerDesc}>Compare as opções</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
