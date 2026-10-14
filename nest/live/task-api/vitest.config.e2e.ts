import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    // node:sqlite ist noch experimentell
    execArgv: ['--disable-warning=ExperimentalWarning'],
    // Feste Werte statt .env: Tests laufen überall gleich
    env: {
      JWT_SECRET: 'e2e-secret-mindestens-32-zeichen-lang',
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'admin-passwort',
    },
  },
});
