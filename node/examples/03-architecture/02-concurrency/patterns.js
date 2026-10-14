// Concurrency-Patterns für Services
// Start: node patterns.js

import { setTimeout as sleep } from 'node:timers/promises';

let active = 0;
let maxActive = 0;
let calls = 0;

// Simuliert eine Downstream-API, die gelegentlich ausfällt
async function callApi(id, { failRate = 0, signal } = {}) {
  calls++;
  active++;
  maxActive = Math.max(maxActive, active);
  try {
    await sleep(20 + Math.random() * 30, undefined, { signal });
    if (Math.random() < failRate) throw Object.assign(new Error('503 Service Unavailable'), { retryable: true });
    return { id };
  } finally {
    active--;
  }
}

// #region 1: Concurrency-Limit – maximal n Aufgaben gleichzeitig
function createLimiter(max) {
  let running = 0;
  const queue = [];

  const next = () => {
    if (running >= max || queue.length === 0) return;
    running++;
    const { task, resolve, reject } = queue.shift();
    task()
      .then(resolve, reject)
      .finally(() => {
        running--;
        next();
      });
  };

  return (task) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    queue.push({ task, resolve, reject });
    next();
    return promise;
  };
}

const limit = createLimiter(5);
console.time('100 Aufrufe, Limit 5');
await Promise.all(Array.from({ length: 100 }, (_, id) => limit(() => callApi(id))));
console.timeEnd('100 Aufrufe, Limit 5');
console.log('max. gleichzeitig:', maxActive);
// #endregion

// #region 2: Retry mit exponentiellem Backoff und Jitter
async function retry(task, { retries = 4, baseDelay = 50, signal } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await task({ attempt, signal });
    } catch (err) {
      if (attempt >= retries || !err.retryable) throw err;
      const delay = baseDelay * 2 ** attempt * (0.5 + Math.random() / 2);
      console.log(`  Versuch ${attempt + 1} fehlgeschlagen, neuer Versuch in ${delay.toFixed(0)}ms`);
      await sleep(delay, undefined, { signal });
    }
  }
}

const result = await retry(() => callApi('flaky', { failRate: 0.6 })).catch((err) => err.message);
console.log('retry:', result);
// #endregion

// #region 3: Timeout pro Operation – über das ganze Retry hinweg
try {
  await retry(({ signal }) => callApi('slow', { failRate: 1, signal }), {
    retries: 10,
    signal: AbortSignal.timeout(200),
  });
} catch (err) {
  console.log('Timeout:', err.name);
}
// #endregion

// #region 4: Request Coalescing – gleiche Anfragen teilen sich ein Promise
const inflight = new Map();

function coalesce(key, task) {
  if (!inflight.has(key)) {
    inflight.set(key, task().finally(() => inflight.delete(key)));
  }
  return inflight.get(key);
}

calls = 0;
await Promise.all(Array.from({ length: 50 }, () => coalesce('user:1', () => callApi(1))));
console.log('50 parallele Anfragen →', calls, 'echter Aufruf');
// #endregion
