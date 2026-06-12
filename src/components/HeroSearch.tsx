'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './HeroSearch.module.css';

export default function HeroSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = searchTerm.trim();
    router.push(term ? `/produtos?q=${encodeURIComponent(term)}` : '/produtos');
  };

  return (
    <form onSubmit={handleSearch} className={styles.heroSearchForm}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={24} />
        <input
          type="search"
          placeholder="Qual peça ou código você precisa hoje?"
          className={styles.heroSearchInput}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit" className={`btn-primary ${styles.heroSearchBtn}`}>
          Buscar Peça
        </button>
      </div>
    </form>
  );
}
