export type Role = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export type NewUser = Pick<User, 'email' | 'passwordHash' | 'role'>;
