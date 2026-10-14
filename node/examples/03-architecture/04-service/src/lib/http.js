// Minimaler Router auf Basis von node:http und URLPattern.
// Handler sind reine Funktionen: ({ params, query, body }) => ({ status, body })
// Sie kennen weder req noch res – das macht sie einfach testbar und austauschbar.

import { randomUUID } from 'node:crypto';
import { json } from 'node:stream/consumers';
import { requestContext } from '#lib/context';
import { AppError, ValidationError } from '#lib/errors';

export function createRouter({ logger }) {
  const routes = [];

  function add(method, pathname, handler) {
    // #region 1: Routen mit URLPattern beschreiben
    routes.push({ method, pattern: new URLPattern({ pathname }), handler });
    // #endregion
  }

  // #region 2: Passende Route finden und Request-Daten aufbereiten
  async function dispatch(req) {
    const url = new URL(req.url, 'http://localhost');

    for (const route of routes) {
      const match = route.pattern.exec({ pathname: url.pathname });
      if (!match || route.method !== req.method) continue;

      const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readJson(req) : undefined;
      return route.handler({ params: match.pathname.groups, query: url.searchParams, body });
    }

    return { status: 404, body: { error: 'NOT_FOUND', message: `${req.method} ${url.pathname}` } };
  }
  // #endregion

  // #region 3: Fehler zentral auf HTTP-Antworten abbilden
  function toErrorResponse(err) {
    if (err instanceof AppError) {
      return { status: err.status, body: { error: err.code, message: err.message, details: err.details } };
    }
    // Unbekannter Fehler = Bug → loggen, aber keine Interna nach außen geben
    logger.error('unhandled error', { err });
    return { status: 500, body: { error: 'INTERNAL', message: 'Internal Server Error' } };
  }
  // #endregion

  async function handle(req, res) {
    const start = performance.now();
    const response = await dispatch(req).catch(toErrorResponse);

    res.statusCode = response.status ?? 200;
    if (response.body === undefined) {
      res.end();
    } else {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(response.body));
    }

    logger.info('request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      ms: Math.round(performance.now() - start),
    });
  }

  return {
    get: (path, handler) => add('GET', path, handler),
    post: (path, handler) => add('POST', path, handler),
    patch: (path, handler) => add('PATCH', path, handler),
    delete: (path, handler) => add('DELETE', path, handler),

    // #region 4: Jeder Request läuft in seinem eigenen Kontext
    handler: (req, res) => {
      const requestId = req.headers['x-request-id'] ?? randomUUID();
      res.setHeader('x-request-id', requestId);
      requestContext.run({ requestId }, () => handle(req, res));
    },
    // #endregion
  };
}

async function readJson(req) {
  try {
    return await json(req);
  } catch (err) {
    throw new ValidationError('Request Body ist kein gültiges JSON', { reason: err.message });
  }
}
