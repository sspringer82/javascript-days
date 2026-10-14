// Globaler Guard: jeder Request braucht ein gültiges Bearer Token,
// außer Handler oder Controller sind mit @Public() markiert.

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedRequest, TokenPayload } from '../auth-user.js';
import { Public } from '../decorators/public.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO 2.8: Öffentliche Routen überspringen

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // TODO 2.7: Bearer Token prüfen und User am Request ablegen
    // Bis Auth fertig ist: jeder Request ist der Admin (id 1)
    request.user = { id: 1, role: 'admin' };
    return true;
  }
}

// TODO 2.7: Bearer Token aus dem Header lesen
