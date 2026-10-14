// HTTP-Schicht: übersetzt zwischen HTTP und Service – sonst nichts.

import { ValidationError } from '#lib/errors';

export function registerTaskRoutes(router, { taskService }) {
  // #region 1: Routen auf Service-Methoden abbilden
  router.get('/tasks', async ({ query }) => ({
    body: await taskService.list({ done: parseDone(query.get('done')) }),
  }));

  router.get('/tasks/:id', async ({ params }) => ({
    body: await taskService.get(parseId(params.id)),
  }));

  router.post('/tasks', async ({ body }) => ({
    status: 201,
    body: await taskService.create(body),
  }));

  router.patch('/tasks/:id', async ({ params, body }) => ({
    body: await taskService.update(parseId(params.id), body),
  }));

  router.delete('/tasks/:id', async ({ params }) => {
    await taskService.remove(parseId(params.id));
    return { status: 204 };
  });
  // #endregion
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
