import {
  boolean,
  geometry,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";


// ----------------------------------------------------------------------
// AUTH SCHEMA
// ----------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// ----------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------

export const trafficStatusEnum = pgEnum("traffic_status", [
  "Heavy",
  "Moderate",
  "Clear",
]);

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
  "Rejected",
]);

// ----------------------------------------------------------------------
// Module 1: Traffic Information & Reporting
// ----------------------------------------------------------------------

export const trafficReports = pgTable("traffic_reports", {
  id: serial("id").primaryKey(),
  // UPDATED: Changed integer to text and added reference
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),

  status: trafficStatusEnum("status").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isVerified: boolean("is_verified").default(false),

  // Note: Ensure PostGIS is installed in your DB for geometry types
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trafficNews = pgTable("traffic_news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  source: text("source"),
  publishedAt: timestamp("published_at").defaultNow(),
});

// ----------------------------------------------------------------------
// Module 2: Parking Locator & Management
// ----------------------------------------------------------------------

export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),

  // UPDATED: Owner is a user
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),

  name: text("name").notNull(),
  address: text("address"),
  totalSlots: integer("total_slots").notNull().default(1),
  isAvailable: boolean("is_available").default(true),
  pricePerHour: integer("price_per_hour"),
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  // UPDATED: Linked to User
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  parkingSpotId: integer("parking_spot_id").references(() => parkingSpots.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------
// Module 3: Vehicle Services & Assistance
// ----------------------------------------------------------------------

export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: serviceTypeEnum("type").notNull(),
  contactInfo: text("contact_info").notNull(),
  address: text("address"),
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
  rating: integer("rating").default(0),
});

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  // UPDATED: Linked to User
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  providerId: integer("provider_id").references(() => serviceProviders.id),
  issueDescription: text("issue_description").notNull(),
  status: requestStatusEnum("status").default("Pending"),
  userLocation: geometry("user_location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  
  // NEW: Approval fields
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
  approvedByAdminId: text("approved_by_admin_id").references(() => user.id, { onDelete: "set null" }),
  
  // NEW: Request details
  requestedDateTime: timestamp("requested_date_time"),
  notes: text("notes"),
});

export const savedProviders = pgTable("saved_providers", {
  id: serial("id").primaryKey(),
  // UPDATED: Linked to User
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  providerId: integer("provider_id")
    .references(() => serviceProviders.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceAppointments = pgTable("service_appointments", {
  id: serial("id").primaryKey(),
  // UPDATED: Linked to User
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  providerId: integer("provider_id")
    .references(() => serviceProviders.id)
    .notNull(),
  appointmentTime: timestamp("appointment_time").notNull(),
  serviceType: text("service_type").notNull(),
  notes: text("notes"),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  // Optional: You might want to link feedback to a user if they are logged in, 
  // but keeping it loose (name/email) is also fine for guests.
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),

  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
