// Unit-Test der Fachlogik – ohne Datenbank, ohne HTTP.
// Möglich, weil der Service nur ein Repository-Interface erwartet.

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { TaskService } from '#tasks/task.service';
import { NotFoundError, ValidationError } from '#lib/errors';
import { silentLogger } from '#lib/logger';

class InMemoryTaskRepository {
  #tasks = new Map();
  #nextId = 1;

  async findAll({ done } = {}) {
    return [...this.#tasks.values()].filter((task) => done === undefined || task.done === done);
  }
  async findById(id) {
    return this.#tasks.get(id);
  }
  async insert({ title }) {
    const task = { id: this.#nextId++, title, done: false, createdAt: new Date().toISOString() };
    this.#tasks.set(task.id, task);
    return task;
  }
  async update(id, changes) {
    const task = { ...this.#tasks.get(id), ...changes };
    this.#tasks.set(id, task);
    return task;
  }
  async remove(id) {
    return this.#tasks.delete(id);
  }
}

describe('TaskService', () => {
  let service;

  beforeEach(() => {
    service = new TaskService({ taskRepository: new InMemoryTaskRepository(), logger: silentLogger });
  });

  it('legt Tasks an und trimmt den Titel', async () => {
    const task = await service.create({ title: '  Folien fertig machen ' });
    assert.equal(task.title, 'Folien fertig machen');
    assert.equal(task.done, false);
  });

  it('validiert den Titel', async () => {
    await assert.rejects(service.create({ title: '' }), ValidationError);
    await assert.rejects(service.create({}), { code: 'VALIDATION', details: { field: 'title' } });
  });

  it('wirft NotFoundError für unbekannte Tasks', async () => {
    await assert.rejects(service.get(42), NotFoundError);
    await assert.rejects(service.remove(42), NotFoundError);
  });

  it('aktualisiert nur übergebene Felder', async () => {
    const { id } = await service.create({ title: 'Workshop' });
    const task = await service.update(id, { done: true });
    assert.deepEqual({ title: task.title, done: task.done }, { title: 'Workshop', done: true });
  });

  it('filtert nach Status', async () => {
    const { id } = await service.create({ title: 'a' });
    await service.create({ title: 'b' });
    await service.update(id, { done: true });

    assert.equal((await service.list({ done: true })).length, 1);
    assert.equal((await service.list()).length, 2);
  });
});
