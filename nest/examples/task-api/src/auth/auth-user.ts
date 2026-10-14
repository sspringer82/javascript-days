import type { Request } from 'express';
import type { Role } from '../users/user.js';

// Inhalt des Access Tokens
export interface TokenPayload {
  sub: number;
  role: Role;
}

// Was der AuthGuard am Request ablegt
export interface AuthUser {
  id: number;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
