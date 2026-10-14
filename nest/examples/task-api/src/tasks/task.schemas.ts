// Schemas an der HTTP-Grenze: validieren, umwandeln, Typen ableiten.
// Gleiche Schemas für Eingaben (@Body, @Query) und Antworten (@SerializeOptions).

import { z } from 'zod';

// #region 2.2: Body-Schemas für Anlegen und Ändern
const title = z.string().trim().min(1).max(200);

export const createTaskSchema = z.object({ title });

export const updateTaskSchema = z
  .object({ title, done: z.boolean() })
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    message: 'Mindestens title oder done angeben',
  });
// #live
// export const createTaskSchema = z.any();
// export const updateTaskSchema = z.any();
// #endregion

// #region 2.3: Query-Parameter sind Strings → umwandeln
export const listTasksQuerySchema = z.object({
  done: z.stringbool().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});
// #live
// export const listTasksQuerySchema = z.object({});
// #endregion

// #region 2.4: Antwort-Schema: ownerId bleibt intern
export const taskResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
});
// #live
// export const taskResponseSchema = z.any();
// #endregion

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
