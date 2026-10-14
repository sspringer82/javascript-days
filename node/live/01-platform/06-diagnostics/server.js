// Diagnose eines Servers mit Bordmitteln
//
// Start: node server.js
//        node --cpu-prof server.js            (CPU-Profil beim Beenden → *.cpuprofile, in DevTools öffnen)
//        node --inspect server.js             (chrome://inspect → Profiler, Memory, Debugger)
//        node --report-on-signal server.js    (Diagnose-Report per Signal, Linux/macOS: kill -USR2 <pid>)
// Last:  node load.js
//
// Endpunkte: /fast  /slow  /report  /heap

import { createServer } from 'node:http';
import { pbkdf2Sync, pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';
import { monitorEventLoopDelay, performance, PerformanceObserver } from 'node:perf_hooks';
import { writeHeapSnapshot } from 'node:v8';

const pbkdf2Async = promisify(pbkdf2);

// TODO 1: Event-Loop-Verzögerung messen

// TODO 2: Eigene Messpunkte mit performance.mark/measure

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  switch (pathname) {
    case '/fast':
      return res.end('fast\n');

    case '/slow': {
      // TODO 2: Eigene Messpunkte mit performance.mark/measure
      // Blockiert die Event Loop! Alternative: await pbkdf2Async(...)
      pbkdf2Sync('secret', 'salt', 300_000, 64, 'sha512');
      // TODO 2: Eigene Messpunkte mit performance.mark/measure
      return res.end('slow\n');
    }

    case '/slow-async':
      await pbkdf2Async('secret', 'salt', 300_000, 64, 'sha512');
      return res.end('slow, aber nicht blockierend\n');

    // TODO 3: Diagnose-Report und Heap Snapshot zur Laufzeit

    default:
      res.statusCode = 404;
      return res.end('not found\n');
  }
});

server.listen(3000, () => console.log('http://localhost:3000'));
