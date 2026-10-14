import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { InvalidCredentialsError } from '../common/errors/domain-errors.js';
import type { User } from '../users/user.js';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import { PasswordHasher } from './password-hasher.js';

// Schneller Fake – scrypt ist absichtlich langsam
class PlainPasswordHasher extends PasswordHasher {
  async hash(password: string) {
    return `plain$${password}`;
  }
  async verify(password: string, hash: string) {
    return hash === `plain$${password}`;
  }
}

const basti: User = {
  id: 7,
  email: 'basti@example.com',
  passwordHash: 'plain$geheim123',
  role: 'user',
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('AuthService', () => {
  // Mock: nur die Methoden, die der Service wirklich nutzt
  const usersService = { findByEmail: vi.fn(), create: vi.fn() };
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    vi.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: PasswordHasher, useClass: PlainPasswordHasher },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    jwtService = moduleRef.get(JwtService);
  });

  it('registriert mit gehashtem Passwort und Rolle user', async () => {
    usersService.create.mockResolvedValue(basti);

    await authService.register({ email: basti.email, password: 'geheim123' });

    expect(usersService.create).toHaveBeenCalledWith({
      email: basti.email,
      passwordHash: 'plain$geheim123',
      role: 'user',
    });
  });

  it('stellt bei korrektem Passwort ein Token aus', async () => {
    usersService.findByEmail.mockResolvedValue(basti);

    const { accessToken } = await authService.signIn({
      email: basti.email,
      password: 'geheim123',
    });

    expect(jwtService.verify(accessToken)).toMatchObject({
      sub: 7,
      role: 'user',
    });
  });

  it.each([
    ['falsches Passwort', basti],
    ['unbekannte E-Mail', undefined],
  ])('lehnt %s ab', async (_case, user) => {
    usersService.findByEmail.mockResolvedValue(user);

    await expect(
      authService.signIn({ email: basti.email, password: 'falsch123' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
