'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem, getTotalItems } = useCartStore();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const totalItems = getTotalItems();
  const subtotal = items.reduce((acc, item) => acc + (item.produto.preco || 0) * item.quantidade, 0);
  const hasPrices = items.some(item => item.produto.preco);

  if (!isDrawerOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Background Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 59, 115, 0.4)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Drawer Body */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '450px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={22} color="var(--primary-blue)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)', margin: 0 }}>
              Seu Orçamento ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar orçamento"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '0.25rem',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(event) => (event.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <ShoppingBag size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Sua lista de orçamento está vazia.</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="btn-primary"
                style={{ marginTop: '1.5rem' }}
              >
                Explorar Peças
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item) => (
                <div
                  key={item.produto.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Item Image */}
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {item.produto.imagemUrl ? (
                      <img
                        src={item.produto.imagemUrl}
                        alt={item.produto.nome}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: '#9ca3af', textAlign: 'center', padding: '0.25rem' }}>
                        Sem imagem
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--secondary-blue)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.produto.marca || item.produto.categoria || 'PEÇA'}
                    </span>
                    <h3
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-dark)',
                        margin: '0.1rem 0 0.4rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.produto.nome}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Ref: {item.produto.referencia}
                    </div>

                    {/* Actions & Price */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-light)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                          style={{ padding: '0.25rem 0.5rem', background: '#f9fafb', border: 'none', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 0.75rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                          style={{ padding: '0.25rem 0.5rem', background: '#f9fafb', border: 'none', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                          {item.produto.preco
                            ? `R$ ${(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}`
                            : 'Sob consulta'}
                        </span>
                        <button
                          onClick={() => removeItem(item.produto.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            padding: '0.25rem',
                          }}
                          title="Remover item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: '#f9fafb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Estimado:</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-blue)' }}>
                  {hasPrices ? `R$ ${subtotal.toFixed(2).replace('.', ',')}` : 'Sob consulta'}
                </span>
                {!hasPrices && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Itens sem preço listado
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/carrinho"
              onClick={() => setDrawerOpen(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', fontSize: '1rem' }}
            >
              Fechar Orçamento (WhatsApp)
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
