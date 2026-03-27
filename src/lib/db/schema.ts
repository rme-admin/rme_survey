
import { pgTable, uuid, text, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  statementA: text('statement_a').notNull(),
  statementB: text('statement_b').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  profession: varchar('profession', { length: 50 }).notNull(),
  institute: text('institute').notNull(),
  email: text('email'),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const responses = pgTable('responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
  choice: varchar('choice', { length: 20 }).notNull(), // 'A_AGREE', 'A_SOMETIMES', etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
