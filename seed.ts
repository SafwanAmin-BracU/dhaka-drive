import { useDb, schema } from "./src/lib/drizzle";
import { user } from "./src/lib/drizzle/schema";
import "dotenv/config";

// Simple UUID generator helper
const generateId = () => crypto.randomUUID();

const {
  bookings,
  parkingSpots,
  serviceRequests,
  savedProviders,
  trafficReports,
  trafficNews,
  serviceProviders,
  serviceAppointments,
  userFeedback,
} = schema;

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const db = useDb(DATABASE_URL);

  console.log("🌱 Starting Bulk Seed...");

  // --- 1. Clear Existing Data ---
  console.log("...Cleaning old data");
  await db.delete(userFeedback);
  await db.delete(serviceAppointments);
  await db.delete(savedProviders);
  await db.delete(serviceRequests);
  await db.delete(bookings);
  await db.delete(trafficReports);
  await db.delete(trafficNews);
  await db.delete(parkingSpots);
  await db.delete(serviceProviders);
  await db.delete(user);

  // --- Helpers ---
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const jitter = (coord: number) => coord + (Math.random() - 0.5) * 0.01; // Increased jitter slightly
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const dhakaLocations = [
    { area: "Gulshan 1", x: 90.4168, y: 23.7786 },
    { area: "Gulshan 2", x: 90.4138, y: 23.7937 },
    { area: "Banani", x: 90.4043, y: 23.7937 },
    { area: "Dhanmondi 27", x: 90.3752, y: 23.7461 },
    { area: "Dhanmondi 32", x: 90.377, y: 23.752 },
    { area: "Mirpur 10", x: 90.3685, y: 23.807 },
    { area: "Mirpur 12", x: 90.363, y: 23.824 },
    { area: "Uttara Sec 4", x: 90.3984, y: 23.8728 },
    { area: "Uttara Sec 13", x: 90.383, y: 23.868 },
    { area: "Motijheel", x: 90.4172, y: 23.733 },
    { area: "Farmgate", x: 90.3872, y: 23.7561 },
    { area: "Mohakhali", x: 90.4001, y: 23.7778 },
    { area: "Bashundhara R/A", x: 90.4255, y: 23.8151 },
    { area: "Moghbazar", x: 90.403, y: 23.748 },
    { area: "Shahbag", x: 90.398, y: 23.739 },
    { area: "Badda", x: 90.4226, y: 23.7805 },
    { area: "Rampura", x: 90.4152, y: 23.7612 },
    { area: "Khilgaon", x: 90.4289, y: 23.7505 },
    { area: "Lalbagh", x: 90.3888, y: 23.7215 },
    { area: "Tejgaon", x: 90.3994, y: 23.7639 },
  ];

  // --- 2. Create Users (50 Users) ---
  console.log("...Generating Users");

  const firstNames = ["Rahim", "Karim", "Nusrat", "Tanvir", "Farhana", "Kamal", "Sadia", "Rafiq", "Tasnim", "Imran", "Ayesha", "Bilal", "Celine", "Danish", "Esha", "Fahad", "Gazi", "Hassan", "Ishrat", "Jamil"];
  const lastNames = ["Ahmed", "Uddin", "Jahan", "Hasan", "Akter", "Hossain", "Islam", "Begum", "Khan", "Chowdhury", "Rahman", "Siddique", "Ali", "Mia", "Sarkar", "Bhuiyan", "Mahmud", "Sheikh", "Majumdar", "Talukder"];

  const usersData: any[] = [];
  for (let i = 0; i < 50; i++) {
    const fn = pick(firstNames);
    const ln = pick(lastNames);
    usersData.push({
      id: generateId(),
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}.${i}@example.com`, // Ensure unique emails
      emailVerified: true,
      image: `https://i.pravatar.cc/150?u=${i}`,
    });
  }

  const insertedUsers = await db.insert(user).values(usersData).returning({ id: user.id });
  const pickUser = () => pick(insertedUsers).id;


  // --- 3. Traffic News (50 Rows) ---
  console.log("...Generating Traffic News");
  const newsSources = ["DMP Traffic", "Daily Star", "Prothom Alo", "Dhaka Tribune", "Traffic Alert Group", "BD News 24"];
  const newsData = Array.from({ length: 50 }).map((_, i) => ({
    title: `Traffic Alert: ${pick(["Road Closure", "Diversion", "New Rules", "VIP Movement", "Construction Update"])} at ${pick(dhakaLocations).area}`,
    content: `Due to ${pick(["ongoing maintenance", "heavy rain", "political rally", "VIP convoy", "accident"])}, traffic flow is disrupted. Please use alternate routes.`,
    source: pick(newsSources),
    publishedAt: new Date(Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000), // Past 7 days
  }));
  await db.insert(trafficNews).values(newsData);


  // --- 4. Traffic Reports (100 Rows) ---
  console.log("...Generating Traffic Reports");
  const reportDescriptions = [
    "Severe gridlock due to signal failure",
    "Minor accident causing slowdowns",
    "Waterlogging making road impassable",
    "Construction materials blocking lane",
    "Stalled bus in the middle of the road",
    "Smooth sailing, no traffic",
    "Police checkpost causing delays",
    "Rickshaw jam at intersection",
  ];

  const reportsData = Array.from({ length: 100 }).map(() => {
    const loc = pick(dhakaLocations);
    return {
      userId: pickUser(),
      status: pick(["Heavy", "Moderate", "Clear"] as const),
      description: pick(reportDescriptions),
      location: { x: jitter(loc.x), y: jitter(loc.y) },
      isVerified: Math.random() > 0.7,
      createdAt: new Date(Date.now() - randomInt(0, 24) * 60 * 60 * 1000), // Past 24 hours
    };
  });
  await db.insert(trafficReports).values(reportsData);


  // --- 5. Parking Spots (50 Rows) ---
  console.log("...Generating Parking Spots");
  const parkingTypes = ["Plaza", "Basement", "Open Lot", "Garage", "Tower"];

  const spotsData = Array.from({ length: 50 }).map(() => {
    const loc = pick(dhakaLocations);
    return {
      ownerId: pickUser(),
      name: `${loc.area} ${pick(parkingTypes)}`,
      address: `Road ${randomInt(1, 120)}, ${loc.area}, Dhaka`,
      totalSlots: randomInt(5, 50),
      isAvailable: Math.random() > 0.3,
      pricePerHour: randomInt(20, 100),
      location: { x: jitter(loc.x), y: jitter(loc.y) },
    };
  });

  const insertedSpots = await db.insert(parkingSpots).values(spotsData).returning({ id: parkingSpots.id });


  // --- 6. Service Providers (50 Rows) ---
  console.log("...Generating Service Providers");
  const providerNames = ["Rahman Motors", "City Fixers", "Quick Tow", "Dhaka Auto", "Express Wash", "BD Rescue", "Master Mechanics", "Prime Fuel", "Trust Car Care", "Elite Service"];

  const providersData = Array.from({ length: 50 }).map((_, i) => {
    const loc = pick(dhakaLocations);
    const type = pick(["Mechanic", "Towing", "CarWash", "Emergency", "Fuel"] as const);
    return {
      name: `${pick(providerNames)} (${loc.area} Branch)`,
      type: type,
      contactInfo: `017${randomInt(10000000, 99999999)}`,
      address: `Holding ${randomInt(1, 500)}, ${loc.area}`,
      location: { x: jitter(loc.x), y: jitter(loc.y) },
      rating: randomInt(3, 5),
    };
  });

  const insertedProviders = await db.insert(serviceProviders).values(providersData).returning({ id: serviceProviders.id });


  // --- 7. Bookings (100 Rows) ---
  console.log("...Generating Bookings");
  const bookingsData = Array.from({ length: 100 }).map(() => {
    return {
      userId: pickUser(),
      parkingSpotId: pick(insertedSpots).id,
      startTime: new Date(),
      endTime: new Date(Date.now() + randomInt(1, 5) * 60 * 60 * 1000),
      status: pick(["confirmed", "completed", "cancelled"]),
    };
  });
  await db.insert(bookings).values(bookingsData);


  // --- 8. Service Requests (100 Rows) ---
  console.log("...Generating Service Requests");
  const serviceIssues = [
    "Car won't start",
    "Flat tire needs changing",
    "Engine overheating",
    "Need urgent towing",
    "Ran out of gas",
    "Brake failure warning",
    "Windshield cracked",
    "Need full body wash",
  ];

  const requestsData = Array.from({ length: 100 }).map(() => {
    const loc = pick(dhakaLocations);
    return {
      userId: pickUser(),
      providerId: pick(insertedProviders).id,
      issueDescription: pick(serviceIssues),
      status: pick(["Pending", "Accepted", "Completed", "Cancelled"] as const),
      userLocation: { x: jitter(loc.x), y: jitter(loc.y) },
    };
  });
  await db.insert(serviceRequests).values(requestsData);


  // --- 9. Saved Providers (100 Rows) ---
  console.log("...Generating Saved Providers");
  const savedData = Array.from({ length: 100 }).map(() => ({
    userId: pickUser(),
    providerId: pick(insertedProviders).id,
  }));
  await db.insert(savedProviders).values(savedData);


  // --- 10. Service Appointments (100 Rows) ---
  console.log("...Generating Service Appointments");
  const appointmentTypes = ["Oil Change", "General Maintenance", "Full Wash", "Engine Tuning", "Brake Inspection", "AC Repair"];

  const appointmentsData = Array.from({ length: 100 }).map(() => ({
    userId: pickUser(),
    providerId: pick(insertedProviders).id,
    appointmentTime: new Date(Date.now() + randomInt(1, 7) * 24 * 60 * 60 * 1000), // Next 7 days
    serviceType: pick(appointmentTypes),
    notes: "Please call before confirming.",
    status: pick(["confirmed", "pending", "completed"]),
  }));
  await db.insert(serviceAppointments).values(appointmentsData);


  // --- 11. User Feedback (50 Rows) ---
  console.log("...Generating User Feedback");
  const feedbackSubjects = ["App Crash", "Feature Request", "Slow Performance", "Kudos", "Data Issue"];

  const feedbackData = Array.from({ length: 50 }).map(() => {
    const u = usersData[randomInt(0, 49)]; // Pick from local array to get matching name/email
    return {
      userId: pickUser(), // Technically linking a random ID, but likely matches due to volume
      name: u.name,
      email: u.email,
      subject: pick(feedbackSubjects),
      message: "I really enjoy using this app, but I found some issues with the map loading speed.",
      isRead: Math.random() > 0.5,
    };
  });
  await db.insert(userFeedback).values(feedbackData);


  console.log("✅ Bulk Seeding Complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding Failed:", err);
  process.exit(1);
});