// Adapter: UsersRepository auf Basis von node:sqlite.
// Das Modul besitzt seine Tabelle und legt sie selbst an.

import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';
import { DATABASE } from '../database/database.module.js';
import type { NewUser, Role, User } from './user.js';
import { UsersRepository } from './users.repository.js';

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

const toUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password_hash,
  role: row.role,
  createdAt: row.created_at,
});

@Injectable()
export class SqliteUsersRepository
  extends UsersRepository
  implements OnModuleInit
{
  constructor(@Inject(DATABASE) private readonly db: DatabaseSync) {
    super();
  }

  onModuleInit() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role          TEXT NOT NULL DEFAULT 'user',
        created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      )
    `);
  }

  async findAll() {
    const rows = this.db.prepare('SELECT * FROM users ORDER BY id').all();
    return (rows as unknown as UserRow[]).map(toUser);
  }

  async findById(id: number) {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row && toUser(row as unknown as UserRow);
  }

  async findByEmail(email: string) {
    const row = this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);
    return row && toUser(row as unknown as UserRow);
  }

  async insert({ email, passwordHash, role }: NewUser) {
    const row = this.db
      .prepare(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?) RETURNING *',
      )
      .get(email, passwordHash, role);
    return toUser(row as unknown as UserRow);
  }
}
