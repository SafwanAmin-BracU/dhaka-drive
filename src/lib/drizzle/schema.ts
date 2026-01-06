import {
  boolean,
  geometry,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ----------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------

// "Users can submit traffic status ('Heavy', 'Moderate', 'Clear')" [cite: 20]
export const trafficStatusEnum = pgEnum("traffic_status", ["Heavy", "Moderate", "Clear"]);

// "mechanics, and emergency hotlines... towing services" [cite: 34, 35]
export const serviceTypeEnum = pgEnum("service_type", [
  "Mechanic",
  "Towing",
  "CarWash",
  "Emergency",
  "Fuel",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "Pending",
  "Accepted",
  "Completed",
  "Cancelled",
]);

// ----------------------------------------------------------------------
// Module 1: Traffic Information & Reporting
// ----------------------------------------------------------------------

export const trafficReports = pgTable("traffic_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Link to a User table if you have auth

  // "Users can submit traffic status" [cite: 20]
  status: trafficStatusEnum("status").notNull(),

  // "Users can report accidents or roadblocks with text and optional photos" [cite: 22]
  description: text("description"),
  imageUrl: text("image_url"),

  // "Admins can review and approve user-submitted traffic reports" [cite: 42]
  isVerified: boolean("is_verified").default(false),

  // Geo-spatial location of the report
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

// "Summarized daily traffic and road closure updates" [cite: 24]
export const trafficNews = pgTable("traffic_news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  source: text("source"), // "Verified sources" [cite: 24]
  publishedAt: timestamp("published_at").defaultNow(),
});

// ----------------------------------------------------------------------
// Module 2: Parking Locator & Management
// ----------------------------------------------------------------------

export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),

  // "Parking owners... can add available spots" [cite: 27]
  ownerId: integer("owner_id"),
  name: text("name").notNull(),
  address: text("address"), // "with address" [cite: 27]

  // "and slots" [cite: 27]
  totalSlots: integer("total_slots").notNull().default(1),

  // "Show open/occupied spots" [cite: 28]
  isAvailable: boolean("is_available").default(true),
  pricePerHour: integer("price_per_hour"), // Optional, for "Integrated Payment System" [cite: 49]

  // Parking location coordinates
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

// "Reserve a parking spot for a given time range" [cite: 29]
// "View your past parking bookings" [cite: 30]
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  parkingSpotId: integer("parking_spot_id").references(() => parkingSpots.id),

  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").default("confirmed"), // confirmed, cancelled, completed

  createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------
// Module 3: Vehicle Services & Assistance
// ----------------------------------------------------------------------

// "Nearby towing services, mechanics... car wash" [cite: 34, 38]
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: serviceTypeEnum("type").notNull(),
  contactInfo: text("contact_info").notNull(), // "Provides contact info" [cite: 35]
  address: text("address"),

  // Location to find "nearby" providers
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),

  rating: integer("rating").default(0),
});

// "Users can request roadside help... and get matched" [cite: 36, 37]
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id").references(() => serviceProviders.id),

  issueDescription: text("issue_description").notNull(), // e.g. "flat tire" [cite: 36]
  status: requestStatusEnum("status").default("Pending"),

  // Location where the user needs help
  userLocation: geometry("user_location", { type: "point", mode: "xy", srid: 4326 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

// "Users can bookmark their preferred garages" [cite: 40]
export const savedProviders = pgTable("saved_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id")
    .references(() => serviceProviders.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ... existing code ...

// ----------------------------------------------------------------------
// NEW: Service Appointments (Module 3 Feature 3)
// ----------------------------------------------------------------------

// "Users can schedule carwash or maintenance services"
export const serviceAppointments = pgTable("service_appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Link to your User auth table
  providerId: integer("provider_id")
    .references(() => serviceProviders.id)
    .notNull(),

  appointmentTime: timestamp("appointment_time").notNull(),
  serviceType: text("service_type").notNull(), // e.g. "Full Wash", "Oil Change"
  notes: text("notes"),

  status: text("status").default("confirmed"), // confirmed, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),

  // Sender Details
  name: text("name").notNull(),
  email: text("email").notNull(),

  // Message Content
  subject: text("subject").notNull(),
  message: text("message").notNull(),

  // Status flags
  isRead: boolean("is_read").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
