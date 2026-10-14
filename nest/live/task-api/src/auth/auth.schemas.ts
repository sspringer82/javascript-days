import { z } from 'zod';

export const credentialsSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export type Credentials = z.infer<typeof credentialsSchema>;
