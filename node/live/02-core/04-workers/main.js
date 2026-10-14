// CPU-lastige Arbeit im Main Thread vs. im Worker
// Start: node main.js

import { Worker } from 'node:worker_threads';
import { fib } from './fib.js';

const ticker = setInterval(() => process.stdout.write('·'), 50);

// TODO 1: Im Main Thread – die Event Loop steht

// TODO 2: Im Worker – die Event Loop läuft weiter

clearInterval(ticker);
