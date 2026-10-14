import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsError } from '../common/errors/domain-errors.js';
import { UsersService } from '../users/users.service.js';
import type { TokenPayload } from './auth-user.js';
import type { Credentials } from './auth.schemas.js';
import { PasswordHasher } from './password-hasher.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password }: Credentials) {
    const passwordHash = await this.passwordHasher.hash(password);
    return this.usersService.create({ email, passwordHash, role: 'user' });
  }

  async signIn({
    email,
    password,
  }: Credentials): Promise<{ accessToken: string }> {
    // #region 2.6: Passwort prüfen und Access Token ausstellen
    const user = await this.usersService.findByEmail(email);
    const valid =
      user && (await this.passwordHasher.verify(password, user.passwordHash));
    if (!valid) throw new InvalidCredentialsError();

    const payload: TokenPayload = { sub: user.id, role: user.role };
    return { accessToken: await this.jwtService.signAsync(payload) };
    // #live
    // throw new Error(`TODO 2.6: Login für ${email} mit ${password.length} Zeichen`);
    // #endregion
  }
}
