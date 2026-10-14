// Konfiguration an EINER Stelle lesen, validieren und einfrieren

export function loadConfig(env = process.env) {
  const config = {
    port: Number(env.PORT ?? 3000),
    logLevel: env.LOG_LEVEL ?? 'info',
    dbFile: env.DB_FILE ?? ':memory:',
    shutdownTimeout: Number(env.SHUTDOWN_TIMEOUT ?? 5000),
  };

  if (!Number.isInteger(config.port)) throw new Error(`Ungültiger PORT: ${env.PORT}`);
  if (!['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
    throw new Error(`Ungültiges LOG_LEVEL: ${config.logLevel}`);
  }

  return Object.freeze(config);
}
