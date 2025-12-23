CREATE TABLE "service_appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"appointment_time" timestamp NOT NULL,
	"service_type" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'confirmed',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "service_appointments" ADD CONSTRAINT "service_appointments_provider_id_service_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_providers"("id") ON DELETE no action ON UPDATE no action;