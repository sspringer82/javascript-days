// Moderne Timer-APIs
// Start: node timers.js

import { setTimeout as sleep, setInterval, scheduler } from 'node:timers/promises';

// #region 1: Promise-basierte Timer
console.time('sleep');
const value = await sleep(300, 'fertig');
console.timeEnd('sleep');
console.log('Wert:', value);
// #endregion

// #region 2: setInterval als Async Iterator
let tick = 0;
for await (const startedAt of setInterval(100, Date.now())) {
  console.log(`tick ${++tick} nach ${Date.now() - startedAt}ms`);
  if (tick === 3) break; // break räumt den Timer automatisch auf
}
// #endregion

// #region 3: Abbrechen mit AbortSignal
try {
  await sleep(5000, null, { signal: AbortSignal.timeout(200) });
} catch (err) {
  console.log('Abgebrochen:', err.name, '–', err.cause?.name);
}
// #endregion

// #region 4: Lange Arbeit aufteilen mit scheduler.yield()
const heartbeat = globalThis.setInterval(() => console.log('  ♥ Event Loop lebt'), 20);

let sum = 0;
for (let chunk = 0; chunk < 5; chunk++) {
  for (let i = 0; i < 2e7; i++) sum += i;
  console.log(`Chunk ${chunk} fertig`);
  await scheduler.yield(); // gibt anderen Callbacks eine Chance
  await scheduler.wait(25);
}
clearInterval(heartbeat);
// #endregion

// #region 5: unref – Timer, die den Prozess nicht am Leben halten
const keepAlive = globalThis.setInterval(() => console.log('nie zu sehen'), 1000);
keepAlive.unref();

// Variante für timers/promises:
sleep(10_000, null, { ref: false }).then(() => console.log('auch nie zu sehen'));

console.log('Prozess endet, obwohl noch Timer existieren');
// #endregion
