import jwt, { SignOptions } from 'jsonwebtoken';

export interface AuthTokenPayload {
  userId: string;
  role: 'user' | 'admin';
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(payload: AuthTokenPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}