// In welcher Reihenfolge läuft das?
// Start: node order.js

import { readFile } from 'node:fs';

console.log('1 sync');

setTimeout(() => console.log('5 timeout'), 0);
setImmediate(() => console.log('6 immediate'));

// Achtung: In ESM läuft die Promise-Microtask VOR nextTick,
// weil das Modul selbst schon in einem async Job ausgewertet wird.
// In CommonJS (order.cjs) ist es umgekehrt.
process.nextTick(() => console.log('4 nextTick'));
Promise.resolve().then(() => console.log('3 microtask (promise)'));

readFile(import.meta.filename, () => {
  console.log('7 I/O callback (poll)');

  // Nach I/O ist die Reihenfolge garantiert: check-Phase vor nächstem timers-Durchlauf
  setTimeout(() => console.log('9 timeout aus I/O'), 0);
  setImmediate(() => console.log('8 immediate aus I/O'));
});

console.log('2 sync');

// Hinweis: "5 timeout" vs. "6 immediate" im Hauptmodul ist NICHT garantiert.
