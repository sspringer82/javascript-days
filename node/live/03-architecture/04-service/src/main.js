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

// TODO 1: Graceful Shutdown bei SIGINT (Ctrl+C) und SIGTERM (Docker, Kubernetes)

// TODO 2: Fatale Fehler loggen – und den Prozess bewusst sterben lassen
