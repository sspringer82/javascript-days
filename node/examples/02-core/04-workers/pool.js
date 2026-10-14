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
    // #region 1: Aufgabe einreihen und Promise zurückgeben
    const { promise, resolve, reject } = Promise.withResolvers();
    this.#queue.push({ data, resolve, reject });
    if (this.#idle.length > 0) this.#next(this.#idle.pop());
    return promise;
    // #endregion
  }

  #next(worker) {
    // #region 2: Nächste Aufgabe an einen freien Worker geben
    const task = this.#queue.shift();
    if (!task) {
      this.#idle.push(worker);
      return;
    }
    this.#running.set(worker, task);
    worker.postMessage(task.data);
    // #endregion
  }

  #spawn() {
    // #region 3: Worker starten, Ergebnisse und Fehler verarbeiten
    const worker = new Worker(this.#file);
    this.#workers.add(worker);

    worker.on('message', (result) => {
      this.#running.get(worker).resolve(result);
      this.#running.delete(worker);
      this.#next(worker);
    });

    worker.on('error', (err) => {
      this.#running.get(worker)?.reject(err);
      this.#running.delete(worker);
      this.#workers.delete(worker);
      this.#spawn(); // abgestürzten Worker ersetzen
    });

    this.#next(worker);
    // #endregion
  }

  async close() {
    await Promise.all([...this.#workers].map((worker) => worker.terminate()));
  }
}
