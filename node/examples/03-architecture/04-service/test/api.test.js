// Integrationstest: echte App, echte SQLite (in-memory), echtes HTTP via fetch

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from 'task-service'; // Self-Reference über "exports" in package.json
import { silentLogger } from '#lib/logger';

describe('Task API', () => {
  let app;
  let baseUrl;

  before(async () => {
    app = createApp({ config: { dbFile: ':memory:' }, logger: silentLogger });
    app.server.listen(0); // freier Port
    await once(app.server, 'listening');
    baseUrl = `http://localhost:${app.server.address().port}`;
  });

  after(() => app.close());

  const request = (path, { method = 'GET', body } = {}) =>
    fetch(baseUrl + path, {
      method,
      headers: { 'content-type': 'application/json', 'x-request-id': 'test-1' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  it('GET /health', async () => {
    const res = await request('/health');
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-request-id'), 'test-1');
  });

  it('legt einen Task an und liest ihn wieder', async () => {
    const created = await request('/tasks', { method: 'POST', body: { title: 'Node verstehen' } });
    assert.equal(created.status, 201);
    const { id } = await created.json();

    const res = await request(`/tasks/${id}`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).title, 'Node verstehen');
  });

  it('PATCH und DELETE', async () => {
    const { id } = await (await request('/tasks', { method: 'POST', body: { title: 'tmp' } })).json();

    const patched = await request(`/tasks/${id}`, { method: 'PATCH', body: { done: true } });
    assert.equal((await patched.json()).done, true);

    assert.equal((await request(`/tasks/${id}`, { method: 'DELETE' })).status, 204);
    assert.equal((await request(`/tasks/${id}`)).status, 404);
  });

  it('liefert 400 bei ungültigen Eingaben', async () => {
    const res = await request('/tasks', { method: 'POST', body: { title: '' } });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'VALIDATION');

    assert.equal((await request('/tasks/abc')).status, 400);
  });

  it('liefert 400 bei kaputtem JSON', async () => {
    const res = await fetch(`${baseUrl}/tasks`, { method: 'POST', body: '{kaputt' });
    assert.equal(res.status, 400);
  });

  it('liefert 404 für unbekannte Routen', async () => {
    assert.equal((await request('/gibt-es-nicht')).status, 404);
  });
});
