// Fachlogik für Benutzer: kennt weder HTTP noch SQL, nur das Repository.

import { Injectable } from '@nestjs/common';
import {
  ConflictError,
  NotFoundError,
} from '../common/errors/domain-errors.js';
import type { NewUser } from './user.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  findAll() {
    return this.users.findAll();
  }

  async findById(id: number) {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError('User', id);
    return user;
  }

  findByEmail(email: string) {
    return this.users.findByEmail(email);
  }

  async create(user: NewUser) {
    if (await this.users.findByEmail(user.email)) {
      throw new ConflictError(`${user.email} ist bereits registriert`);
    }
    return this.users.insert(user);
  }
}
