import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  JWT_SECRET: z.string().min(32, 'JWT_SECRET braucht mindestens 32 Zeichen'),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(900),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

export const authConfig = registerAs('auth', () => {
  const env = schema.parse(process.env);
  return {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresInSeconds: env.JWT_EXPIRES_IN,
    admin:
      env.ADMIN_EMAIL && env.ADMIN_PASSWORD
        ? { email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }
        : undefined,
  };
});
