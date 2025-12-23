import { useDb, schema } from "./src/lib/drizzle";
import 'dotenv/config';

const { bookings, parkingSpots, serviceRequests, savedProviders, trafficReports, trafficNews, serviceProviders } = schema;

async function main() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');

    const db = useDb(DATABASE_URL);




    console.log('🌱 Starting Seed...');

    // --- Clear existing data (optional, be careful in prod!) ---
    await db.delete(serviceRequests);
    await db.delete(bookings);
    await db.delete(savedProviders);
    await db.delete(trafficReports);
    await db.delete(trafficNews);
    await db.delete(parkingSpots);
    await db.delete(serviceProviders);

    const dhakaLocations = [
        { area: 'Gulshan 1', x: 90.4168, y: 23.7786 },
        { area: 'Gulshan 2', x: 90.4138, y: 23.7937 },
        { area: 'Banani', x: 90.4043, y: 23.7937 },
        { area: 'Dhanmondi 27', x: 90.3752, y: 23.7461 },
        { area: 'Dhanmondi 32', x: 90.3770, y: 23.7520 },
        { area: 'Mirpur 10', x: 90.3685, y: 23.8070 },
        { area: 'Mirpur 12', x: 90.3630, y: 23.8240 },
        { area: 'Uttara Sec 4', x: 90.3984, y: 23.8728 },
        { area: 'Uttara Sec 13', x: 90.3830, y: 23.8680 },
        { area: 'Motijheel', x: 90.4172, y: 23.7330 },
        { area: 'Farmgate', x: 90.3872, y: 23.7561 },
        { area: 'Mohakhali', x: 90.4001, y: 23.7778 },
        { area: 'Bashundhara R/A', x: 90.4255, y: 23.8151 },
        { area: 'Moghbazar', x: 90.4030, y: 23.7480 },
        { area: 'Shahbag', x: 90.3980, y: 23.7390 },
    ];

    // Helper to pick a random item from an array
    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    // Helper to add small random variation to coordinates (so they don't stack)
    const jitter = (coord: number) => coord + (Math.random() - 0.5) * 0.005;


    console.log('🌱 Starting Bulk Seed...');

    // --- 1. Traffic Reports (20 Rows) ---
    console.log('...Generating Traffic Reports');
    const reportDescriptions = [
        'Construction work blocking left lane', 'VIP movement detected', 'Rickshaw congestion',
        'Waterlogging due to rain', 'Accident involving two buses', 'Signal malfunction',
        'Smooth traffic flow', 'Heavy truck breakdown', 'Protest processing', 'Road repair work'
    ];

    const reportsData = Array.from({ length: 20 }).map((_, i) => {
        const loc = pick(dhakaLocations);
        return {
            status: pick(['Heavy', 'Moderate', 'Clear'] as const),
            description: `${pick(reportDescriptions)} near ${loc.area}`,
            location: { x: jitter(loc.x), y: jitter(loc.y) },
            isVerified: Math.random() > 0.5,
            userId: Math.floor(Math.random() * 100) + 1,
        };
    });
    await db.insert(trafficReports).values(reportsData);


    // --- 2. Traffic News (20 Rows) ---
    console.log('...Generating Traffic News');
    const newsSources = ['DMP Traffic', 'Daily Star', 'Prothom Alo', 'Dhaka Tribune', 'Traffic Alert Group'];
    const newsData = Array.from({ length: 20 }).map((_, i) => ({
        title: `Traffic Update #${i + 1}: ${pick(['Road Closure', 'Diversion', 'New Rules', 'Maintenance'])}`,
        content: `Authorities have announced updates regarding traffic flow in ${pick(dhakaLocations).area}. Please plan accordingly.`,
        source: pick(newsSources),
        publishedAt: new Date(),
    }));
    await db.insert(trafficNews).values(newsData);


    // --- 3. Parking Spots (20 Rows) ---
    console.log('...Generating Parking Spots');
    const parkingNames = ['City Center Parking', 'Shopping Mall Basement', 'General Hospital Parking', 'Tower Guest Parking', 'Market Plaza Parking'];

    const spotsData = Array.from({ length: 20 }).map((_, i) => {
        const loc = pick(dhakaLocations);
        return {
            name: `${loc.area} ${pick(parkingNames)}`,
            address: `${loc.area}, Dhaka`,
            totalSlots: Math.floor(Math.random() * 100) + 10,
            isAvailable: Math.random() > 0.2, // 80% chance available
            pricePerHour: Math.floor(Math.random() * 80) + 20,
            location: { x: jitter(loc.x), y: jitter(loc.y) },
            ownerId: Math.floor(Math.random() * 50) + 1,
        };
    });
    // Return IDs for linking
    const insertedSpots = await db.insert(parkingSpots).values(spotsData).returning({ id: parkingSpots.id });


    // --- 4. Service Providers (20 Rows) ---
    console.log('...Generating Service Providers');
    const providerNames = ['Bhai Bhai', 'Trusty', 'Dhaka Fast', 'Express', 'City', 'Reliable', 'Master', 'Quick Fix'];

    const providersData = Array.from({ length: 20 }).map((_, i) => {
        const loc = pick(dhakaLocations);
        const type = pick(['Mechanic', 'Towing', 'CarWash', 'Emergency', 'Fuel'] as const);
        return {
            name: `${pick(providerNames)} ${type} Services`,
            type: type,
            contactInfo: `01${Math.floor(Math.random() * 900000000 + 100000000)}`,
            address: `Shop ${i + 1}, ${loc.area}`,
            location: { x: jitter(loc.x), y: jitter(loc.y) },
            rating: Math.floor(Math.random() * 5) + 1,
        };
    });
    // Return IDs for linking
    const insertedProviders = await db.insert(serviceProviders).values(providersData).returning({ id: serviceProviders.id });


    // --- 5. Bookings (20 Rows) ---
    console.log('...Generating Bookings');
    const bookingsData = Array.from({ length: 20 }).map((_, i) => {
        const spot = pick(insertedSpots);
        return {
            userId: Math.floor(Math.random() * 50) + 1,
            parkingSpotId: spot.id,
            startTime: new Date(),
            endTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 2), // 2 hours later
            status: pick(['confirmed', 'completed', 'cancelled']),
        };
    });
    await db.insert(bookings).values(bookingsData);


    // --- 6. Service Requests (20 Rows) ---
    console.log('...Generating Service Requests');
    const issues = ['Flat Tire', 'Engine Smoke', 'Battery Dead', 'Out of Fuel', 'Brake Failure', 'Car Wash Needed'];

    const requestsData = Array.from({ length: 20 }).map((_, i) => {
        const provider = pick(insertedProviders);
        const loc = pick(dhakaLocations);
        return {
            userId: Math.floor(Math.random() * 50) + 1,
            providerId: provider.id,
            issueDescription: pick(issues),
            status: pick(['Pending', 'Accepted', 'Completed', 'Cancelled'] as const),
            userLocation: { x: jitter(loc.x), y: jitter(loc.y) },
        };
    });
    await db.insert(serviceRequests).values(requestsData);


    // --- 7. Saved Providers (20 Rows) ---
    console.log('...Generating Saved Providers');
    const savedData = Array.from({ length: 20 }).map((_, i) => ({
        userId: Math.floor(Math.random() * 10) + 1, // Simulate fewer users saving many items
        providerId: pick(insertedProviders).id,
    }));
    await db.insert(savedProviders).values(savedData);

    console.log('✅ Bulk Seeding Complete!');
    process.exit(0);

}


main().catch((err) => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});