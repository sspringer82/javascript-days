// Composition Root: setzt die Feature-Module zusammen und registriert
// alles, was für jeden Request gilt. Globale Enhancer hier statt in main.ts,
// damit sie auch in Tests aktiv sind und Dependencies injiziert bekommen.

import {
  Module,
  StandardSchemaSerializerInterceptor,
  StandardSchemaValidationPipe,
} from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { envSchema } from './config/env.schema.js';
import { databaseConfig } from './database/database.config.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    // TODO 2.1: Konfiguration laden und validieren
    ConfigModule.forRoot({ isGlobal: true }),

    DatabaseModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => ({
        file: config.file,
      }),
    }),

    UsersModule,
    AuthModule,
    TasksModule,
    HealthModule,
  ],
  providers: [
    // Validiert jeden Parameter mit { schema }, alle anderen bleiben unberührt
    {
      provide: APP_PIPE,
      useFactory: () => new StandardSchemaValidationPipe(),
    },
    // Antworten durch @SerializeOptions({ schema }) filtern
    { provide: APP_INTERCEPTOR, useClass: StandardSchemaSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    // TODO 3.5: Fachliche Fehler zentral in HTTP übersetzen
  ],
})
export class AppModule {}
