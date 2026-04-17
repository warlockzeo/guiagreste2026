import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import type { User, Brand } from '../types';
import styles from './Auth.module.css';

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

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isBrand, setIsBrand] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    description: '',
    categories: [] as string[],
    cnpj: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isBrand ? '/api/auth/brand/register' : '/api/auth/user/register';
      const payload = isBrand
        ? { ...formData, categories: formData.categories.join(',') }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await api.post(endpoint, payload);
      const { user, token } = res.data;
      login(user as User | Brand, token);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.auth}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.auth__card}>
        <h1 className={styles.auth__title}>Cadastrar</h1>
        <form className={styles.auth__form} onSubmit={handleSubmit}>
          {error && <p className={styles.auth__error}>{error}</p>}

          <div className={styles.auth__field}>
            <label className={styles.auth__label}>Tipo de conta</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="type"
                  checked={!isBrand}
                  onChange={() => setIsBrand(false)}
                />
                Usuário
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="type"
                  checked={isBrand}
                  onChange={() => setIsBrand(true)}
                />
                Empresa
              </label>
            </div>
          </div>

          <div className={styles.auth__field}>
            <label className={styles.auth__label}>Nome</label>
            <input
              type="text"
              name="name"
              className={styles.auth__input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.auth__field}>
            <label className={styles.auth__label}>Email</label>
            <input
              type="email"
              name="email"
              className={styles.auth__input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.auth__field}>
            <label className={styles.auth__label}>Senha</label>
            <input
              type="password"
              name="password"
              className={styles.auth__input}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isBrand && (
            <>
              <div className={styles.auth__field}>
                <label className={styles.auth__label}>Telefone</label>
                <input
                  type="text"
                  name="phone"
                  className={styles.auth__input}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.auth__field}>
                <label className={styles.auth__label}>Endereço</label>
                <input
                  type="text"
                  name="address"
                  className={styles.auth__input}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.auth__field}>
                <label className={styles.auth__label}>CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  className={styles.auth__input}
                  value={formData.cnpj}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.auth__field}>
                <label className={styles.auth__label}>Descrição</label>
                <textarea
                  name="description"
                  className={styles.auth__input}
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className={styles.auth__field}>
                <label className={styles.auth__label}>Categorias</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        backgroundColor: formData.categories.includes(cat)
                          ? 'var(--color-blue)'
                          : 'transparent',
                        color: formData.categories.includes(cat)
                          ? 'white'
                          : 'var(--color-text)',
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ display: 'none' }}
                        checked={formData.categories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={styles.auth__btn}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className={styles.auth__footer}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </motion.div>
  );
}
