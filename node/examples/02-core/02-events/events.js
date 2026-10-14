// EventEmitter richtig einsetzen
// Start: node events.js

import { EventEmitter, once, on, errorMonitor } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';

// #region 5: captureRejections – Fehler aus async Listenern einfangen
class OrderQueue extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }
}
// #endregion

const queue = new OrderQueue();

// #region 1: on/emit – Listener laufen SYNCHRON
queue.on('order', (order) => console.log('  Listener:', order.id));

console.log('vor emit');
queue.emit('order', { id: 1 });
console.log('nach emit');
// #endregion

// #region 2: 'error' ist besonders – ohne Listener crasht der Prozess
queue.on(errorMonitor, (err) => console.log('  Monitor sieht:', err.message));
queue.on('error', (err) => console.log('  Behandelt:', err.message));

queue.emit('error', new Error('Lieferant nicht erreichbar'));
// #endregion

// #region 3: once() – auf ein einzelnes Event warten
setTimeout(() => queue.emit('ready', 'Datenbank'), 100);

const [what] = await once(queue, 'ready');
console.log('bereit:', what);
// #endregion

// #region 4: on() – Events als Async Iterator konsumieren
setTimeout(async () => {
  for (const id of [2, 3, 4]) {
    queue.emit('order', { id });
    await sleep(10);
  }
  queue.emit('closed');
}, 0);

for await (const [order] of on(queue, 'order', { close: ['closed'] })) {
  console.log('  verarbeitet:', order.id);
}
console.log('Queue geschlossen');
// #endregion

// #region 5: captureRejections – Fehler aus async Listenern einfangen
queue.on('order', async (order) => {
  if (order.id === 99) throw new Error(`Order ${order.id} ungültig`);
});
queue.emit('order', { id: 99 });
await sleep(0);
// #endregion

// #region 6: EventTarget – das Web-Pendant, z. B. für isomorphen Code
const target = new EventTarget();
target.addEventListener('ping', (event) => console.log('EventTarget:', event.detail), { once: true });
target.dispatchEvent(new CustomEvent('ping', { detail: 42 }));
target.dispatchEvent(new CustomEvent('ping', { detail: 43 })); // ignoriert wegen once
// #endregion

console.log('Listener auf "order":', queue.listenerCount('order'));
