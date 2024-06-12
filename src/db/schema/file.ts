import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const file = sqliteTable('file', {
 id: text('id')
  .primaryKey()
  .$defaultFn(() => createId()),
 ownerId: integer('ownerId').notNull(),
 name: text('name').notNull(),
 createdAt: integer('createdAt', { mode: 'timestamp_ms' })
  .notNull()
  .$defaultFn(() => sql`(unixepoch() * 1000)`),
 attachmentUrl: text('attachmentUrl').notNull(),
});
