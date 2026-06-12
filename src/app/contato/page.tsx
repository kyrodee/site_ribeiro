import { Clock, Mail, MapPin, MessageCircle, Phone, SearchCheck, Truck } from 'lucide-react';
import {
  BUSINESS_HOURS,
  SERVICE_REGION,
  STORE_ADDRESS,
  STORE_EMAIL,
  STORE_NAME,
  WHATSAPP_DISPLAY,
  createWhatsappUrl,
} from '@/lib/site-config';
import styles from './page.module.css';

const quickActions = [
  {
    icon: SearchCheck,
    title: 'Confirmar aplicação',
    text: 'Envie referência, chassi ou modelo do veículo para a equipe validar a peça correta.',
    message: `Olá! Vim pelo site da ${STORE_NAME} e quero confirmar a aplicação de uma peça.`,
  },
  {
    icon: Truck,
    title: 'Consultar entrega',
    text: `Atendimento para ${SERVICE_REGION}, com prazo e taxa confirmados pelo WhatsApp.`,
    message: `Olá! Vim pelo site da ${STORE_NAME} e quero consultar entrega para minha região.`,
  },
  {
    icon: MessageCircle,
    title: 'Falar com vendas',
    text: 'Tire dúvidas, envie seu orçamento ou peça ajuda para encontrar um item do catálogo.',
    message: `Olá! Vim pelo site da ${STORE_NAME} e gostaria de falar com um vendedor.`,
  },
];

export default function Contato() {
  return (
    <div className={`container ${styles.contactPage}`}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Atendimento comercial</span>
        <h1>Fale com a Ribeiro Auto Peças</h1>
        <p>
          Tire dúvidas, confirme compatibilidade e feche pedidos pelo WhatsApp com envio para Salvador-BA
          e Região Metropolitana.
        </p>
        <a
          href={createWhatsappUrl(`Olá! Vim pelo site da ${STORE_NAME} e gostaria de atendimento.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <MessageCircle size={22} />
          Chamar no WhatsApp
        </a>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.contactPanel}>
          <h2>Dados de contato</h2>
          <ul className={styles.infoList}>
            <li>
              <Phone size={22} />
              <div>
                <strong>WhatsApp</strong>
                <span>{WHATSAPP_DISPLAY}</span>
              </div>
            </li>
            <li>
              <Mail size={22} />
              <div>
                <strong>E-mail</strong>
                <span>{STORE_EMAIL}</span>
              </div>
            </li>
            <li>
              <MapPin size={22} />
              <div>
                <strong>Região atendida</strong>
                <span>{STORE_ADDRESS} - entregas em {SERVICE_REGION}</span>
              </div>
            </li>
            <li>
              <Clock size={22} />
              <div>
                <strong>Horário</strong>
                {BUSINESS_HOURS.map((hour) => (
                  <span key={hour}>{hour}</span>
                ))}
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.actionGrid}>
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <a
                key={action.title}
                href={createWhatsappUrl(action.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionCard}
              >
                <Icon size={24} />
                <strong>{action.title}</strong>
                <span>{action.text}</span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
