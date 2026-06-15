export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5571987929619').replace(/\D/g, '');

export const STORE_NAME = 'Ribeiro Auto Peças';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ribeiroautopecasba.com.br';

export const SERVICE_REGION = 'todo o Brasil';

export const WHATSAPP_DISPLAY = process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '(71) 98792-9619';

export const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || 'ribeiroautopecas.financeiro@gmail.com';

export const STORE_ADDRESS = process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Estrada Campinas de Pirajá, 14A, Salvador - BA, 41275-004';

export const STORE_LOCATIONS = [
  {
    label: 'Matriz',
    address: 'Estrada Campinas de Pirajá, 14A',
    district: 'Salvador - BA',
    postalCode: 'CEP 41275-004',
  },
  {
    label: 'Filial Espírito Santo',
    address: 'Rua Hortência, 180, Galpão',
    district: 'Santa Paula I, Vila Velha - ES',
    postalCode: 'CEP 29126-168',
  },
] as const;

export const BUSINESS_HOURS = ['Segunda a sexta: 08h às 18h', 'Sábados: 08h às 12h'];

export function createWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
