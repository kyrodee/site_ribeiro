import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToasterProvider from "@/components/ToasterProvider";
import FloatingActions from "@/components/FloatingActions";
import CartDrawer from "@/components/CartDrawer";
import {
  SERVICE_REGION,
  SITE_URL,
  STORE_ADDRESS,
  STORE_EMAIL,
  STORE_NAME,
  WHATSAPP_NUMBER,
} from "@/lib/site-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE_NAME} | Peças para Caminhões e Linha Pesada`,
    template: `%s | ${STORE_NAME}`,
  },
  description: `Catálogo de peças para caminhões, ônibus e linha pesada com consulta por código, referência e marca. Envio para ${SERVICE_REGION} com atendimento pelo WhatsApp.`,
  applicationName: STORE_NAME,
  keywords: [
    "auto peças",
    "peças para caminhão",
    "peças linha pesada",
    "peças para ônibus",
    "Ribeiro Auto Peças",
    "auto peças Salvador",
    "peças caminhão Bahia",
    "peças caminhão Espírito Santo",
    "peças caminhão Brasil",
    "envio de peças para todo Brasil",
    "catálogo de peças",
    "peças Volvo",
    "peças Scania",
    "peças Mercedes-Benz",
    "peças DAF",
    "peças MAN",
  ],
  authors: [{ name: STORE_NAME }],
  creator: STORE_NAME,
  publisher: STORE_NAME,
  category: "auto parts",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: STORE_NAME,
    title: `${STORE_NAME} | Peças para Caminhões e Linha Pesada`,
    description: `Consulte peças de linha pesada por nome, código, referência, marca ou NCM e finalize o atendimento pelo WhatsApp.`,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${STORE_NAME} - Catálogo de peças para linha pesada`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE_NAME} | Peças para Caminhões e Linha Pesada`,
    description: "Catálogo de peças para linha pesada com atendimento consultivo pelo WhatsApp.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const businessStructuredData = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: STORE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-truck.png`,
  image: `${SITE_URL}/og-image.svg`,
  email: STORE_EMAIL,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: STORE_ADDRESS,
    addressRegion: "BA",
    addressCountry: "BR",
  },
  areaServed: [
    "Brasil",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: `+${WHATSAPP_NUMBER}`,
    contactType: "sales",
    areaServed: "BR",
    availableLanguage: "pt-BR",
  },
  sameAs: [SITE_URL],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessStructuredData) }}
        />
        <Header />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>{children}</main>
        <Footer />
        <ToasterProvider />
        <FloatingActions />
        <CartDrawer />
      </body>
    </html>
  );
}
