// Start: node pool-demo.js

import { availableParallelism } from 'node:os';
import { WorkerPool } from './pool.js';
import { fib } from './fib.js';

const inputs = Array.from({ length: 12 }, () => 34);

console.time('sequenziell im Main Thread');
inputs.forEach(fib);
console.timeEnd('sequenziell im Main Thread');

const pool = new WorkerPool(new URL('./pool-worker.js', import.meta.url), Math.min(4, availableParallelism()));

console.time('parallel im Pool (4 Worker)');
const results = await Promise.all(inputs.map((n) => pool.run(n)));
console.timeEnd('parallel im Pool (4 Worker)');
console.log('Ergebnisse:', results.length, '×', results[0].result);

// Ein Fehler im Worker reißt den Pool nicht mit
await pool.run(-1).catch((err) => console.log('Fehler aus Worker:', err.message));
console.log('Pool lebt noch:', (await pool.run(10)).result);

await pool.close();
