// Fachlogik: kennt weder HTTP noch SQL, nur das Repository-Interface.

import { NotFoundError, ValidationError } from '#lib/errors';

export class TaskService {
  #repository;
  #logger;

  // #region 1: Abhängigkeiten von außen übergeben (Dependency Injection)
  constructor({ taskRepository, logger }) {
    this.#repository = taskRepository;
    this.#logger = logger;
  }
  // #endregion

  list({ done } = {}) {
    return this.#repository.findAll({ done });
  }

  // #region 2: Fachliche Fehler statt null/undefined
  async get(id) {
    const task = await this.#repository.findById(id);
    if (!task) throw new NotFoundError(`Task ${id} nicht gefunden`);
    return task;
  }
  // #endregion

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

// #region 3: Eingaben an der Grenze validieren
function validateTitle(title) {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new ValidationError('title ist erforderlich', { field: 'title' });
  }
  if (title.length > 200) {
    throw new ValidationError('title ist zu lang (max. 200 Zeichen)', { field: 'title' });
  }
  return title.trim();
}

function validateDone(done) {
  if (typeof done !== 'boolean') throw new ValidationError('done muss boolean sein', { field: 'done' });
  return done;
}
// #endregion
