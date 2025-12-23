CREATE TYPE "public"."request_status" AS ENUM('Pending', 'Accepted', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('Mechanic', 'Towing', 'CarWash', 'Emergency', 'Fuel');--> statement-breakpoint
CREATE TYPE "public"."traffic_status" AS ENUM('Heavy', 'Moderate', 'Clear');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"parking_spot_id" integer,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" text DEFAULT 'confirmed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parking_spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer,
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
	"user_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
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
	"user_id" integer NOT NULL,
	"provider_id" integer,
	"issue_description" text NOT NULL,
	"status" "request_status" DEFAULT 'Pending',
	"user_location" geometry(point) NOT NULL,
	"created_at" timestamp DEFAULT now()
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
	"user_id" integer,
	"status" "traffic_status" NOT NULL,
	"description" text,
	"image_url" text,
	"is_verified" boolean DEFAULT false,
	"location" geometry(point) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_parking_spot_id_parking_spots_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_providers" ADD CONSTRAINT "saved_providers_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;