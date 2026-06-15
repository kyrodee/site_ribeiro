import { SERVICE_REGION } from '@/lib/site-config';
import styles from './page.module.css';

export default function FAQ() {
  const faqs = [
    {
      q: "Vocês enviam para quais regiões?",
      a: `Enviamos para ${SERVICE_REGION}. Prazo, disponibilidade e frete são confirmados pelo WhatsApp antes do fechamento.`
    },
    {
      q: "As peças têm garantia?",
      a: "Todas as nossas peças possuem garantia de fábrica contra defeitos de fabricação, que varia de 3 a 12 meses dependendo do fabricante."
    },
    {
      q: "Como faço para comprar?",
      a: "Nosso processo de venda é focado no atendimento personalizado. Encontre a peça no nosso catálogo e clique em 'Comprar pelo WhatsApp'. Um de nossos consultores vai confirmar a aplicação exata para o seu caminhão e passar as opções de frete e pagamento."
    },
    {
      q: "Quais são as formas de pagamento?",
      a: "Aceitamos PIX, transferência bancária, boleto faturado (sob análise de crédito para frotistas) e cartões de crédito via link de pagamento seguro."
    },
    {
      q: "A peça que procuro não está no site. Vocês conseguem sob encomenda?",
      a: "Com certeza! Temos acesso direto ao estoque de grandes fabricantes e distribuidores. Chame no WhatsApp com o número do chassi do seu veículo ou a referência da peça que encontramos para você."
    }
  ];

  return (
    <div className={`container ${styles.faqPage}`}>
      <section className={styles.hero}>
        <h1>Perguntas Frequentes (FAQ)</h1>
        <p className={styles.heroSubtitle}>
          Encontre respostas rápidas sobre nossos produtos, envio e formas de pagamento.
        </p>
      </section>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <span className={styles.faqNumber}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className={styles.faqContent}>
              <h3 className={styles.faqQuestion}>
                {faq.q}
              </h3>
              <hr className={styles.faqSeparator} />
              <p className={styles.faqAnswer}>
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
