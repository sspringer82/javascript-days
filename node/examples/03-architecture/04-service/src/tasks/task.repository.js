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
    // #region 1: Schema anlegen und Statements einmalig vorbereiten
    db.exec(schema);
    this.#statements = {
      findAll: db.prepare('SELECT * FROM tasks ORDER BY id'),
      findByDone: db.prepare('SELECT * FROM tasks WHERE done = ? ORDER BY id'),
      findById: db.prepare('SELECT * FROM tasks WHERE id = ?'),
      insert: db.prepare('INSERT INTO tasks (title, created_at) VALUES (:title, :createdAt) RETURNING *'),
      update: db.prepare('UPDATE tasks SET title = :title, done = :done WHERE id = :id RETURNING *'),
      remove: db.prepare('DELETE FROM tasks WHERE id = ?'),
    };
    // #endregion
  }

  // #region 2: Abfragen ausführen und Zeilen in Domain-Objekte übersetzen
  async findAll({ done } = {}) {
    const rows = done === undefined ? this.#statements.findAll.all() : this.#statements.findByDone.all(Number(done));
    return rows.map(toTask);
  }

  async findById(id) {
    const row = this.#statements.findById.get(id);
    return row && toTask(row);
  }

  async insert({ title }) {
    return toTask(this.#statements.insert.get({ title, createdAt: new Date().toISOString() }));
  }

  async update(id, { title, done }) {
    const row = this.#statements.update.get({ id, title, done: Number(done) });
    return row && toTask(row);
  }

  async remove(id) {
    return this.#statements.remove.run(id).changes > 0;
  }
  // #endregion
}

function toTask(row) {
  return { id: row.id, title: row.title, done: Boolean(row.done), createdAt: row.created_at };
}
