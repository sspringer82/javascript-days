// Permission Model – Least Privilege für Node-Prozesse
//
// Start: node app.js                               (alles erlaubt)
//        node --permission app.js                  (alles verboten außer dem Einstiegsskript)
//        node --permission --allow-fs-read=./data app.js
//        node --permission --allow-fs-read=./data --allow-fs-write=./data --allow-child-process app.js

import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const dataDir = join(import.meta.dirname, 'data');

// TODO 1: Rechte zur Laufzeit abfragen

// TODO 2: Zugriffe scheitern mit ERR_ACCESS_DENIED

async function attempt(label, fn) {
  try {
    const result = await fn();
    console.log(`✔ ${label}`, result ?? '');
  } catch (err) {
    console.log(`✘ ${label}: ${err.code} ${err.permission ?? ''} ${err.resource ?? ''}`);
  }
}
