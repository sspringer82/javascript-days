// Feature-Konfiguration: das Modul validiert nur die Variablen, die es braucht.

import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  DB_FILE: z.string().min(1).default('tasks.db'),
});

export const databaseConfig = registerAs('database', () => {
  const env = schema.parse(process.env);
  return { file: env.DB_FILE };
});
