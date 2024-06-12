import { type Config, defineConfig } from 'drizzle-kit';

// This file is just for reference, not needed

export default defineConfig({
 schema: './src/db/schema/index.ts',
 out: './src/db/migrations',
 dialect: 'sqlite',
 dbCredentials: {
  url: './src/db/sqlite.db',
 },
 verbose: true,
 // satisfies Config
}) as Config;
