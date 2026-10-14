// Port: was der Service von der Persistenz braucht.
// Eine abstrakte Klasse ist gleichzeitig Typ UND Injection Token.

import type { NewUser, User } from './user.js';

export abstract class UsersRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: number): Promise<User | undefined>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract insert(user: NewUser): Promise<User>;
}
