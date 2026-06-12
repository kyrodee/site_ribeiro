'use client';

import { useState } from 'react';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import type { ProdutoSqlServer } from '@/lib/db-sqlserver';
import { createWhatsappUrl, STORE_NAME } from '@/lib/site-config';

export default function AddToCartActions({ produto }: { produto: ProdutoSqlServer }) {
  const [quantidade, setQuantidade] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const mensagemWhatsapp = `Olá! Vim pelo site da ${STORE_NAME} e gostaria de atendimento sobre este produto.\n\nProduto: ${produto.nome}\nQuantidade desejada: ${quantidade} ${produto.unidade || 'UN'}\nCódigo: ${produto.codigoInterno}\nReferência: ${produto.referencia}\nMarca: ${produto.marca || 'Não informada'}\n\nPode confirmar disponibilidade, aplicação, valor final e forma de entrega?`;

  const handleAddToCart = () => {
    addItem(produto, quantidade);
    toast.success(`${quantidade}x ${produto.nome} adicionado a lista!`);
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Quantidade:</span>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
            style={{ padding: '0.5rem 1rem', background: '#F3F4F6', borderRight: '1px solid var(--border-light)', cursor: 'pointer' }}
          >
            -
          </button>
          <span style={{ padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>{quantidade}</span>
          <button
            type="button"
            onClick={() => setQuantidade(quantidade + 1)}
            style={{ padding: '0.5rem 1rem', background: '#F3F4F6', borderLeft: '1px solid var(--border-light)', cursor: 'pointer' }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href={createWhatsappUrl(mensagemWhatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ flex: 1 }}
        >
          <MessageCircle size={20} />
          Comprar pelo WhatsApp
        </a>

        <button
          type="button"
          onClick={handleAddToCart}
          className="btn-outline"
          style={{ flex: 1 }}
        >
          <ShoppingCart size={20} />
          Adicionar a lista
        </button>
      </div>
    </div>
  );
}
