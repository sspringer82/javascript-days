// Composition Root: Hier – und nur hier – werden die Schichten verdrahtet.

import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { createRouter } from '#lib/http';
import { createLogger } from '#lib/logger';
import { SqliteTaskRepository } from '#tasks/task.repository';
import { TaskService } from '#tasks/task.service';
import { registerTaskRoutes } from '#tasks/task.routes';

export function createApp({ config, logger = createLogger({ level: config.logLevel }) }) {
  // TODO 1: Schichten von innen nach außen zusammenstecken

  // TODO 2: Sauber herunterfahren – erst keine neuen Requests, dann Ressourcen schließen

  return { server, close };
}
