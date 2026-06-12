'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login.');
      }

      toast.success('Login realizado com sucesso!');
      router.refresh(); // Atualiza layout e estado global
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.loginPage}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Acesse Sua Conta</h2>
          <p>Gerencie seus orçamentos e consulte seu histórico de pedidos.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.icon} />
              <input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Senha</label>
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Ainda não tem conta?</span>
          <Link href="/cadastro" className={styles.link}>
            Criar uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}
