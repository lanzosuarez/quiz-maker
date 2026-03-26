const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data.sqlite');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function runSQLFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  db.exec(sql);
}

function migrate() {
  const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
  runSQLFile(schemaPath);

  // Add code_snippet column if it doesn't exist (for existing databases)
  const cols = db.prepare("PRAGMA table_info(questions)").all();
  if (!cols.some((c) => c.name === "code_snippet")) {
    db.exec("ALTER TABLE questions ADD COLUMN code_snippet TEXT");
  }
}

module.exports = { db, migrate };
