DO $$ 
BEGIN
    CREATE TYPE "public"."action" AS ENUM('SEED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "admin" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "action" "public"."action" NOT NULL
);

CREATE TABLE IF NOT EXISTS "chat_messages" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "room_id" varchar(255) NOT NULL,
    "sender_id" uuid NOT NULL,
    "message" text NOT NULL, 
    "created_at" timestamp DEFAULT now() 
);
