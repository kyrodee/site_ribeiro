import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'ribeiro_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'a-very-long-and-secure-secret-key-32-chars-long';
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  nome: string;
  exp: number;
}

// Hash de senha usando PBKDF2
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
}

// Cria e assina o token de sessão
export function createSessionToken(payload: Omit<SessionPayload, 'exp'>): string {
  const exp = Date.now() + SESSION_EXPIRY;
  const sessionPayload: SessionPayload = { ...payload, exp };
  
  const payloadStr = JSON.stringify(sessionPayload);
  const payloadB64 = Buffer.from(payloadStr).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');
    
  return `${payloadB64}.${signature}`;
}

// Verifica a assinatura e retorna o payload decodificado
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;
    
    // Verifica assinatura
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadB64)
      .digest('base64url');
      
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    
    // Decodifica payload
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadStr) as SessionPayload;
    
    // Verifica expiração
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

// Obtém o payload da sessão atual a partir dos cookies
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// Define o cookie de sessão no navegador
export async function setSessionCookie(payload: Omit<SessionPayload, 'exp'>): Promise<void> {
  const token = createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY / 1000,
    path: '/',
  });
}

// Remove o cookie de sessão (logout)
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
