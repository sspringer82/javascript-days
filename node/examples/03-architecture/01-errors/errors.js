// Error-Handling-Strategien
// Start: node errors.js

import { readFile } from 'node:fs/promises';

// #region 1: Eigene Fehlerklassen mit code, status und cause
class AppError extends Error {
  constructor(message, { code = 'INTERNAL', status = 500, cause, details } = {}) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = new.target.name;
    this.code = code;
    this.status = status;
    if (details) this.details = details;
  }

  // Operational = erwartbar (404, Validierung, Timeout) → behandeln
  // Programmer Error = Bug (TypeError, undefined is not a function) → crashen lassen
  get isOperational() {
    return this.status < 500;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} ${id} nicht gefunden`, { code: 'NOT_FOUND', status: 404 });
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super('Validierung fehlgeschlagen', { code: 'VALIDATION', status: 400, details: errors });
  }
}

console.log(new NotFoundError('User', 42));
// #endregion

// #region 2: Fehler anreichern statt verschlucken – error.cause
async function loadConfig(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    throw new AppError(`Konfiguration "${path}" nicht ladbar`, { code: 'CONFIG', cause: err });
  }
}

try {
  await loadConfig('gibt-es-nicht.json');
} catch (err) {
  console.log(`\n${err.message}\n  verursacht durch: ${err.cause.code} (${err.cause.syscall})`);
}
// #endregion

// #region 3: Mehrere Fehler sammeln – AggregateError und ValidationError
function validateUser(input) {
  const errors = [];
  if (!input.name) errors.push({ field: 'name', message: 'ist erforderlich' });
  if (!/^\S+@\S+$/.test(input.email ?? '')) errors.push({ field: 'email', message: 'ist ungültig' });
  if (errors.length) throw new ValidationError(errors);
  return input;
}

try {
  validateUser({ email: 'kaputt' });
} catch (err) {
  console.log('\n' + err.message, err.details);
}

const results = await Promise.allSettled([loadConfig('a.json'), loadConfig('b.json')]);
const failures = results.filter((r) => r.status === 'rejected').map((r) => r.reason);
if (failures.length) {
  const aggregate = new AggregateError(failures, 'Mehrere Konfigurationen fehlen');
  console.log('\n' + aggregate.message, aggregate.errors.map((e) => e.message));
}
// #endregion

// #region 4: Ressourcen garantiert freigeben – using und Symbol.asyncDispose
async function openConnection(name) {
  console.log(`\n${name}: geöffnet`);
  return {
    query: async (sql) => {
      throw new Error(`Query fehlgeschlagen: ${sql}`);
    },
    async [Symbol.asyncDispose]() {
      console.log(`${name}: geschlossen`);
    },
  };
}

async function report() {
  await using db = await openConnection('db');
  return db.query('SELECT * FROM orders'); // wirft – db wird trotzdem geschlossen
}

await report().catch((err) => console.log('report():', err.message));
// #endregion

// #region 5: Letzte Verteidigungslinie – process-Events
process.on('unhandledRejection', (reason) => {
  console.error('\nUnhandled Rejection:', reason.message);
  process.exitCode = 1; // sauber beenden statt hart abbrechen
});

// Nur zum Loggen – der Prozess crasht danach trotzdem (gewollt!)
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('Uncaught:', origin, err.message);
});

Promise.reject(new Error('Promise ohne catch'));
// #endregion
