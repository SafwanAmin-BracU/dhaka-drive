
# 🚗 DhakaDrive

## Traffic and Parking Management System**

DhakaDrive is a comprehensive web application designed to simplify city life in Dhaka by integrating real-time traffic updates, parking management, and vehicle assistance services. It connects commuters, parking owners, and service providers in a single unified platform.

## 🛠 Tech Stack

- **Language:** TypeScript / Svelte 5
- **Meta-Framework:** SvelteKit 2.0
- **Database:** PostgreSQL (via Neon)
- **ORM:** Drizzle ORM
- **Styling:** TailwindCSS, DaisyUI
- **Package Manager:** Bun
- **Deployment:** Cloudflare Pages

---

## 🚀 Features

### 🚦 Module 1: Traffic Information & Reporting

- **Area-Based Traffic Summary:** View summarized traffic conditions for major routes based on real-time crowd reports.
- **Crowd-Based Updates:** Users can submit status updates ("Heavy", "Moderate", "Clear") for their current location.
- **Incident Reporting:** Report accidents or roadblocks with descriptions and photos.
- **Traffic News Panel:** Daily updates on road closures and traffic news from verified sources.

### 🅿️ Module 2: Parking Locator & Management

- **Manual Parking Listings:** Parking owners can list spots with address details and slot capacity.
- **Availability Status:** Real-time view of open/occupied spots.
- **Booking System:** Reserve specific parking spots for a set time range.
- **Parking History:** Users can track their past bookings and parking locations.

### 🔧 Module 3: Vehicle Services & Assistance

- **Emergency Directory:** Quick access to nearby towing services, mechanics, and hotlines.
- **Service Request System:** Request roadside help (e.g., flat tire, engine trouble) and match with providers.
- **Maintenance Booking:** Schedule car washes or maintenance at registered workshops.
- **Saved Providers:** Bookmark preferred garages and fuel stations.

### 📊 Module 4: Administration & Analytics

- **Report Verification:** Admins review and approve user-submitted traffic incidents.
- **Parking Dashboard:** Manage, edit, or remove listed parking spots.
- **Traffic Analytics:** Visual charts showing congestion patterns by area and time.
- **User Feedback:** Direct channel for bug reports and user support.

---

## 📦 Installation & Setup

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.

- A [Neon](https://neon.tech/) PostgreSQL database project.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/dhakadrive.git](https://github.com/your-username/dhakadrive.git)
cd dhakadrive

```

### 2. Install Dependencies

```bash
bun install

```

### 3. Environment Setup

Create a `.env` file in the root directory and add your Neon database credentials:

```env
DATABASE_URL="postgres://user:password@ep-cool-project.region.aws.neon.tech/neondb?sslmode=require"

```

### 4. Database Migration

Push your Drizzle schema to the Neon database:

```bash
bun run db:push
```

or if you are using drizzle-kit directly

```bash
bun x drizzle-kit push

```

### 5. Run Development Server

```bash
bun run dev

```

The app will be available at `http://localhost:5173`.

---

## 🗺️ Geo-Spatial Features

This project utilizes **PostGIS** for location-based services (finding nearby parking, mapping traffic incidents).
Ensure your Neon database has the PostGIS extension enabled:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

```

---

## 🔮 Future Enhancements

- **Integrated Payments:** In-app payments for parking and services.
- **AI Recommendations:** Smart suggestions for parking based on user habits.
- **Bangla Language Support:** Localization for broader accessibility.
- **Eco-Ride Estimator:** Fuel-efficient route recommendations and cost calculation.

---

## 👥 Contributors

- **Safwan Amin** - Parking Locator & Management
- **Muntasir Ahmed Shawon** - Traffic Information & Reporting
- **Mahir Jawad Chowdhury** - Vehicle Services & Assistance
- **Tasin Imtiaj** - Administration & Analytics

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
