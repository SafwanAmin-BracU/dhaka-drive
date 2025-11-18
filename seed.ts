import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    const SAFWAN_ID = "23101281";
    const OTHER_USER_1 = "10001";
    const OTHER_USER_2 = "10002";

    // Clear previous data
    await prisma.parkingSpot.deleteMany();

    const parkingSpots = [
        // -------- Safwan's Spots --------
        {
            ownerId: SAFWAN_ID,
            address: "Bashundhara R/A, Block C, Dhaka",
            location: "23.8151, 90.4285",
            additionalInfo: "Near NSU gate 6, shaded parking"
        },
        {
            ownerId: SAFWAN_ID,
            address: "Uttara Sector 7, Dhaka",
            location: "23.8740, 90.4003",
            additionalInfo: "Basement parking, 24/7 access"
        },

        // -------- Other User 1 --------
        {
            ownerId: OTHER_USER_1,
            address: "Dhanmondi 27, Dhaka",
            location: "23.7465, 90.3760",
            additionalInfo: "Street-side parking available"
        },
        {
            ownerId: OTHER_USER_1,
            address: "Lalmatia Block D, Dhaka",
            location: "23.7517, 90.3655",
            additionalInfo: "Private garage parking"
        },

        // -------- Other User 2 --------
        {
            ownerId: OTHER_USER_2,
            address: "Banani DOHS, Dhaka",
            location: "23.7987, 90.4066",
            additionalInfo: "Reserved slot under CCTV"
        },
        {
            ownerId: OTHER_USER_2,
            address: "Mirpur 10, Dhaka",
            location: "23.8041, 90.3654",
            additionalInfo: "Open parking, day time only"
        }
    ];

    // Insert data
    for (const spot of parkingSpots) {
        await prisma.parkingSpot.create({ data: spot });
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
