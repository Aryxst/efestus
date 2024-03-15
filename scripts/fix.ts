import db from '@/database';
//This script isn't a migration it just sanitaizes the database
console.clear();
console.log(`\nStarting migration...\n`);
const start = performance.now();
for (const table of db
 .prepare(
  `
  SELECT name 
  FROM sqlite_master 
  WHERE type='table' 
  AND name NOT LIKE 'sqlite_%';`
 )
 .all() as { name: string }[]) {
 const start_table = performance.now();
 Bun.write(`${import.meta.dir}/out/tables/${table.name}.json`, JSON.stringify(db.prepare(`SELECT * FROM ${table.name}`).all(), null, 1));
 console.log(`Finished converting table ${table.name} - took ${(performance.now() - start_table).toFixed(2)}ms`);
}
console.log(`\nJSON conversion and migration took ${(performance.now() - start).toFixed(2)}ms\n`);
