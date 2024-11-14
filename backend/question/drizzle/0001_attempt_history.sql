CREATE TABLE IF NOT EXISTS "question_attempts" (
	"attempt_id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"user_id_1" uuid NOT NULL,
	"user_id_2" uuid,
	"code" text NOT NULL,
	"timestamp" timestamp (6) with time zone DEFAULT now(),
	"language" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_users_attempt" ON "question_attempts" USING btree ("question_id","user_id_1","user_id_2");