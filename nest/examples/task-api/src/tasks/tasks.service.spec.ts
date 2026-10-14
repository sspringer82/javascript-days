// Start: npm test   (im Ordner task-api)

import { Test } from '@nestjs/testing';
import { NotFoundError } from '../common/errors/domain-errors.js';
import type { NewTask, Task, TaskChanges, TaskFilter } from './task.js';
import { TasksRepository } from './tasks.repository.js';
import { TasksService } from './tasks.service.js';

// Fake statt Mock: echtes Verhalten, nur ohne Datenbank
class InMemoryTasksRepository extends TasksRepository {
  private readonly tasks = new Map<number, Task>();
  private nextId = 1;

  async findByOwner(ownerId: number, { done, limit, offset }: TaskFilter) {
    return [...this.tasks.values()]
      .filter((task) => task.ownerId === ownerId)
      .filter((task) => done === undefined || task.done === done)
      .slice(offset, offset + limit);
  }

  async findById(id: number) {
    return this.tasks.get(id);
  }

  async insert({ ownerId, title }: NewTask) {
    const task = {
      id: this.nextId++,
      ownerId,
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async update(id: number, changes: TaskChanges) {
    const task = { ...this.tasks.get(id)!, ...changes };
    this.tasks.set(id, task);
    return task;
  }

  async remove(id: number) {
    this.tasks.delete(id);
  }
}

describe('TasksService', () => {
  const alice = 1;
  const bob = 2;
  let service: TasksService;

  beforeEach(async () => {
    // #region 3.6: Testmodul mit Fake-Repository
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useClass: InMemoryTasksRepository },
      ],
    }).compile();

    service = moduleRef.get(TasksService);
    // #live
    // service = new TasksService(new InMemoryTasksRepository());
    // #endregion
  });

  it('listet nur die eigenen Tasks', async () => {
    await service.create(alice, { title: 'Nest lernen' });
    await service.create(bob, { title: 'Bobs Task' });

    const tasks = await service.list(alice);

    expect(tasks.map((task) => task.title)).toEqual(['Nest lernen']);
  });

  it('filtert nach done und paginiert', async () => {
    for (const title of ['a', 'b', 'c']) await service.create(alice, { title });
    await service.update(alice, 2, { done: true });

    expect(await service.list(alice, { done: true })).toHaveLength(1);
    expect(await service.list(alice, { limit: 1, offset: 2 })).toMatchObject([
      { title: 'c' },
    ]);
  });

  // #region 3.6: Fremde Tasks sind nicht sichtbar
  it('behandelt fremde Tasks als nicht gefunden', async () => {
    const task = await service.create(bob, { title: 'Bobs Task' });

    await expect(service.get(alice, task.id)).rejects.toThrow(NotFoundError);
    await expect(service.remove(alice, task.id)).rejects.toThrow(NotFoundError);
    await expect(service.get(bob, task.id)).resolves.toMatchObject({
      title: 'Bobs Task',
    });
  });
  // #endregion
});
