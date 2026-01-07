CREATE TYPE "public"."request_status" AS ENUM('Pending', 'Accepted', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('Mechanic', 'Towing', 'CarWash', 'Emergency', 'Fuel');--> statement-breakpoint
CREATE TYPE "public"."traffic_status" AS ENUM('Heavy', 'Moderate', 'Clear');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"parking_spot_id" integer,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" text DEFAULT 'confirmed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parking_spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text,
	"name" text NOT NULL,
	"address" text,
	"total_slots" integer DEFAULT 1 NOT NULL,
	"is_available" boolean DEFAULT true,
	"price_per_hour" integer,
	"location" geometry(point) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" integer NOT NULL,
	"appointment_time" timestamp NOT NULL,
	"service_type" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'confirmed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "service_type" NOT NULL,
	"contact_info" text NOT NULL,
	"address" text,
	"location" geometry(point) NOT NULL,
	"rating" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" integer,
	"issue_description" text NOT NULL,
	"status" "request_status" DEFAULT 'Pending',
	"user_location" geometry(point) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "traffic_news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"source" text,
	"published_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "traffic_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"status" "traffic_status" NOT NULL,
	"description" text,
	"image_url" text,
	"is_verified" boolean DEFAULT false,
	"location" geometry(point) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_parking_spot_id_parking_spots_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking_spots" ADD CONSTRAINT "parking_spots_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_providers" ADD CONSTRAINT "saved_providers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_providers" ADD CONSTRAINT "saved_providers_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_appointments" ADD CONSTRAINT "service_appointments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_appointments" ADD CONSTRAINT "service_appointments_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traffic_reports" ADD CONSTRAINT "traffic_reports_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");