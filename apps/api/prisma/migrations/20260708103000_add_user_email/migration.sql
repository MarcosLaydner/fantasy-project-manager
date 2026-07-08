-- AlterTable
ALTER TABLE "users" ADD COLUMN "email" TEXT;

-- Backfill existing development rows so the column can become required.
UPDATE "users"
SET "email" = "username" || '@example.local'
WHERE "email" IS NULL;

ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
