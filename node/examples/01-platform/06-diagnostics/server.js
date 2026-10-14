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

// #region 1: Event-Loop-Verzögerung messen
const loopDelay = monitorEventLoopDelay({ resolution: 10 });
loopDelay.enable();

setInterval(() => {
  const ms = (ns) => (ns / 1e6).toFixed(1);
  console.log(
    `event loop delay  p50=${ms(loopDelay.percentile(50))}ms  p99=${ms(loopDelay.percentile(99))}ms  max=${ms(loopDelay.max)}ms`,
  );
  loopDelay.reset();
}, 2000).unref();
// #endregion

// #region 2: Eigene Messpunkte mit performance.mark/measure
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`  ${entry.name}: ${entry.duration.toFixed(1)}ms`);
  }
});
observer.observe({ entryTypes: ['measure'] });
// #endregion

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  switch (pathname) {
    case '/fast':
      return res.end('fast\n');

    case '/slow': {
      // #region 2: Eigene Messpunkte mit performance.mark/measure
      performance.mark('hash-start');
      // #endregion
      // Blockiert die Event Loop! Alternative: await pbkdf2Async(...)
      pbkdf2Sync('secret', 'salt', 300_000, 64, 'sha512');
      // #region 2: Eigene Messpunkte mit performance.mark/measure
      performance.measure('hash', 'hash-start');
      // #endregion
      return res.end('slow\n');
    }

    case '/slow-async':
      await pbkdf2Async('secret', 'salt', 300_000, 64, 'sha512');
      return res.end('slow, aber nicht blockierend\n');

    // #region 3: Diagnose-Report und Heap Snapshot zur Laufzeit
    case '/report': {
      const report = process.report.getReport();
      res.setHeader('content-type', 'application/json');
      return res.end(
        JSON.stringify({
          nodeVersion: report.header.nodejsVersion,
          heapUsed: report.javascriptHeap.usedMemory,
          libuvHandles: report.libuv.length,
          activeResources: process.getActiveResourcesInfo(),
        }, null, 2),
      );
    }

    case '/heap': {
      const file = writeHeapSnapshot();
      return res.end(`Heap Snapshot: ${file}\n`);
    }
    // #endregion

    default:
      res.statusCode = 404;
      return res.end('not found\n');
  }
});

server.listen(3000, () => console.log('http://localhost:3000'));
