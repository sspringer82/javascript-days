// Fachlogik: kennt weder HTTP noch SQL, nur den Port TasksRepository.

import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../common/errors/domain-errors.js';
import type { Task, TaskChanges, TaskFilter } from './task.js';
import { TasksRepository } from './tasks.repository.js';

@Injectable()
export class TasksService {
  constructor(private readonly tasks: TasksRepository) {}

  list(ownerId: number, filter: Partial<TaskFilter> = {}) {
    const { done, limit = 20, offset = 0 } = filter;
    return this.tasks.findByOwner(ownerId, { done, limit, offset });
  }

  // #region 1.4: Nur eigene Tasks – fremde gelten als nicht gefunden
  async get(ownerId: number, id: number) {
    const task = await this.tasks.findById(id);
    if (!task || task.ownerId !== ownerId) throw new NotFoundError('Task', id);
    return task;
  }
  // #live
  // async get(ownerId: number, id: number) {
  //   return (await this.tasks.findById(id)) as Task;
  // }
  // #endregion

  create(ownerId: number, { title }: Pick<Task, 'title'>) {
    return this.tasks.insert({ ownerId, title });
  }

  async update(ownerId: number, id: number, changes: TaskChanges) {
    await this.get(ownerId, id);
    return this.tasks.update(id, changes);
  }

  async remove(ownerId: number, id: number) {
    await this.get(ownerId, id);
    await this.tasks.remove(id);
  }
}
