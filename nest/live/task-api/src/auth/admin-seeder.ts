// Lifecycle Hook: läuft, nachdem alle Module initialisiert sind
// (also auch nachdem die Repositories ihre Tabellen angelegt haben).

import {
  Inject,
  Injectable,
  Logger,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';
import { authConfig } from './auth.config.js';
import { PasswordHasher } from './password-hasher.js';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async onApplicationBootstrap() {
    const { admin } = this.config;
    if (!admin || (await this.usersService.findByEmail(admin.email))) return;

    await this.usersService.create({
      email: admin.email,
      passwordHash: await this.passwordHasher.hash(admin.password),
      role: 'admin',
    });
    this.logger.log(`Admin ${admin.email} angelegt`);
  }
}
