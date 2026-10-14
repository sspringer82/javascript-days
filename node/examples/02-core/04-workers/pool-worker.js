import { parentPort } from 'node:worker_threads';
import { fib } from './fib.js';

// Langlebiger Worker: verarbeitet beliebig viele Nachrichten
parentPort.on('message', (n) => {
  if (n < 0) throw new Error(`Ungültige Eingabe: ${n}`);
  parentPort.postMessage({ n, result: fib(n) });
});
