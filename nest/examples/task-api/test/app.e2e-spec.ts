// Start: npm run test:e2e   (im Ordner task-api)
// Echte App mit allen globalen Pipes, Guards, Interceptors und Filtern.

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { databaseConfig } from '../src/database/database.config.js';

describe('Task API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      // #region 3.7: In-Memory-Datenbank statt Datei
      .overrideProvider(databaseConfig.KEY)
      .useValue({ file: ':memory:' })
      // #endregion
      .compile();

    app = moduleRef.createNestApplication({ logger: false });
    await app.init();
  });

  afterAll(() => app.close());

  const api = () => request(app.getHttpServer());

  async function login(email: string, password: string) {
    const res = await api().post('/auth/login').send({ email, password });
    return res.body.accessToken as string;
  }

  it('GET /health ist öffentlich', () =>
    api()
      .get('/health')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok')));

  it('schützt alle anderen Routen', () => api().get('/tasks').expect(401));

  describe('als registrierter User', () => {
    let token: string;

    beforeAll(async () => {
      await api()
        .post('/auth/register')
        .send({ email: 'basti@example.com', password: 'geheim123' })
        .expect(201)
        .expect((res) => expect(res.body).not.toHaveProperty('passwordHash'));
      token = await login('basti@example.com', 'geheim123');
    });

    it('legt Tasks an, ändert und listet sie', async () => {
      const created = await api()
        .post('/tasks')
        .auth(token, { type: 'bearer' })
        .send({ title: '  Nest lernen  ' })
        .expect(201);

      expect(created.body).toEqual({
        id: expect.any(Number),
        title: 'Nest lernen',
        done: false,
        createdAt: expect.any(String),
      });

      await api()
        .patch(`/tasks/${created.body.id}`)
        .auth(token, { type: 'bearer' })
        .send({ done: true })
        .expect(200);

      const list = await api()
        .get('/tasks?done=true')
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(list.body).toHaveLength(1);
    });

    it('validiert Eingaben', async () => {
      const res = await api()
        .post('/tasks')
        .auth(token, { type: 'bearer' })
        .send({ title: '' })
        .expect(400);
      expect(res.body.message).toEqual([expect.stringMatching(/^title:/)]);
    });

    it('übersetzt fachliche Fehler', async () => {
      await api()
        .get('/tasks/999')
        .auth(token, { type: 'bearer' })
        .expect(404)
        .expect((res) => expect(res.body.errorCode).toBe('NOT_FOUND'));

      await api()
        .post('/auth/register')
        .send({ email: 'basti@example.com', password: 'geheim123' })
        .expect(409);
    });

    it('verweigert Admin-Routen', () =>
      api().get('/users').auth(token, { type: 'bearer' }).expect(403));
  });

  it('erlaubt Admins die Benutzerliste', async () => {
    // Admin kommt aus ADMIN_EMAIL / ADMIN_PASSWORD (vitest.config.e2e.ts)
    const token = await login('admin@example.com', 'admin-passwort');
    await api().get('/users').auth(token, { type: 'bearer' }).expect(200);
  });
});
