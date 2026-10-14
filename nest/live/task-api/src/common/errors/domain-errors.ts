// Fachliche Fehler: kennen weder HTTP noch Nest.
// Der DomainExceptionFilter übersetzt sie an der Grenze in Statuscodes.

export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';

  constructor(resource: string, id: number | string) {
    super(`${resource} ${id} nicht gefunden`);
  }
}

export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';
}

export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS';

  constructor() {
    super('E-Mail oder Passwort falsch');
  }
}
