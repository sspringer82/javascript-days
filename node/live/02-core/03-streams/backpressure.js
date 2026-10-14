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

// TODO 1: Ohne Backpressure – der Puffer wächst unbegrenzt

// TODO 2: Mit Backpressure – write() liefert false, dann auf 'drain' warten

// pipeline() und for await erledigen das automatisch!
