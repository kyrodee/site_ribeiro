import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Footer.module.css';
import {
  BUSINESS_HOURS,
  SERVICE_REGION,
  STORE_EMAIL,
  STORE_LOCATIONS,
  WHATSAPP_DISPLAY,
  createWhatsappUrl,
} from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerColumn}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo-full-ui.png"
              alt="Ribeiro Auto Peças"
              width={230}
              height={130}
              className={styles.logoImage}
            />
          </Link>
          <p className={styles.companyDesc}>
            Especialistas em peças para linha pesada, com atendimento consultivo e entrega para Salvador-BA, Região Metropolitana e Espírito Santo.
          </p>
        </div>

        <div className={styles.footerColumn}>
          <h3>Links Rápidos</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/">Página Inicial</Link></li>
            <li><Link href="/produtos">Nosso Catálogo</Link></li>
            <li><Link href="/produtos?cat=motor">Peças de Motor</Link></li>
            <li><Link href="/carrinho">Meu Carrinho</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3>Institucional</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/sobre">Sobre Nós</Link></li>
            <li><Link href="/contato">Fale Conosco</Link></li>
            <li><Link href="/faq">Perguntas Frequentes</Link></li>
            <li><Link href="/faq">Política de Trocas</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3>Contato e Loja</h3>
          <ul className={styles.contactList}>
            <li>
              <MapPin size={18} />
              <div className={styles.locationsList}>
                {STORE_LOCATIONS.map((location) => (
                  <address key={location.label} className={styles.locationCard}>
                    <strong>{location.label}</strong>
                    <span>{location.address}</span>
                    <span>{location.district}</span>
                    <span>{location.postalCode}</span>
                  </address>
                ))}
                <span className={styles.deliveryText}>Entregas em {SERVICE_REGION}</span>
              </div>
            </li>
            <li>
              <Phone size={18} />
              <a href={createWhatsappUrl('Olá! Vim pelo site e gostaria de atendimento.')} target="_blank" rel="noopener noreferrer">
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <Mail size={18} />
              <span>{STORE_EMAIL}</span>
            </li>
            <li>
              <Clock size={18} />
              <span>{BUSINESS_HOURS.join(' | ')}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Ribeiro Auto Peças. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
