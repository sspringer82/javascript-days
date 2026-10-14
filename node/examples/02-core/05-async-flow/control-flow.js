// Asynchrone Kontrollflüsse
// Start: node control-flow.js

import { setTimeout as sleep } from 'node:timers/promises';

// Simuliert einen Remote-Aufruf, der abgebrochen werden kann
async function fetchUser(id, { delay = 100, fail = false, signal } = {}) {
  await sleep(delay, undefined, { signal });
  if (fail) throw new Error(`User ${id} nicht erreichbar`);
  return { id, name: `User ${id}` };
}

// #region 1: Sequenziell vs. parallel – await in der Schleife
console.time('sequenziell');
for (const id of [1, 2, 3]) await fetchUser(id);
console.timeEnd('sequenziell');

console.time('parallel');
await Promise.all([1, 2, 3].map((id) => fetchUser(id)));
console.timeEnd('parallel');
// #endregion

// #region 2: all, allSettled, any, race – die Kombinatoren
const calls = () => [
  fetchUser(1, { delay: 50 }),
  fetchUser(2, { delay: 20, fail: true }),
  fetchUser(3, { delay: 80 }),
];

await Promise.all(calls()).catch((err) => console.log('all       → bricht ab:', err.message));

const settled = await Promise.allSettled(calls());
console.log('allSettled →', settled.map((r) => r.status).join(', '));

console.log('any       → erster Erfolg:', (await Promise.any(calls())).name);

await Promise.race(calls()).catch((err) => console.log('race      → erster Abschluss:', err.message));
// #endregion

// #region 3: AbortController – Abbruch durch alle Ebenen durchreichen
async function loadDashboard({ signal }) {
  const [user, orders] = await Promise.all([
    fetchUser(1, { delay: 50, signal }),
    fetchUser(2, { delay: 500, signal }),
  ]);
  return { user, orders };
}

const controller = new AbortController();
setTimeout(() => controller.abort(new Error('Benutzer hat abgebrochen')), 100);

// Mehrere Abbruchgründe kombinieren: manuell ODER Timeout
const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(1000)]);

try {
  await loadDashboard({ signal });
} catch (err) {
  console.log('Dashboard:', err.name, '–', signal.reason.message);
}
// #endregion

// #region 4: Promise.withResolvers – Promise und Steuerung getrennt
// Früher: let resolve; const promise = new Promise((r) => (resolve = r));
const { promise: connected, resolve: onConnect } = Promise.withResolvers();

setTimeout(() => onConnect('Verbindung steht'), 50);
console.log('withResolvers:', await connected);
// #endregion

// #region 5: Async Generatoren + Array.fromAsync – Paginierung
async function* paginate(pages) {
  for (let page = 1; page <= pages; page++) {
    await sleep(20);
    yield* [`item ${page}.1`, `item ${page}.2`];
  }
}

console.log('fromAsync:', await Array.fromAsync(paginate(3)));
// #endregion
