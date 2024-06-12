import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import drizzleConfig from '../../drizzle.config';

const sqlite = new Database(import.meta.dir + '/sqlite.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: drizzleConfig.out! });
