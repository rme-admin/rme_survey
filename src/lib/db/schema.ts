
import { pgTable, uuid, text, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  statementA: text('statement_a').notNull(),
  statementB: text('statement_b').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const responses = pgTable('responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  choice: varchar('choice', { length: 1 }).notNull(), // 'A' or 'B'
  metadata: text('metadata'), // JSON string for timestamps/device info
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
