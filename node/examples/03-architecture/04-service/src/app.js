// Composition Root: Hier – und nur hier – werden die Schichten verdrahtet.

import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { createRouter } from '#lib/http';
import { createLogger } from '#lib/logger';
import { SqliteTaskRepository } from '#tasks/task.repository';
import { TaskService } from '#tasks/task.service';
import { registerTaskRoutes } from '#tasks/task.routes';

export function createApp({ config, logger = createLogger({ level: config.logLevel }) }) {
  // #region 1: Schichten von innen nach außen zusammenstecken
  const db = new DatabaseSync(config.dbFile);
  const taskRepository = new SqliteTaskRepository(db);
  const taskService = new TaskService({ taskRepository, logger });

  const router = createRouter({ logger });
  router.get('/health', () => ({ body: { status: 'ok', uptime: process.uptime() } }));
  registerTaskRoutes(router, { taskService });

  const server = createServer(router.handler);
  // #endregion

  // #region 2: Sauber herunterfahren – erst keine neuen Requests, dann Ressourcen schließen
  async function close() {
    const closed = new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    server.closeIdleConnections();
    await closed;
    db.close();
  }
  // #endregion

  return { server, close };
}
