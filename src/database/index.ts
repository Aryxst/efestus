import { Database } from 'bun:sqlite';
const db = new Database(import.meta.dir + '/db.sqlite', { create: true });
// This enables WAL mode, for more info see: https://www.sqlite.org/wal.html
db.exec('PRAGMA journal_mode = WAL;');
export const tables = [
 `
CREATE TABLE IF NOT EXISTS files (
  name VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  attachment_url VARCHAR(255) DEFAULT ''
);
`,
];
for (const table of tables) {
 db.exec(table);
}

export default db;
