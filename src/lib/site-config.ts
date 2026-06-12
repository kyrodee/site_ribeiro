export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5571999999999').replace(/\D/g, '');

export const STORE_NAME = 'Ribeiro Auto Peças';

export const SERVICE_REGION = 'Salvador-BA e Região Metropolitana';

export const WHATSAPP_DISPLAY = process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '(71) 99999-9999';

export const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || 'vendas@ribeiroautopecas.com.br';

export const STORE_ADDRESS = process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Salvador, BA';

export const BUSINESS_HOURS = ['Segunda a sexta: 08h às 18h', 'Sábados: 08h às 12h'];

export function createWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
