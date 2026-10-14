// Start: npm run start:dev   (im Ordner task-api)

import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.schema.js';

// Logs puffern, bis die Konfiguration geladen ist
const app = await NestFactory.create(AppModule, { bufferLogs: true });

const config = app.get<ConfigService<Env, true>>(ConfigService);
app.useLogger(
  new ConsoleLogger({ json: config.get('LOG_JSON', { infer: true }) }),
);

// SIGTERM/SIGINT → onModuleDestroy, onApplicationShutdown (z. B. DB schließen)
app.enableShutdownHooks();

await app.listen(config.get('PORT', { infer: true }));
