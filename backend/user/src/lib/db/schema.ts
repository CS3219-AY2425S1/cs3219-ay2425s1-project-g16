import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// Define the user table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(), // UUID as primary key with a default random value
  email: varchar('email', { length: 255 }).unique().notNull(), // Email field, unique and required
  username: varchar('username', { length: 255 }).unique().notNull(), // Username field, unique and required
  firstName: varchar('first_name', { length: 255 }).notNull(), // First name field, required
  lastName: varchar('last_name', { length: 255 }).notNull(), // Last name field, required
  password: varchar('password', { length: 255 }).notNull(), // Password field, required (hashed password)
  failedAttempts: smallint('failed_attempts').default(0), // Failed counts
  unlockTime: timestamp('unlock_time', { precision: 6, withTimezone: true }), // If failed counts > limit, block all attempts until this time.
  attemptedQuestions: integer('attempted_questions').array(),
  isAdmin: boolean('is_admin').default(false),
});

export const actionEnum = pgEnum('action', ['SEED']);

export const admin = pgTable('admin', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  action: actionEnum('action').notNull(),
});
