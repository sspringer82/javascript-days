// Adapter: TasksRepository auf Basis von node:sqlite.

import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';
import { DATABASE } from '../database/database.module.js';
import type { NewTask, Task, TaskChanges, TaskFilter } from './task.js';
import { TasksRepository } from './tasks.repository.js';

interface TaskRow {
  id: number;
  owner_id: number;
  title: string;
  done: number;
  created_at: string;
}

const toTask = (row: TaskRow): Task => ({
  id: row.id,
  ownerId: row.owner_id,
  title: row.title,
  done: row.done === 1,
  createdAt: row.created_at,
});

@Injectable()
export class SqliteTasksRepository
  extends TasksRepository
  implements OnModuleInit
{
  constructor(@Inject(DATABASE) private readonly db: DatabaseSync) {
    super();
  }

  onModuleInit() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title      TEXT NOT NULL,
        done       INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      )
    `);
  }

  async findByOwner(ownerId: number, { done, limit, offset }: TaskFilter) {
    const rows = this.db
      .prepare(
        `SELECT * FROM tasks
         WHERE owner_id = ? AND (? IS NULL OR done = ?)
         ORDER BY id LIMIT ? OFFSET ?`,
      )
      .all(ownerId, toFlag(done), toFlag(done), limit, offset);
    return (rows as unknown as TaskRow[]).map(toTask);
  }

  async findById(id: number) {
    const row = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return row && toTask(row as unknown as TaskRow);
  }

  async insert({ ownerId, title }: NewTask) {
    const row = this.db
      .prepare('INSERT INTO tasks (owner_id, title) VALUES (?, ?) RETURNING *')
      .get(ownerId, title);
    return toTask(row as unknown as TaskRow);
  }

  async update(id: number, { title, done }: TaskChanges) {
    const row = this.db
      .prepare(
        `UPDATE tasks SET title = coalesce(?, title), done = coalesce(?, done)
         WHERE id = ? RETURNING *`,
      )
      .get(title ?? null, toFlag(done), id);
    return toTask(row as unknown as TaskRow);
  }

  async remove(id: number) {
    this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  }
}

function toFlag(value: boolean | undefined) {
  return value === undefined ? null : Number(value);
}
