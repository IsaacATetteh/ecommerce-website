ALTER TABLE "twoFactorTokens" ADD COLUMN "userID" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "twoFactorTokens" ADD CONSTRAINT "twoFactorTokens_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
