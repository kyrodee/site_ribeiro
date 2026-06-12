import Link from 'next/link';
import styles from './page.module.css';

export default function Sobre() {
  return (
    <div className={`container ${styles.sobrePage}`}>
      <section className={styles.hero}>
        <h1>Sobre a <span className={styles.heroAccent}>Ribeiro Auto Peças</span></h1>
        <p className={styles.heroSubtitle}>
          Há mais de duas décadas fornecendo peças de linha pesada com qualidade, agilidade e confiança para manter sua frota rodando.
        </p>
      </section>

      <div className={styles.content}>
        <p className={styles.introText}>
          Fundada há mais de duas décadas, a <strong>Ribeiro Auto Peças</strong> nasceu da paixão por caminhões e do compromisso em manter a frota brasileira rodando com segurança e eficiência nas estradas.
        </p>
        
        <p className={styles.introText}>
          Somos especialistas em linha pesada, oferecendo o maior catálogo da região para marcas como Volvo, Scania, Mercedes-Benz, Volkswagen e Iveco. Trabalhamos exclusivamente com fornecedores homologados e marcas de primeira linha, garantindo a procedência de cada item vendido.
        </p>
        
        <div className={styles.missionCard}>
          <h2>Nossa Missão</h2>
          <p>
            Oferecer soluções ágeis e peças de alta confiabilidade para caminhoneiros e frotistas, minimizando o tempo de veículo parado e garantindo a rentabilidade dos nossos parceiros.
          </p>
        </div>

        <section className={styles.featureSection}>
          <h2>Por que escolher a Ribeiro?</h2>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <span className={styles.featureBullet}>01</span>
              <span className={styles.featureText}>Estoque amplo e a pronta entrega;</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureBullet}>02</span>
              <span className={styles.featureText}>Equipe de especialistas para tirar dúvidas técnicas;</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureBullet}>03</span>
              <span className={styles.featureText}>Garantia contra defeitos de fabricação em todas as peças;</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureBullet}>04</span>
              <span className={styles.featureText}>Atendimento humanizado via WhatsApp.</span>
            </li>
          </ul>
        </section>

        <div className={styles.ctaSection}>
          <p>Explore nosso catálogo completo de peças para linha pesada</p>
          <Link href="/produtos" className="btn-primary">
            Conhecer Nossos Produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
