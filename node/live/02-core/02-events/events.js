// EventEmitter richtig einsetzen
// Start: node events.js

import { EventEmitter, once, on, errorMonitor } from 'node:events';
import { setTimeout as sleep } from 'node:timers/promises';

// TODO 5: captureRejections – Fehler aus async Listenern einfangen

const queue = new OrderQueue();

// TODO 1: on/emit – Listener laufen SYNCHRON

// TODO 2: 'error' ist besonders – ohne Listener crasht der Prozess

// TODO 3: once() – auf ein einzelnes Event warten

// TODO 4: on() – Events als Async Iterator konsumieren

// TODO 5: captureRejections – Fehler aus async Listenern einfangen

// TODO 6: EventTarget – das Web-Pendant, z. B. für isomorphen Code

console.log('Listener auf "order":', queue.listenerCount('order'));
