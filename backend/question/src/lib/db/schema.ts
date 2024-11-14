import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  topic: varchar('topic', { length: 255 }).array().notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).defaultNow(),
});

export const questionAttempts = pgTable(
  'question_attempts',
  {
    attemptId: serial('attempt_id').primaryKey(),
    questionId: integer('question_id').notNull(),
    userId1: uuid('user_id_1').notNull(),
    userId2: uuid('user_id_2'), // Nullable if only one user is involved
    code: text('code').notNull(),
    timestamp: timestamp('timestamp', { precision: 6, withTimezone: true }).defaultNow(),
    language: varchar('language', { length: 50 }).notNull(),
  },
  (questionAttempt) => ({
    uniqueUsersAttempt: uniqueIndex('unique_users_attempt').on(
      questionAttempt.questionId,
      questionAttempt.userId1,
      questionAttempt.userId2
    ),
  })
);

export const actionEnum = pgEnum('action', ['SEED']);

export const admin = pgTable('admin', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  action: actionEnum('action').notNull(),
});
