import { Module } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.js';
import { AdminSeeder } from './admin-seeder.js';
import { authConfig } from './auth.config.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './guards/auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { PasswordHasher, ScryptPasswordHasher } from './password-hasher.js';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(authConfig),
    // TODO 2.5: JwtModule mit Konfiguration aus dem Feature-Config
    JwtModule.register({ secret: 'TODO 2.5' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminSeeder,
    { provide: PasswordHasher, useClass: ScryptPasswordHasher },
    // Globale Guards: Reihenfolge = Ausführungsreihenfolge
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
