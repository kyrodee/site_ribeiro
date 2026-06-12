'use client';

import { useState } from 'react';

interface ProductTabsProps {
  nome: string;
  referencia: string;
  codigoInterno: string;
  marca: string | null;
  categoria: string | null;
  estoque: number;
  unidade?: string | null;
  ncm?: string | null;
}

export default function ProductTabs({
  nome,
  referencia,
  codigoInterno,
  marca,
  categoria,
  estoque,
  unidade,
  ncm,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'descricao' | 'especificacoes'>('descricao');

  return (
    <div style={{ marginTop: '3rem' }}>
      {/* Tab Selectors */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid var(--border-light)',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('descricao')}
          style={{
            background: activeTab === 'descricao' ? 'rgba(0, 116, 183, 0.06)' : 'none',
            border: 'none',
            padding: '0.85rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            color: activeTab === 'descricao' ? 'var(--accent-blue)' : 'var(--text-muted)',
            borderBottom: activeTab === 'descricao' ? '3px solid var(--accent-blue)' : '3px solid transparent',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            marginBottom: '-2px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            letterSpacing: '0.01em',
          }}
        >
          Descrição do Produto
        </button>
        <button
          onClick={() => setActiveTab('especificacoes')}
          style={{
            background: activeTab === 'especificacoes' ? 'rgba(0, 116, 183, 0.06)' : 'none',
            border: 'none',
            padding: '0.85rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            color: activeTab === 'especificacoes' ? 'var(--accent-blue)' : 'var(--text-muted)',
            borderBottom: activeTab === 'especificacoes' ? '3px solid var(--accent-blue)' : '3px solid transparent',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            marginBottom: '-2px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            letterSpacing: '0.01em',
          }}
        >
          Dados Técnicos / Ficha
        </button>
      </div>

      {/* Tab Panel Description */}
      {activeTab === 'descricao' && (
        <div
          style={{
            backgroundColor: 'var(--surface-white)',
            padding: '2rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.06)',
            animation: 'tabFadeIn 0.35s ease-out',
            color: 'var(--text-dark)',
            lineHeight: '1.85',
            fontSize: '1.05rem',
          }}
        >
          <p style={{ marginBottom: '1.25rem' }}>
            <strong>{nome}</strong>. Item catalogado para reposição em linha pesada.
            Antes de fechar o pedido, confirme a aplicação correta usando a referência <strong>{referencia}</strong> ou o código interno <strong>{codigoInterno}</strong>.
          </p>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            As imagens no catálogo podem ser ilustrativas. Em caso de dúvida sobre dimensões, marca ou encaixe, envie a referência pelo WhatsApp para que nossa equipe faça a conferência física do produto em nosso estoque.
          </p>
        </div>
      )}

      {/* Tab Panel Specs */}
      {activeTab === 'especificacoes' && (
        <div
          style={{
            backgroundColor: 'var(--surface-white)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.06)',
            animation: 'tabFadeIn 0.35s ease-out',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <tbody>
              <tr style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, width: '40%', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Montadora / Fabricante</th>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{marca || 'Não informada'}</td>
              </tr>
              <tr style={{ backgroundColor: 'var(--surface-white)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Categoria</th>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{categoria || 'Diversos'}</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Código de Referência</th>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{referencia}</td>
              </tr>
              <tr style={{ backgroundColor: 'var(--surface-white)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Código Interno da Loja</th>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{codigoInterno}</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Quantidade em Estoque</th>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {estoque > 0 ? `${estoque} ${unidade || 'UN'}` : 'Sob encomenda'}
                </td>
              </tr>
              {ncm && (
                <tr style={{ backgroundColor: 'var(--surface-white)' }}>
                  <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>NCM</th>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>{ncm}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
