import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const file = sqliteTable('file', {
 id: text('id')
  .primaryKey()
  .$defaultFn(() => createId()),
 ownerId: integer('ownerId').notNull(),
 name: text('name').notNull(),
 uploadedAt: integer('joinedAt', { mode: 'timestamp_ms' })
  .notNull()
  .$defaultFn(() => sql`(unixepoch() * 1000)`),
 attachmentUrl: text('attachmentUrl').notNull(),
});
