import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedRequest } from '../auth-user.js';
import { Public } from '../decorators/public.decorator.js';
import { AuthGuard } from './auth.guard.js';

@Public()
class PublicController {
  handler() {}
}

class PrivateController {
  handler() {}
}

// Minimaler ExecutionContext – mehr braucht der Guard nicht
function contextFor(
  controller: typeof PublicController,
  headers: Record<string, string> = {},
) {
  const request = { headers } as AuthenticatedRequest;
  const context = {
    getHandler: () => controller.prototype.handler,
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe('AuthGuard', () => {
  const jwtService = new JwtService({ secret: 'test-secret' });
  const guard = new AuthGuard(jwtService, new Reflector());

  it('lässt @Public() ohne Token durch', async () => {
    const { context } = contextFor(PublicController);
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('weist Requests ohne Token ab', async () => {
    const { context } = contextFor(PrivateController);
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('weist ungültige Tokens ab', async () => {
    const { context } = contextFor(PrivateController, {
      authorization: 'Bearer kaputt',
    });
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('legt den User aus dem Token am Request ab', async () => {
    const token = await jwtService.signAsync({ sub: 42, role: 'admin' });
    const { context, request } = contextFor(PrivateController, {
      authorization: `Bearer ${token}`,
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({ id: 42, role: 'admin' });
  });
});
