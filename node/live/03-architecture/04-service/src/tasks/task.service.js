// Fachlogik: kennt weder HTTP noch SQL, nur das Repository-Interface.

import { NotFoundError, ValidationError } from '#lib/errors';

export class TaskService {
  #repository;
  #logger;

  // TODO 1: Abhängigkeiten von außen übergeben (Dependency Injection)

  list({ done } = {}) {
    return this.#repository.findAll({ done });
  }

  // TODO 2: Fachliche Fehler statt null/undefined

  async create(input) {
    const title = validateTitle(input?.title);
    const task = await this.#repository.insert({ title });
    this.#logger.info('task created', { taskId: task.id });
    return task;
  }

  async update(id, input) {
    const current = await this.get(id);
    const changes = {
      title: input?.title === undefined ? current.title : validateTitle(input.title),
      done: input?.done === undefined ? current.done : validateDone(input.done),
    };
    return this.#repository.update(id, changes);
  }

  async remove(id) {
    const removed = await this.#repository.remove(id);
    if (!removed) throw new NotFoundError(`Task ${id} nicht gefunden`);
    this.#logger.info('task removed', { taskId: id });
  }
}

// TODO 3: Eingaben an der Grenze validieren
