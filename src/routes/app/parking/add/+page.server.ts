
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, locals: { drizzle, schema: { parkingSpots }, user } }) => {
        const data = await request.formData();

        const name = data.get('name') as string;
        const address = data.get('address') as string;
        const totalSlots = parseInt(data.get('totalSlots') as string);
        const pricePerHour = parseInt(data.get('pricePerHour') as string);
        const lat = parseFloat(data.get('lat') as string);
        const lng = parseFloat(data.get('lng') as string);

        if (!name || !address || isNaN(totalSlots) || isNaN(lat) || isNaN(lng)) {
            return fail(400, { missing: true, message: "Please fill in all fields and pin a location." });
        }

        if (!user?.id) {
            return fail(401, { message: "User not authenticated." });
        }

        try {
            await drizzle.insert(parkingSpots).values({
                name,
                address,
                totalSlots,
                pricePerHour, // Optional field
                isAvailable: true, // Default to open
                location: { x: lng, y: lat },
                ownerId: user.id // Use authenticated user's ID
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: "Database error. Could not add spot." });
        }

        // Redirect to the listing page on success
        throw redirect(303, '/app/parking/available');
    }
} satisfies Actions;