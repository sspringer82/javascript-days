// Schemas an der HTTP-Grenze: validieren, umwandeln, Typen ableiten.
// Gleiche Schemas für Eingaben (@Body, @Query) und Antworten (@SerializeOptions).

import { z } from 'zod';

// TODO 2.2: Body-Schemas für Anlegen und Ändern
export const createTaskSchema = z.any();
export const updateTaskSchema = z.any();

// TODO 2.3: Query-Parameter sind Strings → umwandeln
export const listTasksQuerySchema = z.object({});

// TODO 2.4: Antwort-Schema: ownerId bleibt intern
export const taskResponseSchema = z.any();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
