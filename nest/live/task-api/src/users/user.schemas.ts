import { z } from 'zod';

// Antwort-Schema: z.object entfernt unbekannte Felder → kein passwordHash nach außen
export const userResponseSchema = z.object({
  id: z.number(),
  email: z.email(),
  role: z.enum(['user', 'admin']),
  createdAt: z.string(),
});
