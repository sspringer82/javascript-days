import { performance, PerformanceObserver } from 'perf_hooks';
import http from 'http';
import dns from 'dns';

// PerformanceObserver einrichten
const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`[${entry.entryType}] ${entry.name}: ${entry.duration?.toFixed(2)}ms`);
  });
});
obs.observe({ entryTypes: ['dns', 'function', 'gc', 'http', 'http2', 'mark', 'measure', 'net', 'resource'] });

// 1. Mark & Measure (Allgemeine Zeitmessung)
performance.mark('startTask');
setTimeout(() => {
  performance.mark('endTask');
  performance.measure('Task-Dauer', 'startTask', 'endTask');
}, 200);

// 2. DNS Lookup (Netzwerk)
performance.mark('dns-start');
dns.lookup('example.com', (err, address) => {
  if (err) console.error(err);
  performance.mark('dns-end');
  performance.measure('DNS Lookup', 'dns-start', 'dns-end');
});

// 3. HTTP-Request (HTTP-Messung)
performance.mark('http-start');
http.get('http://example.com', (res) => {
  res.on('data', () => {}); // Antwortdaten ignorieren
  res.on('end', () => {
    performance.mark('http-end');
    performance.measure('HTTP-Request', 'http-start', 'http-end');
  });
});

// 4. Garbage Collection (GC)
setTimeout(() => {
  performance.mark('gc-start');
  global.gc?.(); // --expose-gc
  performance.mark('gc-end');
  performance.measure('Garbage Collection', 'gc-start', 'gc-end');
}, 500);

// 5. Net (Netzwerkverbindung)
performance.mark('net-start');
const client = http.request({ hostname: 'example.com' }, (res) => {
  res.on('data', () => {});
  res.on('end', () => {
    performance.mark('net-end');
    performance.measure('Netzwerkverbindung', 'net-start', 'net-end');
  });
});
client.end();

// 6. Funktion überwachen (function)
const monitoredFunction = performance.timerify(() => {
  let sum = 0;
  for (let i = 0; i < 1e6; i++) sum += i;
});
monitoredFunction();