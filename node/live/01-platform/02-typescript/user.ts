// TypeScript direkt ausführen – Type Stripping (ohne Flag ab Node 22.18 / 23.6)
// Start: node user.ts
// Typecheck separat: npx tsc  (Node prüft keine Typen!)

// TODO 2: Type-only Imports brauchen "import type"

// TODO 1: Typen und Interfaces werden einfach entfernt

// TODO 3: enum braucht Transformation – stattdessen "as const"

function greet(user: User, status: Status): Greeting {
  return `Hallo ${user.name} (${user.roles.join(', ')}, ${status})`;
}

const user: User = { id: 1, name: 'Ada', roles: ['admin'] };
console.log(greet(user, Status.Active));
