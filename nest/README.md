# Nestjs

## Installation

1. npm install @nestjs/cli
    nest new

2. npx @nestjs/cli new

## Links
* https://github.com/TrilonIO/nest-vitest
* https://docs.nestjs.com/exception-filters#built-in-http-exceptions

## Endpunkte

1. Modul erzeugen:
nest generate module books
2. Controller erzeugen:
nest generate controller books books
3. Service erzeugen:
nest generate service books books

## Datenbank
1. npm install prisma @prisma/adapter-better-sqlite3 @prisma/client better-sqlite3 --save-dev
2. npx prisma init
3. Schema anpassen (prisma/prisma.schema)
4. Konfiguration anpassen (prisma.config.ts)
5. npx prisma generate
6. npx prisma migrate dev --name init
7. Modul erzeugen: nest generate module prisma
8. Service erzeugen: nest generate service prisma
9. Prisma Service im Modul exportieren
10. Service nutzen

curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title": "my test book vol2", "isbn": "978-3-86680-192-9", "author": "John Doe", "publishedYear": 2026}'
