import { z } from 'zod';
import crypto from 'crypto';

// Credenciais de admin seguras (em produção, use variáveis de ambiente)
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@lebtech.com',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || hashPassword('admin123'),
};

// Função para fazer hash de senha
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Função para verificar senha
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Validação de credenciais de admin
export function validateAdminCredentials(email: string, password: string): boolean {
  if (email !== ADMIN_CREDENTIALS.email) {
    return false;
  }
  return verifyPassword(password, ADMIN_CREDENTIALS.passwordHash);
}

// Schema de login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Geração de token JWT simples (em produção, use uma biblioteca apropriada)
export function generateToken(email: string): string {
  const payload = {
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'your-secret-key')
    .update(`${header}.${body}`)
    .digest('base64');

  return `${header}.${body}.${signature}`;
}

// Verificação de token JWT
export function verifyToken(token: string): { email: string } | null {
  try {
    const [header, body, signature] = token.split('.');

    // Verificar assinatura
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'your-secret-key')
      .update(`${header}.${body}`)
      .digest('base64');

    if (signature !== expectedSignature) {
      return null;
    }

    // Decodificar payload
    const payload = JSON.parse(Buffer.from(body, 'base64').toString());

    // Verificar expiração
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return { email: payload.email };
  } catch {
    return null;
  }
}

// Tipo de sessão de admin
export type AdminSession = {
  email: string;
  token: string;
  expiresAt: number;
};
