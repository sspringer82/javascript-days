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
    // TODO 1: Routen mit URLPattern beschreiben
  }

  // TODO 2: Passende Route finden und Request-Daten aufbereiten

  // TODO 3: Fehler zentral auf HTTP-Antworten abbilden

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

    // TODO 4: Jeder Request läuft in seinem eigenen Kontext
  };
}

async function readJson(req) {
  try {
    return await json(req);
  } catch (err) {
    throw new ValidationError('Request Body ist kein gültiges JSON', { reason: err.message });
  }
}
