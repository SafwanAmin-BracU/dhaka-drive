import { prisma } from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {


    return {
        parkingSpots: await prisma.parkingSpot.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                address: true,
                location: true,
                ownerId: true,
            }
        }),
    };

};

export const actions: Actions = {
    createSpot: async ({ request }) => {
        const data = await request.formData();

        const ownerId = data.get("ownerId")?.toString();
        const address = data.get("address")?.toString();
        const location = data.get("location")?.toString();
        const slots = data.get("slots")?.toString();
        const additionalInfo = data.get("additionalInfo")?.toString();

        if (!ownerId || !address || !location) {
            return fail(400, {
                ownerId, address, location,
                slots, additionalInfo,
                error: "Owner ID, Address, and Location are required fields."
            });
        }

        try {
            const finalInfo = `Slots: ${slots || 'N/A'}. ${additionalInfo || ''}`.trim();

            await prisma.parkingSpot.create({
                data: {
                    ownerId,
                    address,
                    location,
                    additionalInfo: finalInfo,
                }
            });

            return {
                success: true,
                message: "Parking Spot added successfully!"
            };

        } catch (error) {
            console.error("Error creating parking spot:", error);
            return fail(500, {
                ownerId, address, location,
                slots, additionalInfo,
                error: "A database error occurred while creating the spot."
            });
        }
    },
};