import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToasterProvider from "@/components/ToasterProvider";
import FloatingActions from "@/components/FloatingActions";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ribeiro Auto Peças | Catálogo de Linha Pesada",
  description: "Catálogo de peças para caminhões, ônibus e linha pesada com atendimento por WhatsApp em Salvador-BA e Região Metropolitana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
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
