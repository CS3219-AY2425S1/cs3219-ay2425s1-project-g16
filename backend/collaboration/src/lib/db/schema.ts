import { pgEnum, pgTable, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const rooms = pgTable('rooms', {
  roomId: varchar('room_id', { length: 255 }).primaryKey().notNull(),
  userId1: uuid('user_id_1').notNull(),
  userId2: uuid('user_id_2').notNull(),
  questionId: serial('question_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const actionEnum = pgEnum('action', ['SEED']);

export const admin = pgTable('admin', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  action: actionEnum('action').notNull(),
});
