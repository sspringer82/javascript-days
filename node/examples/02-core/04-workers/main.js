// CPU-lastige Arbeit im Main Thread vs. im Worker
// Start: node main.js

import { Worker } from 'node:worker_threads';
import { fib } from './fib.js';

const ticker = setInterval(() => process.stdout.write('·'), 50);

// #region 1: Im Main Thread – die Event Loop steht
await new Promise((resolve) => setTimeout(resolve, 300));
console.time('\nMain Thread');
fib(40);
console.timeEnd('\nMain Thread');
// #endregion

// #region 2: Im Worker – die Event Loop läuft weiter
function runInWorker(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./fib-worker.js', import.meta.url), { workerData: n });
    worker.once('message', resolve);
    worker.once('error', reject);
  });
}

console.time('\nWorker');
const result = await runInWorker(40);
console.timeEnd('\nWorker');
console.log('Ergebnis:', result);
// #endregion

clearInterval(ticker);
