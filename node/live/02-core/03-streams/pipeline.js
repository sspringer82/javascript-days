// Streams mit pipeline() und Async-Generatoren
// Start: node pipeline.js

import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { createGzip } from 'node:zlib';
import { join } from 'node:path';

const logFile = join(import.meta.dirname, 'access.log');
const errorFile = join(import.meta.dirname, 'errors.log.gz');

function* generateLogLines(count) {
  const paths = ['/', '/api/users', '/api/orders', '/health'];
  const statuses = [200, 200, 200, 201, 404, 500];
  for (let i = 0; i < count; i++) {
    const path = paths[i % paths.length];
    const status = statuses[(i * 7) % statuses.length];
    yield `${new Date(1_760_000_000_000 + i * 1000).toISOString()} GET ${path} ${status} ${i % 250}ms\n`;
  }
}

async function* splitLines(source) {
  let rest = '';
  for await (const chunk of source) {
    const lines = (rest + chunk).split('\n');
    rest = lines.pop();
    yield* lines;
  }
  if (rest) yield rest;
}

// TODO 1: Readable.from – Stream aus einem (Async) Iterable

// TODO 2: pipeline mit Async-Generatoren als Transform-Schritte

// TODO 3: Abbrechen mit AbortSignal – alle Streams werden sauber zerstört

// TODO 4: Async Iteration direkt – ohne pipeline
