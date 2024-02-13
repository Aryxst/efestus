import { Database } from 'bun:sqlite';
import * as Q from './queryInterfaces';
const db = new Database(import.meta.dir + '/db.sqlite', { create: true });

db.exec(`
CREATE TABLE IF NOT EXISTS files (
  name VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  buffer BLOB NOT NULL,
  attachment_url VARCHART(255) DEFAULT ''
);
`);

const file_query = db.query('SELECT * FROM files WHERE rowid = ?');
const upload_file = (name: string, buffer: Buffer) =>
 db.exec(
  `
INSERT INTO files (name, upload_date, buffer) 
VALUES (?, ?, ?);
`,
  [name, new Date().toLocaleDateString(), buffer]
 );
const get_file = (rowid: number) => file_query.get(rowid) as Q.File;
const get_table_count = (table_name: string) => db.prepare(`PRAGMA table_info(${table_name})`).get();
export { get_file, upload_file, get_table_count };
export default db;
