<!-- markdownlint-disable-file MD036 -->
# DhakaDrive: Detailed Technical Specification

## Module 1: Traffic Information & Reporting

### Feature 1.1: Crowd-Based Traffic Updates

**User Story: The Commuter’s Contribution**

> It is 8:45 AM, and Rafiq is stuck in gridlock at the Bijoy Sarani intersection. He opens DhakaDrive. He sees his location on the map, but the road isn't red yet. He wants to warn others. He taps the "Report" button, selects "Heavy Traffic," and hits send. He immediately sees a red marker appear under his car on the screen and gets a thank-you message. He feels satisfied knowing he helped the community, even though he knows his internet connection is spotty.

**System Requirement Story**

> When the user initiates a report, the system must first capture the device's GPS coordinates. Because GPS can be unreliable, the interface must prevent the user from manually dragging the pin to a location far away from their actual position—a "geofence" check must ensure the reported location is within 500 meters of the device's real location.
> Upon submission, the frontend must employ an "Optimistic UI" pattern. This means the app instantly renders the traffic marker on the user's map *before* waiting for the server to confirm, making the app feel incredibly fast. Simultaneously, the backend receives the data. It checks a "Cooldown" table: if Rafiq has already submitted a report in this zone in the last 15 minutes, the server silently discards the duplicate to prevent spamming but still returns a success code to the UI.
> On the read side, the system must not show every single dot. If 50 people at Bijoy Sarani report "Heavy," the server must aggregate these into a single "High Intensity" heat blob. Finally, a background "Garbage Collector" process must run every minute to identify reports older than 2 hours and mark them as expired, ensuring the map only shows fresh data.

* **CRUD Actions:** Create (Report), Read (Heatmap).
* **Routes:** `/traffic` (Map), `/api/traffic/submit` (Action).
* **Data Model:** `traffic_reports` (id, user_id, lat, lng, status, created_at, expires_at).

### Feature 1.2: Incident Reporting (Accidents/Roadblocks)

**User Story: The Good Samaritan**

> Ayesha witnesses a minor collision on the Flyover that is blocking two lanes. She pulls over safely and opens the "Incident" tab. She taps "Take Photo," captures the scene, and selects "Accident." She writes "Two lanes blocked" and submits. Because the file is large, she watches a progress bar. Once it hits 100%, the app tells her the report is "Pending Verification." She sees a yellow "Caution" pin on her map, distinct from the red traffic lines.

**System Requirement Story**

> The incident reporting flow handles rich media. When Ayesha selects a photo, the system must not try to send the binary file to the main application server. Instead, it must request a "Presigned URL" from the backend (Cloudflare R2/AWS S3). The frontend then uploads the image directly to this storage URL. This prevents the server from hanging during slow uploads.
> While the upload happens, the "Submit" button must remain disabled. Once the upload confirms, the form data (including the new image URL) is sent to the database. The system defaults this new record's `is_verified` flag to `false`.
> On the map, the system renders these unverified incidents with a specific visual style (e.g., a yellow icon with a question mark) to indicate to other drivers that this report is user-generated and not yet official. The system keeps this report active until either an Admin verifies it or 24 hours pass without corroboration.

* **CRUD Actions:** Create (Incident), Read (Map Pins), Update (Admin Verify).
* **Routes:** `/traffic/incident/new`, `/traffic/incident/[id]`.
* **Data Model:** `incidents` (id, type, image_url, description, lat, lng, is_verified, is_resolved).

---

## Module 2: Parking Locator & Management

### Feature 2.1: Provider Management Dashboard

**User Story: The Garage Owner**

> Mr. Rahman owns "Gulshan Tower Parking." He logs into his dashboard to see his list of spots. He realizes he set the price wrong—it should be 50 Taka, not 40. He clicks "Edit" on the listing. He updates the price and hits save. The button spins, saying "Updating...", and then flashes "Saved!" in green. Later, he decides to stop renting out "Slot B" because of repairs. He clicks "Delete." The system asks him, "Are you sure? This will hide the spot from search." He confirms, and the spot vanishes from the list.

**System Requirement Story**

> This feature is strictly gated. The backend middleware must intercept every request to `/provider/*` and verify the user's session role is 'Provider'. If a normal user tries to access this, they are redirected to the homepage.
> When Mr. Rahman updates a price, the system executes an `UPDATE` query. However, for the "Delete" action, the system must perform a "Soft Delete." It does not actually remove the row from the database (which would corrupt history for users who parked there last week). Instead, it sets an `is_active` boolean to `false` and `deleted_at` to the current timestamp. The dashboard query must be updated to filter out these "soft deleted" items so Mr. Rahman sees a clean list, while the database admin retains the data for integrity.

* **CRUD Actions:** Create (Spot), Read (Owner's Spots), Update (Price), Delete (Soft).
* **Routes:** `/provider/dashboard`, `/provider/edit/[id]`.
* **Data Model:** `parking_spots` (id, owner_id, price, is_active, deleted_at).

### Feature 2.2: The Booking Engine

**User Story: The Desperate Driver**

> Tahmid is driving to a meeting and needs parking for 2 hours. He searches "Dhanmondi" and finds a spot. He sees "3 spots left." He taps "Book Now." Just as he taps it, someone else might be booking the last spot. He waits a tense second. The screen transitions to a green "Success" page with a QR code. He breathes a sigh of relief. If he had been too slow, he expects the app to tell him, "Sorry, this spot was just taken," so he doesn't drive there for nothing.

**System Requirement Story**

> This is the most critical logic in the system. When Tahmid clicks "Book," the server enters a high-stakes Transaction. It cannot simply insert a booking; it must first lock the database rows for that parking spot.
> Inside this locked transaction, the system recalculates availability: `Total Capacity` minus `Active Bookings overlapping Tahmid's requested time`.
>
> * **Scenario A (Success):** If the result is greater than 0, the system inserts the booking, commits the transaction, and returns a success object containing a QR code string (a hash of the booking ID).
> * **Scenario B (Race Condition):** If the result is 0 (someone booked milliseconds before), the system must rollback the transaction and return a specific `409 Conflict` error. The UI must catch this error and display a Toast message: *"High demand! This spot just sold out."*
>
>
> This prevents "Double Booking," which is the worst possible user experience for a parking app.

* **CRUD Actions:** Read (Availability Search), Create (Transactional Booking).
* **Routes:** `/parking/search`, `/parking/book/[id]`.
* **Data Model:** `bookings` (id, user_id, spot_id, start_time, end_time, qr_code_hash).

---

## Module 3: Vehicle Services

### Feature 3.1: Service Request & Dispatch

**User Story: The Stranded & The Savior**

> **Requester:** Naila has a flat tire on the highway at night. She requests "Roadside Assistance." She sees a radar animation: "Searching for mechanics..." She feels anxious but reassured that the app is working.
> **Provider:** Karim, a mechanic, is at his shop. His phone pings. He sees a new job card: "Flat Tire - 2km away." He taps "Accept."
> **Result:** Naila's phone vibrates. The radar stops. She sees: "Karim is on his way" and his phone number appears.

**System Requirement Story**

> The system treats this as a state-machine workflow.
>
> 1. **Creation:** When Naila submits, a `service_request` is created with status `PENDING`.
> 2. **Broadcasting:** The Provider Dashboard does not fetch *all* jobs. It performs a geospatial query to only fetch `PENDING` jobs within 5km of the Provider's current coordinates.
> 3. **The Handshake:** When Karim taps "Accept," the server must perform an atomic check. It verifies the job is *still* `PENDING`. If another mechanic accepted it 1 second ago, Karim gets an error: "Job already taken." If he is first, the status updates to `ACCEPTED`, and `provider_id` is set to Karim.
> 4. **Live Updates:** The frontend uses "Polling" (re-fetching data every 10 seconds) or Server-Sent Events (SSE) to update Naila's screen from "Searching" to "Found."
>
>

* **CRUD Actions:** Create (Request), Read (Geo-filtered Feed), Update (Accept Job).
* **Routes:** `/services/request`, `/provider/jobs`.
* **Data Model:** `service_requests` (id, user_id, provider_id, status, type, lat, lng).

---

## Module 4: Administration

### Feature 4.1: Report Verification Queue

**User Story: The Moderator**

> The Admin, Kamal, sits down with his morning coffee to clean up the map. He opens the "Verification" page. He sees a list of 20 reported "Roadblocks." He selects five that look like duplicates or spam (no photo, vague text) and clicks "Reject." They vanish. He sees one with a clear photo of a fallen tree. He clicks "Verify." The marker on the public map turns from yellow to red, signaling it is now official.

**System Requirement Story**

> The admin interface is designed for speed (bulk actions). The view defaults to filtering `incidents` where `is_verified` is `false`.
> When Kamal selects multiple items, the system captures their IDs in an array. The "Reject" action triggers a `DELETE` (or soft delete) query for that array. The "Verify" action triggers an `UPDATE` query setting `is_verified = true`.
> Crucially, the system must provide **"Undo" functionality**. If Kamal accidentally rejects a real report, a notification bar persists at the bottom for 10 seconds: *"5 Reports Rejected. [Undo]"*. Clicking Undo reverses the database transaction, restoring the items. This safety net reduces admin stress.

* **CRUD Actions:** Read (Filtered List), Update (Bulk Verify), Delete (Bulk Reject).
* **Routes:** `/admin/reports`.

### Feature 4.2: Analytics & Insights

**User Story: The City Planner**

> The Admin wants to know: "Which intersection is the worst on Monday mornings?" He navigates to Analytics. He doesn't want to wait 20 seconds for the page to load. He sees a bar chart instantly. It shows "Gulshan 2" has the highest reports between 8 AM and 10 AM.

**System Requirement Story**

> Calculating these insights requires scanning the entire `traffic_reports` history, which is slow. To meet the user's need for speed, the system cannot run this calculation live every time the page opens.
> The system must use a **Caching Strategy**. When the first admin loads the page, the system runs the heavy SQL query (`GROUP BY location, hour`). It saves this result in a cache (like Redis or in-memory) for 1 hour. When the next admin loads the page 5 minutes later, the system serves the cached JSON instantly. The UI must render "Skeleton" boxes (gray placeholders) while data is fetching, preventing the layout from jumping around.

* **CRUD Actions:** Read (Aggregated Data).
* **Routes:** `/admin/analytics`.

---

**Would you like me to proceed with creating the project folder structure and the Drizzle Schema based on these detailed stories?**
