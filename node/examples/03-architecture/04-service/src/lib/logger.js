// Strukturiertes JSON-Logging mit automatischem Request-Kontext
// Produktiv: pino – gleiche Idee, mehr Performance und Features

import { requestContext } from '#lib/context';

const levels = { debug: 10, info: 20, warn: 30, error: 40 };

export function createLogger({ level = 'info', write = (line) => process.stdout.write(line + '\n') } = {}) {
  const minLevel = levels[level];

  function log(lvl, msg, data = {}) {
    if (levels[lvl] < minLevel) return;

    // #region 1: Request-Kontext automatisch an jede Logzeile hängen
    const entry = { time: new Date().toISOString(), level: lvl, msg, ...requestContext.getStore(), ...data };
    // #endregion
    if (data.err instanceof Error) {
      entry.err = { name: data.err.name, message: data.err.message, code: data.err.code, stack: data.err.stack };
    }
    write(JSON.stringify(entry));
  }

  return {
    debug: (msg, data) => log('debug', msg, data),
    info: (msg, data) => log('info', msg, data),
    warn: (msg, data) => log('warn', msg, data),
    error: (msg, data) => log('error', msg, data),
  };
}

export const silentLogger = createLogger({ write: () => {} });
