// TypeScript direkt ausführen – Type Stripping (ohne Flag ab Node 22.18 / 23.6)
// Start: node user.ts
// Typecheck separat: npx tsc  (Node prüft keine Typen!)

// #region 2: Type-only Imports brauchen "import type"
import type { Greeting } from './types.ts';
// #endregion

// #region 1: Typen und Interfaces werden einfach entfernt
interface User {
  id: number;
  name: string;
  roles: Role[];
}

type Role = 'admin' | 'user';
// #endregion

// #region 3: enum braucht Transformation – stattdessen "as const"
// enum Status { Active, Blocked }  // -> ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX

const Status = { Active: 'active', Blocked: 'blocked' } as const;
type Status = (typeof Status)[keyof typeof Status];
// #endregion

function greet(user: User, status: Status): Greeting {
  return `Hallo ${user.name} (${user.roles.join(', ')}, ${status})`;
}

const user: User = { id: 1, name: 'Ada', roles: ['admin'] };
console.log(greet(user, Status.Active));
