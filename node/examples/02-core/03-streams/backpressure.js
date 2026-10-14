// Backpressure: Was passiert, wenn der Producer schneller ist als der Consumer?
// Start: node backpressure.js

import { Writable } from 'node:stream';
import { once } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';

function createSlowWriter(name) {
  return new Writable({
    objectMode: true,
    highWaterMark: 4, // Puffergröße in Objekten (Bytes ohne objectMode, Default 64 KiB)
    async write(chunk, encoding, callback) {
      await sleep(5);
      callback();
    },
  }).on('finish', () => console.log(`${name}: fertig`));
}

// #region 1: Ohne Backpressure – der Puffer wächst unbegrenzt
const greedy = createSlowWriter('ohne Backpressure');
let maxBuffered = 0;
for (let i = 0; i < 100; i++) {
  greedy.write({ i });
  maxBuffered = Math.max(maxBuffered, greedy.writableLength);
}
greedy.end();
console.log('ohne Backpressure: max. gepuffert =', maxBuffered);
await once(greedy, 'finish');
// #endregion

// #region 2: Mit Backpressure – write() liefert false, dann auf 'drain' warten
const polite = createSlowWriter('mit Backpressure');
maxBuffered = 0;
for (let i = 0; i < 100; i++) {
  const ok = polite.write({ i });
  maxBuffered = Math.max(maxBuffered, polite.writableLength);
  if (!ok) await once(polite, 'drain');
}
polite.end();
console.log('mit Backpressure: max. gepuffert =', maxBuffered);
await once(polite, 'finish');
// #endregion

// pipeline() und for await erledigen das automatisch!
