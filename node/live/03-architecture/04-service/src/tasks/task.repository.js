// Datenzugriffsschicht: kapselt SQL komplett.
// Die Methoden sind async, obwohl node:sqlite synchron ist – so bleibt das
// Interface stabil, wenn später Postgres & Co. dahinterstehen.

const schema = `
  CREATE TABLE IF NOT EXISTS tasks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    done       INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL
  )`;

export class SqliteTaskRepository {
  #statements;

  constructor(db) {
    // TODO 1: Schema anlegen und Statements einmalig vorbereiten
  }

  // TODO 2: Abfragen ausführen und Zeilen in Domain-Objekte übersetzen
}

function toTask(row) {
  return { id: row.id, title: row.title, done: Boolean(row.done), createdAt: row.created_at };
}
