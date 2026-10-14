// Observability mit Bordmitteln: Kontext, Tracing, Metriken
// Start: node server.js   (startet Server, schickt Requests, beendet sich)

import { createServer } from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';
import diagnosticsChannel from 'node:diagnostics_channel';
import { createHistogram, performance } from 'node:perf_hooks';
import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import { once } from 'node:events';

// TODO 1: AsyncLocalStorage – Request-Kontext ohne Parameter-Durchreichen

// TODO 2: TracingChannel – eigene Instrumentierungspunkte

// TODO 3: Built-in Channels – HTTP beobachten ohne Monkey-Patching

// TODO 4: Metriken mit perf_hooks.createHistogram

const server = createServer((req, res) => {
  // TODO 1: AsyncLocalStorage – Request-Kontext ohne Parameter-Durchreichen
});

async function handle(req, res) {
  log('info', 'handling', { url: req.url });
  const rows = await query('SELECT * FROM orders');
  await sleep(5); // Kontext bleibt über beliebig viele awaits erhalten
  log('info', 'loaded', { rows: rows.length });
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(rows));
}

server.listen(0);
await once(server, 'listening');
const url = `http://localhost:${server.address().port}`;

await Promise.all(
  ['a1', 'b2', 'c3'].map((id) => fetch(`${url}/orders`, { headers: { 'x-request-id': id } }).then((r) => r.text())),
);

// TODO 4: Metriken mit perf_hooks.createHistogram

server.close();
