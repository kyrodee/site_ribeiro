'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from '../login/page.module.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta.');
      }

      toast.success('Conta criada com sucesso!');
      router.refresh();
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
          <h2>Crie Sua Conta</h2>
          <p>Salve seus dados de contato e consulte seus orçamentos rapidamente.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome Completo</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.icon} />
              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>
          </div>

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
            <label htmlFor="telefone">WhatsApp / Telefone</label>
            <div className={styles.inputWrapper}>
              <Phone size={18} className={styles.icon} />
              <input
                id="telefone"
                type="tel"
                placeholder="DDD + Número"
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
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
            {loading ? 'Criando conta...' : 'Registrar'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Já tem conta?</span>
          <Link href="/login" className={styles.link}>
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
