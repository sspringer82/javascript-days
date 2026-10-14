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
    // #region 2.5: JwtModule mit Konfiguration aus dem Feature-Config
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: ConfigType<typeof authConfig>) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: config.jwtExpiresInSeconds },
      }),
    }),
    // #live
    // JwtModule.register({ secret: 'TODO 2.5' }),
    // #endregion
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
