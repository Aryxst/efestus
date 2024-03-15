import { Database } from 'bun:sqlite';
import { tables } from '@/database';
import './fix';
// This script will fill the database empty rowid spots
if (confirm('Were all tables backed up correctly') && confirm('Are you sure? If not data could be lost!')) {
 const db = new Database(import.meta.dir + '/out/db/sanitezed.sqlite', { create: true });
 db.exec('PRAGMA journal_mode = WAL;');
 for (const table of tables) {
  db.exec(table);
 }
 const db_json_files = Array.from(new Bun.Glob('*').scanSync({ cwd: `./scripts/out/tables`, absolute: true }));
 for (const json_table of db_json_files) {
  const req = require(json_table);

  let table_name: string | string[] = json_table.split('/');
  table_name = table_name[table_name.length - 1].split('.')[0];
  req.map((obj: any) => {
   db.exec(
    `INSERT INTO ${table_name} (${Object.keys(obj).join(',')}) VALUES (${Object.values(obj)
     .map(item => (Number(item) ? Number(item) : `"${item}"`))
     .join(',')});`
   );
  });
 }
}
