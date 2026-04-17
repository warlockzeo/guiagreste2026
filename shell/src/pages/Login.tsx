import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import type { User, Brand } from '../types';
import styles from './Auth.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { user, token } = res.data;
      login(user as User | Brand, token);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erro ao fazer login');
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
        <h1 className={styles.auth__title}>Entrar</h1>
        <form className={styles.auth__form} onSubmit={handleSubmit}>
          {error && <p className={styles.auth__error}>{error}</p>}
          <div className={styles.auth__field}>
            <label className={styles.auth__label}>Email</label>
            <input
              type="email"
              className={styles.auth__input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.auth__field}>
            <label className={styles.auth__label}>Senha</label>
            <input
              type="password"
              className={styles.auth__input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.auth__btn}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={styles.auth__footer}>
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </motion.div>
  );
}
