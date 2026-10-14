// Läuft nach dem AuthGuard (Reihenfolge der APP_GUARD-Registrierung).
// false → Nest antwortet automatisch mit 403 Forbidden.

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedRequest } from '../auth-user.js';
import { Roles } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // #region 3.2: Erforderliche Rollen lesen und vergleichen
    const roles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return user !== undefined && roles.includes(user.role);
    // #live
    // return true;
    // #endregion
  }
}
