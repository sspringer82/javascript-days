import { Worker } from 'worker_threads';

const buffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 2);
const sharedArray = new Int32Array(buffer);

// sharedArray[0] => Fortschritt
// sharedArray[1] => Flag für Synchronisation

const worker = new Worker('./worker.js', { workerData: buffer });

function waitForWorker() {
  while (Atomics.load(sharedArray, 0) < 100) {
    console.log(`[MAIN] Warte auf Fortschritt... Aktuell: ${sharedArray[0]}%`);
    Atomics.wait(sharedArray, 1, 0); // Warten auf Benachrichtigung durch Worker
  }
  console.log(`[MAIN] Berechnung abgeschlossen: ${sharedArray[0]}%`);
}

setTimeout(waitForWorker, 100); // Starte das Warten mit einer kleinen Verzögerung

worker.on('exit', () => {
  console.log('[MAIN] Worker beendet.');
});