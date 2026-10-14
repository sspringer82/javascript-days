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

// TODO 1: Concurrency-Limit – maximal n Aufgaben gleichzeitig

// TODO 2: Retry mit exponentiellem Backoff und Jitter

// TODO 3: Timeout pro Operation – über das ganze Retry hinweg

// TODO 4: Request Coalescing – gleiche Anfragen teilen sich ein Promise
