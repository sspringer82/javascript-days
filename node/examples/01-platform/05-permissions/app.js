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

// #region 1: Rechte zur Laufzeit abfragen
if (process.permission) {
  console.log('Permission Model aktiv');
  console.log('  fs.read  data/ :', process.permission.has('fs.read', dataDir));
  console.log('  fs.write data/ :', process.permission.has('fs.write', dataDir));
  console.log('  child          :', process.permission.has('child'));
} else {
  console.log('Permission Model nicht aktiv');
}
// #endregion

// #region 2: Zugriffe scheitern mit ERR_ACCESS_DENIED
await attempt('Datei lesen', () => readFile(join(dataDir, 'config.json'), 'utf8').then(JSON.parse));
await attempt('Datei schreiben', () => writeFile(join(dataDir, 'out.txt'), 'Hallo'));
await attempt('Kindprozess', () => execFileSync('node', ['--version']).toString().trim());
// #endregion

async function attempt(label, fn) {
  try {
    const result = await fn();
    console.log(`✔ ${label}`, result ?? '');
  } catch (err) {
    console.log(`✘ ${label}: ${err.code} ${err.permission ?? ''} ${err.resource ?? ''}`);
  }
}
