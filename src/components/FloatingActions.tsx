'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { createWhatsappUrl } from '@/lib/site-config';

export default function FloatingActions() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      {/* Botão de Voltar ao Topo */}
      {showScrollBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            color: 'var(--primary-blue)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.85)',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform = 'translateY(-3px)';
            event.currentTarget.style.backgroundColor = 'var(--primary-blue)';
            event.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform = 'none';
            event.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            event.currentTarget.style.color = 'var(--primary-blue)';
          }}
        >
          <ArrowUp size={22} />
        </button>
      )}

      {/* Botão Flutuante do WhatsApp */}
      <a
        href={createWhatsappUrl('Olá! Gostaria de tirar algumas dúvidas sobre peças.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Suporte via WhatsApp"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          boxShadow: '0 6px 16px rgba(37, 211, 102, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = 'scale(1.1)';
          event.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.55)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = 'scale(1)';
          event.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.35)';
        }}
      >
        {/* Efeito de pulso para micro-animação */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid #25D366',
            animation: 'pulse 2s infinite',
            pointerEvents: 'none',
          }}
        />
        <MessageCircle size={28} fill="#ffffff" />
        
        {/* CSS inline para animação keyframes do pulso */}
        <style jsx global>{`
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              opacity: 0.8;
            }
            70% {
              transform: scale(1.3);
              opacity: 0;
            }
            100% {
              transform: scale(0.95);
              opacity: 0;
            }
          }
        `}</style>
      </a>
    </div>
  );
}
