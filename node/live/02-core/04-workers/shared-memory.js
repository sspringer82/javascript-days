// SharedArrayBuffer + Atomics: Speicher zwischen Threads teilen
// Start: node shared-memory.js

import { Worker, isMainThread, workerData } from 'node:worker_threads';
import { once } from 'node:events';

const WORKERS = 4;
const INCREMENTS = 1_000_000;

if (isMainThread) {
  // TODO 1: Gemeinsamen Speicher anlegen und an Worker übergeben

  console.log('erwartet:      ', WORKERS * INCREMENTS);
  console.log('ohne Atomics:  ', counters[0], '← Race Condition');
  console.log('mit Atomics:   ', counters[1]);
} else {
  const counters = new Int32Array(workerData);
  for (let i = 0; i < INCREMENTS; i++) {
    counters[0]++;
    // TODO 2: Atomare Operationen
  }
}
