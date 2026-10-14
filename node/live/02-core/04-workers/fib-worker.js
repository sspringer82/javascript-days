import { parentPort, workerData } from 'node:worker_threads';
import { fib } from './fib.js';

// TODO 2: Im Worker – die Event Loop läuft weiter
