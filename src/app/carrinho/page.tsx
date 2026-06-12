'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ChevronLeft, MapPin, MessageCircle, Minus, Plus, Trash2, Share2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSyncExternalStore, useState, useEffect } from 'react';
import { createWhatsappUrl, SERVICE_REGION, STORE_NAME } from '@/lib/site-config';
import toast from 'react-hot-toast';
import styles from './page.module.css';

type Fulfillment = 'entrega' | 'retirada';
type Intent = 'fechar' | 'duvida';

const paymentOptions = [
  'PIX',
  'Cartão de crédito/débito',
  'Dinheiro na retirada/entrega',
  'Boleto ou transferência',
  'A combinar',
];

export default function Carrinho() {
  const { items, removeItem, updateQuantity, getTotalItems, addItem } = useCartStore();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [intent, setIntent] = useState<Intent>('fechar');
  const [fulfillment, setFulfillment] = useState<Fulfillment>('entrega');
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  const [city, setCity] = useState('Salvador-BA');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Parse shared URL cart parameter
  useEffect(() => {
    if (!mounted) return;

    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');
    if (!shareParam) return;

    async function loadSharedItems(shareStr: string) {
      try {
        const pairs = shareStr.split(',').filter(Boolean);
        if (pairs.length === 0) return;

        const idToQty: Record<string, number> = {};
        for (const pair of pairs) {
          const [id, qtyStr] = pair.split(':');
          if (id) {
            idToQty[id] = Number.parseInt(qtyStr, 10) || 1;
          }
        }

        const ids = Object.keys(idToQty);
        if (ids.length === 0) return;

        const response = await fetch(`/api/produtos?ids=${ids.join(',')}`);
        if (response.ok) {
          const products = await response.json();
          if (products && Array.isArray(products) && products.length > 0) {
            products.forEach((product: any) => {
              const qty = idToQty[product.id] || 1;
              addItem(product, qty);
            });

            toast.success(`${products.length} peça(s) carregada(s) do link compartilhado!`);

            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }
      } catch (err) {
        console.error('Erro ao processar peças compartilhadas:', err);
      }
    }

    loadSharedItems(shareParam);
  }, [mounted, addItem]);

  // 3. Share cart function
  const handleShareCart = () => {
    if (items.length === 0) return;

    try {
      const shareQuery = items.map(item => `${item.produto.id}:${item.quantidade}`).join(',');
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(shareQuery)}`;
      
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link de compartilhamento copiado!');
    } catch (err) {
      toast.error('Erro ao gerar link de compartilhamento.');
    }
  };

  if (!mounted) {
    return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Carregando orçamento...</div>;
  }

  const knownTotal = items.reduce((acc, item) => acc + (item.produto.preco || 0) * item.quantidade, 0);
  const hasKnownPrices = items.some((item) => item.produto.preco);
  const totalItems = getTotalItems();

  const buildWhatsappMessage = () => {
    const lines = [
      `Olá! Vim pelo site da ${STORE_NAME} e ${intent === 'fechar' ? 'quero fechar/confirmar este pedido' : 'quero tirar uma dúvida sobre este pedido'}.`,
      '',
      'DADOS DO CLIENTE',
      `Nome: ${customerName.trim()}`,
      `Telefone para contato: ${customerPhone.trim() || 'Não informado'}`,
      `Atendimento: ${fulfillment === 'entrega' ? `Entrega em ${SERVICE_REGION}` : 'Retirada na loja'}`,
      `Forma de pagamento: ${paymentMethod}`,
    ];

    if (fulfillment === 'entrega') {
      lines.push(`Cidade: ${city.trim() || 'Não informada'}`);
      lines.push(`Bairro: ${neighborhood.trim() || 'Não informado'}`);
      lines.push(`Endereço: ${address.trim() || 'Não informado'}`);
    }

    if (notes.trim()) {
      lines.push(`Observações: ${notes.trim()}`);
    }

    lines.push('');
    lines.push('ITENS DO PEDIDO');

    items.forEach((item, index) => {
      const produto = item.produto;
      lines.push(`${index + 1}. ${produto.nome}`);
      lines.push(`   Quantidade: ${item.quantidade} ${produto.unidade || 'UN'}`);
      lines.push(`   Código: ${produto.codigoInterno}`);
      lines.push(`   Referência: ${produto.referencia}`);
      lines.push(`   Marca/Categoria: ${produto.marca || 'Não informada'} / ${produto.categoria || 'Diversos'}`);
      lines.push(`   Valor no site: ${produto.preco ? `R$ ${(produto.preco * item.quantidade).toFixed(2).replace('.', ',')}` : 'Sob consulta'}`);
      lines.push('');
    });

    lines.push(`Resumo: ${items.length} produto(s), ${totalItems} unidade(s).`);

    if (hasKnownPrices) {
      lines.push(`Subtotal dos itens com preço: R$ ${knownTotal.toFixed(2).replace('.', ',')}`);
    }

    lines.push('');
    lines.push('Por favor, confirme disponibilidade, valor final, prazo e próximos passos para fechar a venda.');

    return lines.join('\n');
  };

  const handleWhatsapp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      window.open(createWhatsappUrl(buildWhatsappMessage()), '_blank', 'noopener,noreferrer');
      toast.success('Lista aberta no WhatsApp. Combine disponibilidade, envio e pagamento com a equipe.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Não foi possível abrir o WhatsApp. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`container ${styles.emptyState}`}>
        <h1 className="section-title" style={{ textAlign: 'center' }}>Seu Orçamento</h1>
        <div className={styles.emptyCard}>
          <p>Você ainda não adicionou nenhuma peça à sua lista de orçamento.</p>
          <Link href="/produtos" className="btn-primary">
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cartPage}`}>
      <Link href="/produtos" className={styles.backLink}>
        <ChevronLeft size={16} /> Continuar adicionando peças
      </Link>

      <div className={styles.header}>
        <div>
          <h1 className="section-title">Enviar Lista pelo WhatsApp</h1>
          <p>Revise as peças, informe entrega ou retirada e mande tudo pronto para a equipe confirmar disponibilidade, envio e pagamento.</p>
        </div>
        <div className={styles.regionBadge}>
          <MapPin size={18} />
          Entregas em {SERVICE_REGION}
        </div>
      </div>

      <form onSubmit={handleWhatsapp} className={styles.cartContent}>
        <section className={styles.itemsPanel} aria-label="Itens do orçamento">
          <div className={styles.panelHeader}>
            <h2>Itens selecionados</h2>
            <span>{items.length} produto(s), {totalItems} unidade(s)</span>
          </div>

          <div className={styles.itemsList}>
            {items.map((item) => (
              <article key={item.produto.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {item.produto.imagemUrl ? (
                    <img src={item.produto.imagemUrl} alt={item.produto.nome} />
                  ) : (
                    <span>Sem imagem</span>
                  )}
                </div>

                <div className={styles.itemDetails}>
                  <span className={styles.itemMeta}>{item.produto.marca || item.produto.categoria || 'Produto'}</span>
                  <h3>{item.produto.nome}</h3>
                  <p>Ref: {item.produto.referencia} | Cód: {item.produto.codigoInterno}</p>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button type="button" onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)} aria-label="Diminuir quantidade">
                      <Minus size={16} />
                    </button>
                    <span>{item.quantidade}</span>
                    <button type="button" onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)} aria-label="Aumentar quantidade">
                      <Plus size={16} />
                    </button>
                  </div>
                  <strong>{item.produto.preco ? `R$ ${((item.produto.preco || 0) * item.quantidade).toFixed(2).replace('.', ',')}` : 'Sob consulta'}</strong>
                  <button type="button" className={styles.removeBtn} onClick={() => removeItem(item.produto.id)} title="Remover item">
                    <Trash2 size={20} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className={styles.checkoutPanel} aria-label="Dados para envio">
          <h2>Dados para atendimento</h2>

          <div className={styles.segmented}>
            <label>
              <input type="radio" name="intent" value="fechar" checked={intent === 'fechar'} onChange={() => setIntent('fechar')} />
              Fechar pedido
            </label>
            <label>
              <input type="radio" name="intent" value="duvida" checked={intent === 'duvida'} onChange={() => setIntent('duvida')} />
              Tirar dúvida
            </label>
          </div>

          <label className={styles.field}>
            Nome do cliente
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required placeholder="Seu nome" />
          </label>

          <label className={styles.field}>
            Telefone para retorno
            <input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="DDD + número" inputMode="tel" />
          </label>

          <div className={styles.segmented}>
            <label>
              <input type="radio" name="fulfillment" value="entrega" checked={fulfillment === 'entrega'} onChange={() => setFulfillment('entrega')} />
              Entrega
            </label>
            <label>
              <input type="radio" name="fulfillment" value="retirada" checked={fulfillment === 'retirada'} onChange={() => setFulfillment('retirada')} />
              Retirada
            </label>
          </div>

          {fulfillment === 'entrega' && (
            <div className={styles.deliveryBox}>
              <p>Atendemos entregas para {SERVICE_REGION}.</p>
              <label className={styles.field}>
                Cidade
                <input value={city} onChange={(event) => setCity(event.target.value)} required placeholder="Ex: Salvador-BA, Vila Velha-ES..." />
              </label>
              <label className={styles.field}>
                Bairro
                <input value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} required placeholder="Ex: Imbuí, Lauro de Freitas..." />
              </label>
              <label className={styles.field}>
                Endereço
                <input value={address} onChange={(event) => setAddress(event.target.value)} required placeholder="Rua, número e complemento" />
              </label>
            </div>
          )}

          <label className={styles.field}>
            Forma de pagamento
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              {paymentOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            Observações
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Chassi, urgência, dúvidas, horário para entrega..." rows={4} />
          </label>

          <div className={styles.summaryBox}>
            <span>Total de unidades</span>
            <strong>{totalItems}</strong>
            <span>Valores</span>
            <strong>{hasKnownPrices ? `A partir de R$ ${knownTotal.toFixed(2).replace('.', ',')}` : 'Sob consulta'}</strong>
          </div>

          <button type="submit" className={`btn-primary ${styles.checkoutBtn}`} disabled={isSubmitting}>
            <MessageCircle size={22} />
            {isSubmitting ? 'Abrindo WhatsApp...' : 'Enviar lista no WhatsApp'}
          </button>

          <button type="button" onClick={handleShareCart} className={styles.shareBtn}>
            <Share2 size={18} />
            Compartilhar Lista de Peças
          </button>

          <p className={styles.disclaimer}>
            A disponibilidade, o valor final, o prazo de envio e a forma de pagamento são confirmados pela equipe no WhatsApp.
          </p>
        </aside>
      </form>
    </div>
  );
}
