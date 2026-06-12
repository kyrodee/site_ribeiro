'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Phone, Search, ShoppingCart, X } from 'lucide-react';
import styles from './Header.module.css';
import { useCartStore } from '@/store/useCartStore';
import type { ProdutoSqlServer } from '@/lib/db-sqlserver';
import { createWhatsappUrl } from '@/lib/site-config';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<ProdutoSqlServer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore(state => state.getTotalItems());
  const setDrawerOpen = useCartStore(state => state.setDrawerOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const term = searchTerm.trim();
    if (term.length <= 1) return undefined;

    const delay = setTimeout(async () => {
      try {
        const response = await fetch(`/api/produtos?q=${encodeURIComponent(term)}&limit=8`, { signal: controller.signal });

        if (response.ok) {
          const data = await response.json() as ProdutoSqlServer[];
          setSuggestions(data);
          setShowSuggestions(true);
          setActiveSuggestion(-1);
        }
      } catch (error) {
        if (!controller.signal.aborted) console.error(error);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [searchTerm]);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim().length <= 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSuggestions(false);

    if (searchTerm.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/produtos');
    }
  };

  const handleSuggestionClick = (produto: ProdutoSqlServer) => {
    setShowSuggestions(false);
    setSearchTerm('');
    setActiveSuggestion(-1);
    router.push(`/produtos/${produto.id}`);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion((current) => Math.max(current - 1, -1));
    } else if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo-horizontal-ui.png"
            alt="Ribeiro Auto Peças"
            width={190}
            height={96}
            className={styles.logoImage}
            priority
          />
        </Link>

        <div ref={searchRef} className={styles.searchWrapper}>
          <form onSubmit={handleSearch} className={styles.searchContainer}>
            <input
              type="search"
              placeholder="Buscar por nome, código, referência, NCM..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(event) => handleSearchTermChange(event.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onKeyDown={handleSearchKeyDown}
            />
            <button type="submit" className={styles.searchButton} aria-label="Buscar">
              <Search size={20} />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestionsDropdown}>
              {suggestions.map((produto, index) => (
                <button
                  type="button"
                  key={produto.id}
                  className={`${styles.suggestionItem} ${index === activeSuggestion ? styles.activeSuggestion : ''}`}
                  onClick={() => handleSuggestionClick(produto)}
                >
                  <span className={styles.suggestionName}>{produto.nome}</span>
                  <span className={styles.suggestionMeta}>
                    <span className={styles.suggestionBrand}>{produto.marca || produto.categoria || 'Produto'}</span>
                    <span className={styles.suggestionRef}>Ref: {produto.referencia}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => setDrawerOpen(true)}
            className={styles.actionItem}
            aria-label="Abrir lista de peças"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ShoppingCart size={24} />
            <span className={styles.profileNameText}>Lista</span>
            <span className={styles.cartBadge}>{totalItems}</span>
          </button>

          <a
            href={createWhatsappUrl('Olá! Vim pelo site e gostaria de atendimento.')}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-primary ${styles.whatsappBtn}`}
          >
            <Phone size={18} />
            <span className={styles.btnText}>Contato</span>
          </a>

          <button
            type="button"
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <nav className={`${styles.navBar} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={`container ${styles.navContainer}`}>
          <div className={styles.navLinks}>
            <Link href="/produtos" onClick={() => setIsMobileMenuOpen(false)}>Todas as Peças</Link>
            <Link href="/produtos?cat=Motor" onClick={() => setIsMobileMenuOpen(false)}>Motor</Link>
            <Link href="/produtos?cat=Freios" onClick={() => setIsMobileMenuOpen(false)}>Freios</Link>
            <Link href="/produtos?cat=Cabine" onClick={() => setIsMobileMenuOpen(false)}>Cabine</Link>
            <Link href="/produtos?cat=Eletrica%2FSensores" onClick={() => setIsMobileMenuOpen(false)}>Elétrica/Sensores</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
