import styles from '@/app/page.module.css';

// Componentes SVG simulando as logos das marcas de forma limpa e vetorial
const VolvoLogo = () => (
  <svg viewBox="0 0 150 40" className={styles.brandLogo}>
    <text x="10" y="32" fontFamily="Arial" fontWeight="900" fontSize="36" letterSpacing="2">VOLVO</text>
  </svg>
);

const ScaniaLogo = () => (
  <svg viewBox="0 0 160 40" className={styles.brandLogo}>
    <text x="10" y="32" fontFamily="Arial" fontWeight="900" fontSize="36" letterSpacing="4">SCANIA</text>
  </svg>
);

const MercedesLogo = () => (
  <svg viewBox="0 0 320 40" className={styles.brandLogo}>
    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M20 4 L20 20 L6 28 M20 20 L34 28" stroke="currentColor" strokeWidth="3" fill="none"/>
    <text x="50" y="30" fontFamily="Arial" fontWeight="800" fontSize="28" letterSpacing="1">MERCEDES-BENZ</text>
  </svg>
);

const IvecoLogo = () => (
  <svg viewBox="0 0 140 40" className={styles.brandLogo}>
    <text x="10" y="32" fontFamily="Arial" fontWeight="900" fontSize="38" letterSpacing="2">IVECO</text>
  </svg>
);

const VolkswagenLogo = () => (
  <svg viewBox="0 0 280 40" className={styles.brandLogo}>
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <path d="M7 12 L14 28 L20 12 L26 28 L33 12 M7 5 L20 32 L33 5" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <text x="55" y="30" fontFamily="Arial" fontWeight="800" fontSize="26" letterSpacing="1">VOLKSWAGEN</text>
  </svg>
);

const DafLogo = () => (
  <svg viewBox="0 0 120 40" className={styles.brandLogo}>
    <text x="10" y="34" fontFamily="Arial" fontWeight="900" fontSize="40" letterSpacing="2">DAF</text>
  </svg>
);

const WabcoLogo = () => (
  <svg viewBox="0 0 160 40" className={styles.brandLogo}>
    <text x="10" y="32" fontFamily="Arial" fontWeight="900" fontSize="36" letterSpacing="3">WABCO</text>
  </svg>
);

const BoschLogo = () => (
  <svg viewBox="0 0 160 40" className={styles.brandLogo}>
    <text x="10" y="32" fontFamily="Arial" fontWeight="900" fontSize="36" letterSpacing="2">BOSCH</text>
  </svg>
);

export default function BrandCarousel() {
  const logos = [
    <VolvoLogo key="volvo" />,
    <ScaniaLogo key="scania" />,
    <MercedesLogo key="mb" />,
    <IvecoLogo key="iveco" />,
    <VolkswagenLogo key="vw" />,
    <DafLogo key="daf" />,
    <WabcoLogo key="wabco" />,
    <BoschLogo key="bosch" />
  ];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        {/* Renderiza as logos duas vezes para criar o loop infinito sem quebra */}
        {logos.map((logo, idx) => <div key={`logo-1-${idx}`}>{logo}</div>)}
        {logos.map((logo, idx) => <div key={`logo-2-${idx}`}>{logo}</div>)}
      </div>
    </div>
  );
}
