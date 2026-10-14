// HTTP-Schicht: übersetzt zwischen HTTP und Service – sonst nichts.

import { ValidationError } from '#lib/errors';

export function registerTaskRoutes(router, { taskService }) {
  // TODO 1: Routen auf Service-Methoden abbilden
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ValidationError(`Ungültige id: ${value}`);
  return id;
}

function parseDone(value) {
  if (value === null) return undefined;
  return value === 'true';
}
