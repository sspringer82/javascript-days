// Port: was der TasksService von der Persistenz erwartet.

import type { NewTask, Task, TaskChanges, TaskFilter } from './task.js';

export abstract class TasksRepository {
  abstract findByOwner(ownerId: number, filter: TaskFilter): Promise<Task[]>;
  abstract findById(id: number): Promise<Task | undefined>;
  abstract insert(task: NewTask): Promise<Task>;
  abstract update(id: number, changes: TaskChanges): Promise<Task>;
  abstract remove(id: number): Promise<void>;
}
