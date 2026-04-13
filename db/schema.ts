import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const urlLinks = pgTable('url_links', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type UrlLink = typeof urlLinks.$inferSelect;
export type NewUrlLink = typeof urlLinks.$inferInsert;
