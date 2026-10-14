// Globale Konfiguration: nur, was die Anwendung als Ganzes braucht.
// Feature-Konfiguration (Datenbank, Auth) liegt bei den jeweiligen Modulen.

import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_JSON: z.stringbool().default(false),
});

export type Env = z.infer<typeof envSchema>;
