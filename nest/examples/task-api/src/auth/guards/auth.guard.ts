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
    // #region 2.8: Öffentliche Routen überspringen
    const isPublic = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    // #endregion

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // #region 2.7: Bearer Token prüfen und User am Request ablegen
    const token = extractBearerToken(request);
    if (!token) throw new UnauthorizedException('Bearer Token fehlt');

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);
      request.user = { id: payload.sub, role: payload.role };
    } catch (error) {
      throw new UnauthorizedException('Token ungültig oder abgelaufen', {
        cause: error,
      });
    }
    // #live
    // // Bis Auth fertig ist: jeder Request ist der Admin (id 1)
    // request.user = { id: 1, role: 'admin' };
    // #endregion
    return true;
  }
}

// #region 2.7: Bearer Token aus dem Header lesen
function extractBearerToken(request: AuthenticatedRequest) {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
// #endregion
