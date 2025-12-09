import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

    await prisma.serviceProvider.deleteMany();

    const sampleProviders = [
        {
            name: "Dhaka Towing Pro",
            type: "Towing",
            phone: "01711-000000",
            location: "Gulshan",
        },
        {
            name: "Rahim's Mechanics",
            type: "Mechanic",
            phone: "01822-111111",
            location: "Mirpur 10",
        },
        {
            name: "BD Highway Police",
            type: "Hotline",
            phone: "999",
            location: "National",
        },
        {
            name: "City Ambulance",
            type: "Medical",
            phone: "106",
            location: "Dhanmondi",
        },
        {
            name: "Quick Fix Tyre",
            type: "Mechanic",
            phone: "01933-222222",
            location: "Banani",
        },
        // --- 10 NEW ROWS ADDED BELOW ---
        {
            name: "Uttara Emergency Fuel",
            type: "Fuel Delivery",
            phone: "01544-333333",
            location: "Uttara",
        },
        {
            name: "Shyamoli Car Wash & Detailing",
            type: "Car Service",
            phone: "01655-444444",
            location: "Shyamoli",
        },
        {
            name: "Fast Battery Replacement",
            type: "Battery Service",
            phone: "01766-555555",
            location: "Tejgaon",
        },
        {
            name: "Motijheel Traffic Assistance",
            type: "Traffic Help",
            phone: "01877-666666",
            location: "Motijheel",
        },
        {
            name: "New Market Locksmith",
            type: "Locksmith",
            phone: "01988-777777",
            location: "New Market",
        },
        {
            name: "Khilgaon Glass Repair",
            type: "Auto Glass",
            phone: "01799-888888",
            location: "Khilgaon",
        },
        {
            name: "National Fire Service",
            type: "Emergency",
            phone: "999",
            location: "National",
        },
        {
            name: "Bashundhara Diagnostics",
            type: "Medical",
            phone: "01511-999999",
            location: "Bashundhara R/A",
        },
        {
            name: "EPZ Roadside Assistance",
            type: "Towing",
            phone: "01622-000000",
            location: "EPZ Area",
        },
        {
            name: "Savar CNG Refill",
            type: "Fuel Service",
            phone: "01833-111111",
            location: "Savar",
        },
    ];
    // Insert data
    for (const provider of sampleProviders) {
        await prisma.serviceProvider.create({ data: provider });
    }

    console.log("🌱 Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
