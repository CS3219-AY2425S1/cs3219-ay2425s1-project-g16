import { pgEnum, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  topic: varchar('topic', { length: 255 }).array().notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).defaultNow(),
});

export const actionEnum = pgEnum('action', ['SEED']);

export const admin = pgTable('admin', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  action: actionEnum('action').notNull(),
});
