// Einstiegspunkt: Prozess-Lifecycle (Start, Signale, Shutdown, fatale Fehler)
// Start: node --run start      bzw.   node --run dev

import { once } from 'node:events';
import { loadConfig } from './config.js';
import { createApp } from './app.js';
import { createLogger } from '#lib/logger';

const config = loadConfig();
const logger = createLogger({ level: config.logLevel });
const app = createApp({ config, logger });

app.server.listen(config.port);
await once(app.server, 'listening');
logger.info('server started', { url: `http://localhost:${config.port}`, pid: process.pid });

// #region 1: Graceful Shutdown bei SIGINT (Ctrl+C) und SIGTERM (Docker, Kubernetes)
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info('shutting down', { signal });

  // Notbremse, falls offene Verbindungen den Shutdown blockieren
  setTimeout(() => {
    logger.error('shutdown timeout – forcing exit');
    process.exit(1);
  }, config.shutdownTimeout).unref();

  await app.close();
  logger.info('shutdown complete');
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
// #endregion

// #region 2: Fatale Fehler loggen – und den Prozess bewusst sterben lassen
process.on('uncaughtExceptionMonitor', (err, origin) => {
  logger.error('fatal error', { origin, err });
});
// #endregion
