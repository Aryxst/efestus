import { Database } from 'bun:sqlite';
import * as Q from './queryInterfaces';
const db = new Database(import.meta.dir + '/db.sqlite', { create: true });

db.exec(`
CREATE TABLE IF NOT EXISTS files (
  name VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  attachment_url VARCHART(255) DEFAULT ''
);
`);

const upload_file = (name: string, attachment_url: string = '') =>
 db.exec(
  `
  INSERT INTO files (name, upload_date, attachment_url) 
  VALUES (?, ?, ?);
  `,
  [name, new Date().toLocaleDateString(), attachment_url]
 );
const get_file_query = db.query('SELECT * FROM files WHERE rowid = ?');
const get_file = (rowid: number) => get_file_query.get(rowid) as Q.File;

const get_all = (table_name: string) => db.prepare(`SELECT *, rowid as id FROM ${table_name}`).all() as Q.File[];
const get_table_count = (table_name: string) => db.prepare(`SELECT COUNT(*) as rows FROM ${table_name};`).get() as Q.RowCount;
export { get_file, upload_file, get_table_count, get_all };
export default db;
