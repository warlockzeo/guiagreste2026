import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { ImageUpload } from '../components/ImageUpload';
import type { Brand, Post } from '../types';
import styles from './Dashboard.module.css';

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

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [newPost, setNewPost] = useState({ image: '', caption: '' });
  const [editingLogo, setEditingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [editBrand, setEditBrand] = useState({
    name: '',
    logo: '',
    description: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    cnpj: '',
    instagram: '',
    facebook: '',
    website: '',
    categories: [] as string[],
  });

  useEffect(() => {
    if (!isAuthenticated || user?.type !== 'brand') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      const brandRes = await api.get(`/api/brands/${user?.id}`);
      setBrand(brandRes.data);
      setLogoUrl(brandRes.data.logo || '');
      setEditBrand({
        name: brandRes.data.name || '',
        logo: brandRes.data.logo || '',
        description: brandRes.data.description || '',
        address: brandRes.data.address || '',
        phone: brandRes.data.phone || '',
        whatsapp: brandRes.data.whatsapp || '',
        email: brandRes.data.email || '',
        cnpj: brandRes.data.cnpj || '',
        instagram: brandRes.data.instagram || '',
        facebook: brandRes.data.facebook || '',
        website: brandRes.data.website || '',
        categories: brandRes.data.categories || [],
      });

      const postsRes = await api.get(`/api/brands/${user?.id}/posts`);
      setPosts(postsRes.data.posts || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/brands/${user?.id}/posts`, newPost);
      setNewPost({ image: '', caption: '' });
      fetchData();
      addToast('Produto adicionado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      addToast('Erro ao adicionar produto', 'error');
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await api.delete(`/api/brands/${user?.id}/posts/${postId}`);
      fetchData();
      addToast('Produto removido', 'info');
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      addToast('Erro ao remover produto', 'error');
    }
  };

  const handleSaveLogo = async () => {
    try {
      await api.put(`/api/brands/${user?.id}`, { logo: logoUrl });
      setEditBrand((prev) => ({ ...prev, logo: logoUrl }));
      setEditingLogo(false);
      addToast('Logo atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar logo:', error);
      addToast('Erro ao salvar logo', 'error');
    }
  };

  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { logo: _, ...rest } = editBrand;
      await api.put(`/api/brands/${user?.id}`, {
        ...rest,
        categories: rest.categories.join(','),
      });
      fetchData();
      addToast('Dados atualizados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      addToast('Erro ao atualizar dados', 'error');
    }
  };

  const handleCategoryToggle = (category: string) => {
    setEditBrand((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  if (loading) {
    return <p className={styles['dashboard__loading']}>Carregando...</p>;
  }

  return (
    <motion.div
      className={styles['dashboard']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className={styles['dashboard__header']}>
        <div className={styles['dashboard__hero']}>
          <div className={styles['dashboard__heroBanner']} />
          <div className={styles['dashboard__heroOverlay']} />
          <div className={styles['dashboard__heroContent']}>
            <div className={styles['dashboard__logoContainer']}>
              <img
                src={logoUrl || 'https://via.placeholder.com/100'}
                alt={brand?.name}
                className={styles['dashboard__logo']}
                onClick={() => setEditingLogo(true)}
              />
              <button
                className={styles['dashboard__logoEditBtn']}
                onClick={() => setEditingLogo(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
            <div className={styles['dashboard__info']}>
              <h1 className={styles['dashboard__name']}>{brand?.name}</h1>
              <div className={styles['dashboard__stats']}>
                <div className={styles['dashboard__stat']}>
                  <div className={styles['dashboard__stat-value']}>{posts.length}</div>
                  <div className={styles['dashboard__stat-label']}>Produtos</div>
                </div>
                <div className={styles['dashboard__stat']}>
                  <div className={styles['dashboard__stat-value']}>{brand?.followersCount || 0}</div>
                  <div className={styles['dashboard__stat-label']}>Seguidores</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {editingLogo && (
        <motion.div
          className={styles['dashboard__logoModal']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles['dashboard__logoModalContent']}>
            <h3 className={styles['dashboard__logoModalTitle']}>Alterar Logo</h3>
            <ImageUpload
              value={logoUrl}
              onChange={(url) => {
                setLogoUrl(url);
              }}
            />
            <div className={styles['dashboard__logoModalActions']}>
              <button
                className={styles['dashboard__logoModalCancel']}
                onClick={() => {
                  setLogoUrl(editBrand.logo || '');
                  setEditingLogo(false);
                }}
              >
                Cancelar
              </button>
              <button
                className={styles['dashboard__logoModalSave']}
                onClick={handleSaveLogo}
              >
                Salvar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className={styles['dashboard__tabs']}>
        <button
          className={`${styles['dashboard__tab']} ${activeTab === 'posts' ? styles['dashboard__tab-active'] : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Produtos
        </button>
        <button
          className={`${styles['dashboard__tab']} ${activeTab === 'profile' ? styles['dashboard__tab-active'] : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Editar Perfil
        </button>
        <a
          href={`/brand/${user?.id}`}
          className={styles['dashboard__publicLink']}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Ver Página Pública
        </a>
      </div>

      {activeTab === 'posts' && (
        <>
          <div className={styles['dashboard__newPost']}>
            <form className={styles['dashboard__newPostForm']} onSubmit={handleCreatePost}>
              <div className={styles['dashboard__newPostField']}>
                <ImageUpload
                  value={newPost.image}
                  onChange={(url) => setNewPost({ ...newPost, image: url })}
                  label="Imagem do Produto"
                />
              </div>
              <div className={styles['dashboard__newPostField']}>
                <label className={styles['dashboard__newPostLabel']}>Descrição</label>
                <input
                  type="text"
                  className={styles['dashboard__input']}
                  value={newPost.caption}
                  onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                  placeholder="Descrição do produto"
                />
              </div>
              <button 
                type="submit" 
                className={styles['dashboard__newPostBtn']}
                disabled={!newPost.image}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Adicionar
              </button>
            </form>
          </div>

          <div className={styles['dashboard__postsSection']}>
            <h2 className={styles['dashboard__sectionTitle']}>Meus Produtos</h2>
            <div className={styles['dashboard__postsGrid']}>
              {posts.map((post) => (
                <div key={post.id} className={styles['dashboard__post']}>
                  <img src={post.image} alt={post.caption} />
                  <div className={styles['dashboard__postOverlay']}>
                    <button
                      className={styles['dashboard__postBtn']}
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'profile' && (
        <section className={styles['dashboard__section']}>
          <h2 className={styles['dashboard__sectionTitle']}>Dados da Empresa</h2>
          <form className={styles['dashboard__form']} onSubmit={handleUpdateBrand}>
            <div className={styles['dashboard__fieldFull']}>
              <label className={styles['dashboard__label']}>Nome da Empresa</label>
              <input
                type="text"
                className={styles['dashboard__input']}
                value={editBrand.name}
                onChange={(e) => setEditBrand({ ...editBrand, name: e.target.value })}
              />
            </div>

            <div className={styles['dashboard__fieldFull']}>
              <label className={styles['dashboard__label']}>Descrição</label>
              <textarea
                className={styles['dashboard__textarea']}
                value={editBrand.description}
                onChange={(e) => setEditBrand({ ...editBrand, description: e.target.value })}
                placeholder="Conte sobre sua empresa..."
                rows={4}
              />
            </div>

            <div className={styles['dashboard__fieldFull']}>
              <label className={styles['dashboard__label']}>Endereço</label>
              <input
                type="text"
                className={styles['dashboard__input']}
                value={editBrand.address}
                onChange={(e) => setEditBrand({ ...editBrand, address: e.target.value })}
                placeholder="Moda Center, Box 123"
              />
            </div>

            <div className={styles['dashboard__fieldGroup']}>
              <div className={styles['dashboard__field']}>
                <label className={styles['dashboard__label']}>Telefone</label>
                <input
                  type="text"
                  className={styles['dashboard__input']}
                  value={editBrand.phone}
                  onChange={(e) => setEditBrand({ ...editBrand, phone: e.target.value })}
                  placeholder="(81) 9999-9999"
                />
              </div>
              <div className={styles['dashboard__field']}>
                <label className={styles['dashboard__label']}>WhatsApp</label>
                <input
                  type="text"
                  className={styles['dashboard__input']}
                  value={editBrand.whatsapp}
                  onChange={(e) => setEditBrand({ ...editBrand, whatsapp: e.target.value })}
                  placeholder="(81) 99999-9999"
                />
              </div>
              <div className={styles['dashboard__field']}>
                <label className={styles['dashboard__label']}>Email</label>
                <input
                  type="email"
                  className={styles['dashboard__input']}
                  value={editBrand.email}
                  onChange={(e) => setEditBrand({ ...editBrand, email: e.target.value })}
                  placeholder="contato@empresa.com.br"
                />
              </div>
            </div>

            <div className={styles['dashboard__fieldGroup']}>
              <div className={styles['dashboard__field']}>
                <label className={styles['dashboard__label']}>Instagram</label>
                <input
                  type="text"
                  className={styles['dashboard__input']}
                  value={editBrand.instagram}
                  onChange={(e) => setEditBrand({ ...editBrand, instagram: e.target.value })}
                  placeholder="@sua_marca"
                />
              </div>
              <div className={styles['dashboard__field']}>
                <label className={styles['dashboard__label']}>Facebook</label>
                <input
                  type="text"
                  className={styles['dashboard__input']}
                  value={editBrand.facebook}
                  onChange={(e) => setEditBrand({ ...editBrand, facebook: e.target.value })}
                  placeholder="Sua Marca"
                />
              </div>
              <div className={styles['dashboard__field']}>
                <label className={styles['dashboard__label']}>Website</label>
                <input
                  type="text"
                  className={styles['dashboard__input']}
                  value={editBrand.website}
                  onChange={(e) => setEditBrand({ ...editBrand, website: e.target.value })}
                  placeholder="www.seusite.com.br"
                />
              </div>
            </div>

            <div className={styles['dashboard__categories']}>
              <span className={styles['dashboard__categoriesTitle']}>Categorias</span>
              <div className={styles['dashboard__categoriesGrid']}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles['dashboard__categoryBtn']} ${
                      editBrand.categories.includes(cat) ? styles['dashboard__categoryBtn--active'] : ''
                    }`}
                    onClick={() => handleCategoryToggle(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles['dashboard__submit']}>
              <button type="submit" className={styles['dashboard__btn']}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Salvar Alterações
              </button>
            </div>
          </form>
        </section>
      )}
    </motion.div>
  );
}
