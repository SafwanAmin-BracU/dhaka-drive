ALTER TABLE "service_requests" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "service_requests" ADD COLUMN "rejected_at" timestamp;--> statement-breakpoint
ALTER TABLE "service_requests" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "service_requests" ADD COLUMN "approved_by_admin_id" text;--> statement-breakpoint
ALTER TABLE "service_requests" ADD COLUMN "requested_date_time" timestamp;--> statement-breakpoint
ALTER TABLE "service_requests" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TYPE "public"."request_status" ADD VALUE 'Rejected';--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_approved_by_admin_id_user_id_fk" FOREIGN KEY ("approved_by_admin_id") REFERENCES "user"("id") ON DELETE set null;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_requests_status_idx" ON "service_requests" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_requests_approved_by_admin_id_idx" ON "service_requests" ("approved_by_admin_id");--> statement-breakpoint
