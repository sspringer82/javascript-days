// SharedArrayBuffer + Atomics: Speicher zwischen Threads teilen
// Start: node shared-memory.js

import { Worker, isMainThread, workerData } from 'node:worker_threads';
import { once } from 'node:events';

const WORKERS = 4;
const INCREMENTS = 1_000_000;

if (isMainThread) {
  // #region 1: Gemeinsamen Speicher anlegen und an Worker übergeben
  const shared = new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT);
  const counters = new Int32Array(shared); // [0] = naiv, [1] = atomar

  const workers = Array.from({ length: WORKERS }, () => new Worker(import.meta.filename, { workerData: shared }));
  await Promise.all(workers.map((worker) => once(worker, 'exit')));
  // #endregion

  console.log('erwartet:      ', WORKERS * INCREMENTS);
  console.log('ohne Atomics:  ', counters[0], '← Race Condition');
  console.log('mit Atomics:   ', counters[1]);
} else {
  const counters = new Int32Array(workerData);
  for (let i = 0; i < INCREMENTS; i++) {
    counters[0]++;
    // #region 2: Atomare Operationen
    Atomics.add(counters, 1, 1);
    // #endregion
  }
}
