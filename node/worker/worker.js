import { parentPort, workerData } from "worker_threads";

const sharedArray = new Int32Array(workerData);

console.log(`[WORKER ${process.pid}] Starte Berechnung...`);

for (let i = 0; i <= 100; i++) {
  Atomics.store(sharedArray, 0, i); // Fortschritt speichern
  if (i % 10 === 0) {
    console.log(`[WORKER ${process.pid}] Fortschritt: ${i}%`);
    Atomics.notify(sharedArray, 1, 1); // Hauptprozess benachrichtigen
  }

  // Simulierte Berechnungszeit
  Atomics.wait(sharedArray, 1, 0, 50);
}

console.log(`[WORKER ${process.pid}] Berechnung abgeschlossen.`);
Atomics.notify(sharedArray, 1, 1); // Letzte Benachrichtigung senden
parentPort.close();
