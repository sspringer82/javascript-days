import { parentPort, workerData } from 'node:worker_threads';
import { fib } from './fib.js';

// #region 2: Im Worker – die Event Loop läuft weiter
parentPort.postMessage(fib(workerData));
// #endregion
