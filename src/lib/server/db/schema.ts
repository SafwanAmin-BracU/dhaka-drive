import { boolean, decimal, geometry, index, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


const geometryConfig = { type: 'point', mode: 'xy' as const, srid: 4326 }
const geometryPoint = (name: string) => geometry(name, geometryConfig);

// --- ENUMS ---
export const trafficStatusEnum = pgEnum("traffic_status", ["Heavy", "Moderate", "Clear"]);
export const incidentTypeEnum = pgEnum("incident_type", ["Accident", "Roadblock", "Construction", "Other"]);
export const bookingStatusEnum = pgEnum("booking_status", ["Reserved", "Completed", "Cancelled"]);
export const serviceTypeEnum = pgEnum("service_type", ["Towing", "Mechanic", "CarWash", "Emergency"]);



// --- 1. CORE USER MANAGEMENT ---
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash").notNull(),
    isAdmin: boolean("is_admin").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// --- 2. TRAFFIC MODULE ---
export const trafficReports = pgTable("traffic_reports", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    status: trafficStatusEnum("status").notNull(),
    location: geometryPoint("location").notNull(),
    reportedAt: timestamp("reported_at").defaultNow(),
    confirmations: integer("confirmations").default(0),
}, (table) => ({
    spatialIndex: index("traffic_idx").using("gist", table.location),
}));

export const incidents = pgTable("incidents", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    type: incidentTypeEnum("type").notNull(),
    description: text("description"),
    imageUrl: varchar("image_url"),
    location: geometryPoint("location").notNull(),
    isResolved: boolean("is_resolved").default(false),
    reportedAt: timestamp("reported_at").defaultNow(),
}, (table) => ({
    spatialIndex: index("incident_idx").using("gist", table.location),
}));

// --- 3. PARKING MODULE ---
export const parkingLocations = pgTable("parking_locations", {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id").references(() => users.id).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    location: geometryPoint("location").notNull(),
    totalSlots: integer("total_slots").notNull(),
    pricePerHour: decimal("price_per_hour", { precision: 10, scale: 2 }).notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    spatialIndex: index("parking_idx").using("gist", table.location),
}));

export const parkingBookings = pgTable("parking_bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    parkingId: uuid("parking_id").references(() => parkingLocations.id).notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
    status: bookingStatusEnum("status").default("Reserved"),
    createdAt: timestamp("created_at").defaultNow(),
});

// --- 4. SERVICES MODULE ---
export const serviceProfiles = pgTable("service_profiles", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    businessName: varchar("business_name", { length: 255 }).notNull(),
    serviceType: serviceTypeEnum("service_type").notNull(),
    location: geometryPoint("location").notNull(),
    phoneContact: varchar("phone_contact", { length: 50 }).notNull(),
    description: text("description"),
    isVerified: boolean("is_verified").default(false),
}, (table) => ({
    spatialIndex: index("service_idx").using("gist", table.location),
}));

export const savedServices = pgTable("saved_services", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    serviceProfileId: uuid("service_profile_id").references(() => serviceProfiles.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    pk: index("saved_pk").on(table.userId, table.serviceProfileId),
}));