// Observability mit Bordmitteln: Kontext, Tracing, Metriken
// Start: node server.js   (startet Server, schickt Requests, beendet sich)

import { createServer } from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';
import diagnosticsChannel from 'node:diagnostics_channel';
import { createHistogram, performance } from 'node:perf_hooks';
import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import { once } from 'node:events';

// #region 1: AsyncLocalStorage – Request-Kontext ohne Parameter-Durchreichen
const requestContext = new AsyncLocalStorage();

function log(level, msg, data = {}) {
  const context = requestContext.getStore() ?? {};
  console.log(JSON.stringify({ level, msg, requestId: context.requestId, ...data }));
}
// #endregion

// #region 2: TracingChannel – eigene Instrumentierungspunkte
const dbChannel = diagnosticsChannel.tracingChannel('app:db.query');

async function query(sql) {
  return dbChannel.tracePromise(async () => {
    await sleep(10 + Math.random() * 40);
    return [{ id: 1 }];
  }, { sql });
}

// Ein Subscriber – z. B. ein APM-Agent – hängt sich ein, ohne den Code zu kennen
dbChannel.subscribe({
  start(ctx) {
    ctx.startedAt = performance.now();
  },
  asyncEnd(ctx) {
    log('debug', 'db query', { sql: ctx.sql, ms: Math.round(performance.now() - ctx.startedAt) });
  },
  error(ctx) {
    log('error', 'db query failed', { sql: ctx.sql, error: ctx.error.message });
  },
});
// #endregion

// #region 3: Built-in Channels – HTTP beobachten ohne Monkey-Patching
diagnosticsChannel.subscribe('http.server.request.start', ({ request }) => {
  request.startedAt = performance.now();
});

diagnosticsChannel.subscribe('http.server.response.finish', ({ request, response }) => {
  const ms = Math.round(performance.now() - request.startedAt);
  log('info', 'request', { method: request.method, url: request.url, status: response.statusCode, ms });
});
// #endregion

// #region 4: Metriken mit perf_hooks.createHistogram
const requestDurations = createHistogram();

diagnosticsChannel.subscribe('http.server.response.finish', ({ request }) => {
  requestDurations.record(Math.max(1, Math.round(performance.now() - request.startedAt)));
});
// #endregion

const server = createServer((req, res) => {
  // #region 1: AsyncLocalStorage – Request-Kontext ohne Parameter-Durchreichen
  const requestId = req.headers['x-request-id'] ?? randomUUID().slice(0, 8);
  requestContext.run({ requestId }, () => handle(req, res));
  // #endregion
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

// #region 4: Metriken mit perf_hooks.createHistogram
console.log({
  requests: requestDurations.count,
  p50: requestDurations.percentile(50),
  p99: requestDurations.percentile(99),
  max: requestDurations.max,
});
// #endregion

server.close();
