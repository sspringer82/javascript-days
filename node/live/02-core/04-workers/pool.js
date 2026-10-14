// Ein minimaler Worker Pool: feste Anzahl Worker, Aufgaben in einer Queue
// Produktiv: piscina (https://github.com/piscinajs/piscina)

import { Worker } from 'node:worker_threads';
import { availableParallelism } from 'node:os';

export class WorkerPool {
  #file;
  #idle = [];
  #queue = [];
  #running = new Map(); // Worker -> Task
  #workers = new Set();

  constructor(file, size = availableParallelism()) {
    this.#file = file;
    for (let i = 0; i < size; i++) this.#spawn();
  }

  run(data) {
    // TODO 1: Aufgabe einreihen und Promise zurückgeben
  }

  #next(worker) {
    // TODO 2: Nächste Aufgabe an einen freien Worker geben
  }

  #spawn() {
    // TODO 3: Worker starten, Ergebnisse und Fehler verarbeiten
  }

  async close() {
    await Promise.all([...this.#workers].map((worker) => worker.terminate()));
  }
}
