# DhakaDrive: Technical Design Specification

## Tech Stack Overview

* **Frontend:** Svelte 5 (Runes), SvelteKit 2.0, TailwindCSS, DaisyUI
* **Backend:** SvelteKit Server Actions (Edge Functions)
* **Database:** Postgres (Neon Serverless) managed via Drizzle ORM
* **Deployment:** Cloudflare Pages

---

## Core Data Requirement: Authentication

*Before any module functions, a base user identity is required.*

* **Data Model:** `users` table
* `id` (text/uuid, PK)
* `full_name` (text)
* `email` (text, unique)
* `role` (enum: `user`, `provider`, `admin`)
* `phone_number` (text, optional)

---

## Module 1: Traffic Information & Reporting

### Feature 1.1: Crowd-Based Traffic Updates

**User Story:**

> "As a daily commuter stuck at the Bijoy Sarani signal, I want to quickly open the app and tap 'Heavy Traffic' so that other drivers nearby know to avoid this route. Conversely, before I leave home, I want to check the map to see where red (heavy) zones are active."

**Detailed Definition:**
Users submit real-time status updates tied to their current GPS location. These reports are valid for a short window (e.g., 2 hours) and are aggregated to create a "heat map" of congestion.

* **CRUD Actions:**
* **Create:** Authenticated user submits a status report (Heavy, Moderate, Clear).
* **Read:** Fetch all active reports within a specific map viewport (Bounding Box).
* **Delete:** (System) Cron job or DB policy deletes/archives reports older than 2 hours.

* **Routes Required:**
* `GET /traffic` (Main Map UI)
* `GET /api/traffic/markers` (API to fetch pins based on map zoom/pan)

* **Server Actions (RPC):**
* `POST /traffic?/submitReport`: Receives `lat`, `lng`, `status`. Validates user distance from report location (anti-spam).

* **Data Model:**
* **Table:** `traffic_reports`
* `id` (serial, PK)
* `user_id` (FK -> users.id)
* `status` (enum: `heavy`, `moderate`, `clear`)
* `latitude` (decimal/double)
* `longitude` (decimal/double)
* `created_at` (timestamp, default now)

### Feature 1.2: Incident Reporting System

**User Story:**

> "As a witness to a car breakdown causing a bottleneck on the Flyover, I want to snap a photo and report 'Roadblock' so authorities or other drivers are alerted immediately."

**Detailed Definition:**
Distinct from general traffic flow, this tracks specific events (accidents, construction, floods). These persist longer than traffic reports and often require an image for verification.

* **CRUD Actions:**
* **Create:** User uploads an image (to R2/S3) and submits incident details.
* **Read:** Users view incident pins on the map; Click pin to see details/photo.
* **Update:** Admin or trusted users can mark it as "Resolved".

* **Routes Required:**
* `GET /traffic/incident/new` (Form)
* `GET /traffic/incident/[id]` (Details View)

* **Server Actions (RPC):**
* `POST /traffic/incident/new?/create`: Validates input, saves image URL, inserts DB record.

* **Data Model:**
* **Table:** `incidents`
* `id` (uuid, PK)
* `reporter_id` (FK -> users.id)
* `type` (enum: `accident`, `roadblock`, `flood`, `construction`)
* `description` (text)
* `image_url` (text)
* `latitude` / `longitude`
* `is_resolved` (boolean, default false)

---

## Module 2: Parking Locator & Management

### Feature 2.1: Provider Parking Management (Listings)

**User Story:**

> "As a shopping mall manager or a private garage owner, I want to list my parking lot on DhakaDrive, update my hourly rates, and manually toggle availability if my lot is full."

**Detailed Definition:**
Enables users with the `provider` role to CRUD parking spots. This serves as the inventory for the system.

* **CRUD Actions:**
* **Create:** Provider registers a new parking location with capacity details.
* **Read:** Provider views their own listings.
* **Update:** Provider edits price or `is_active` status.
* **Delete:** Provider removes a listing (soft delete).

* **Routes Required:**
* `GET /provider/parking` (Dashboard)
* `GET /provider/parking/new` (Creation Form)

* **Server Actions (RPC):**
* `POST /provider/parking?/save`: Upsert logic (Insert if new, Update if ID exists).

* **Data Model:**
* **Table:** `parking_spots`
* `id` (uuid, PK)
* `owner_id` (FK -> users.id)
* `title` (text)
* `address` (text)
* `latitude` / `longitude`
* `price_per_hour` (integer)
* `total_slots` (integer)
* `is_active` (boolean)

### Feature 2.2: Parking Booking & Availability

**User Story:**

> "As a driver heading to Gulshan 1, I want to search for parking nearby, see which buildings have open slots for the next 2 hours, and reserve a spot so I don't have to circle around looking for space."

**Detailed Definition:**
The core logic engine. It calculates availability by taking the `total_slots` of a parking spot and subtracting active bookings that overlap with the user's requested time window.

* **CRUD Actions:**
* **Read (Search):** Query spots where `(total_slots - active_bookings) > 0`.
* **Create:** Reserve a slot (Transaction required).
* **Update:** Cancel booking / Mark complete.

* **Routes Required:**
* `GET /parking` (Search UI with filters)
* `GET /parking/[id]/book` (Reservation summary & confirm)

* **Server Actions (RPC):**
* `POST /parking/[id]/book?/confirm`:

1. Start DB Transaction.
2. Check overlapping bookings for this `spot_id` in the requested time range.
3. If count < `total_slots`, Insert `booking`.
4. Else, throw "Sold Out" error.

* **Data Model:**
* **Table:** `bookings`
* `id` (uuid, PK)
* `user_id` (FK -> users.id)
* `spot_id` (FK -> parking_spots.id)
* `start_time` (timestamp)
* `end_time` (timestamp)
* `status` (enum: `active`, `cancelled`, `completed`)
* `total_cost` (decimal)

---

## Module 3: Vehicle Services & Assistance

### Feature 3.1: Service Request System (Uber-for-Mechanics)

**User Story:**

> "As a driver with a flat tire on the highway, I want to request 'Roadside Assistance'. The app should broadcast my request to nearby mechanics. Once a mechanic accepts, I want to see who is coming."

**Detailed Definition:**
A simplified dispatch system. Users create a "ticket," providers view a feed of open tickets and claim them.

* **CRUD Actions:**
* **Create:** User creates a service request.
* **Read (Provider):** View all requests with status `pending`.
* **Update:** Provider claims ticket (status -> `accepted`). User/Provider marks done (status -> `completed`).

* **Routes Required:**
* `GET /services/assist` (User Request Form)
* `GET /provider/requests` (Provider Job Feed)
* `GET /services/track/[id]` (Live status view)

* **Server Actions (RPC):**
* `POST /services/assist?/request`: Create ticket.
* `POST /provider/requests?/accept`: Assign `provider_id` to ticket.

* **Data Model:**
* **Table:** `service_requests`
* `id` (uuid, PK)
* `customer_id` (FK -> users.id)
* `provider_id` (FK -> users.id, nullable)
* `service_type` (enum: `mechanic`, `towing`, `ambulance`)
* `lat` / `lng`
* `status` (enum: `pending`, `accepted`, `completed`)
* `created_at` (timestamp)

---

## Module 4: Administration & Analytics

### Feature 4.1: User Report Verification

**User Story:**

> "As a System Administrator, I need to review user-submitted incidents (like road accidents) to ensure they aren't fake news before they stay permanently on the map. I can verify them or delete them."

**Detailed Definition:**
A moderation queue. Incidents might be visible immediately but flagged as "Unverified" until an admin checks them.

* **CRUD Actions:**
* **Read:** List incidents sorted by `created_at` desc.
* **Update:** Toggle `is_verified` boolean.
* **Delete:** Remove spam reports.

* **Routes Required:**
* `GET /admin/reports`

* **Server Actions (RPC):**
* `POST /admin/reports?/verify`: Set verified = true.
* `POST /admin/reports?/banUser`: (Optional) Block users submitting spam.

### Feature 4.2: Traffic Analytics Dashboard

**User Story:**

> "As an Admin, I want to see a chart showing which hours of the day have the highest number of 'Heavy Traffic' reports so we can issue warnings."

**Detailed Definition:**
Read-only data visualization. Aggregates data from `traffic_reports` and `bookings`.

* **CRUD Actions:**
* **Read:** Complex SQL aggregations (Count, Group By).

* **Routes Required:**
* `GET /admin/dashboard`

* **Data Visualization:**
* Chart 1: Traffic Reports count by Hour (00:00 - 23:59).
* Chart 2: Revenue generated from Parking Bookings (Daily).
