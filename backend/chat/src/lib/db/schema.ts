import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().notNull().defaultRandom(), // Unique message ID
  roomId: varchar('room_id', { length: 255 }).notNull(), // Room ID to identify chat rooms
  senderId: uuid('sender_id').notNull(), // ID of the user sending the message
  message: text('message').notNull(), // The chat message content
  createdAt: timestamp('created_at').defaultNow(), // Timestamp for when the message was created
});

export const actionEnum = pgEnum('action', ['SEED']);

export const admin = pgTable('admin', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  action: actionEnum('action').notNull(),
});
