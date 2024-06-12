import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';
const client = new Database(import.meta.dir + '/sqlite.db');

// This enables WAL mode, for more info see: https://www.sqlite.org/wal.html
client.exec('PRAGMA journal_mode = WAL;');

export const db = drizzle(client, { schema });

export default db;
export * from './schema';
export { client, schema };
