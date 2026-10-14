// Asynchrone Kontrollflüsse
// Start: node control-flow.js

import { setTimeout as sleep } from 'node:timers/promises';

// Simuliert einen Remote-Aufruf, der abgebrochen werden kann
async function fetchUser(id, { delay = 100, fail = false, signal } = {}) {
  await sleep(delay, undefined, { signal });
  if (fail) throw new Error(`User ${id} nicht erreichbar`);
  return { id, name: `User ${id}` };
}

// TODO 1: Sequenziell vs. parallel – await in der Schleife

// TODO 2: all, allSettled, any, race – die Kombinatoren

// TODO 3: AbortController – Abbruch durch alle Ebenen durchreichen

// TODO 4: Promise.withResolvers – Promise und Steuerung getrennt

// TODO 5: Async Generatoren + Array.fromAsync – Paginierung
