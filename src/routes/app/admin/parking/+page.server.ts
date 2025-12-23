import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { drizzle, schema: { parkingSpots } } }) => {
    // Fetch all spots, newest first
    const spots = await drizzle.select().from(parkingSpots).orderBy(desc(parkingSpots.createdAt));
    return { spots };
};

export const actions = {
    // 1. Delete a spot
    deleteSpot: async ({ request, locals: { drizzle, schema: { parkingSpots } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        try {
            await drizzle.delete(parkingSpots).where(eq(parkingSpots.id, id));
            return { success: true, message: "Spot deleted successfully." };
        } catch (err) {
            return fail(500, { message: "Could not delete spot. It might have active bookings." });
        }
    },

    // 2. Update details (Name, Slots, Price, Status)
    updateSpot: async ({ request, locals: { drizzle, schema: { parkingSpots } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);
        const name = data.get('name') as string;
        const address = data.get('address') as string;
        const totalSlots = parseInt(data.get('totalSlots') as string);
        const pricePerHour = parseInt(data.get('pricePerHour') as string);
        const isAvailable = data.get('isAvailable') === 'on'; // Checkbox sends 'on' if checked

        if (!id || !name) return fail(400, { message: "Missing required fields" });

        try {
            await drizzle.update(parkingSpots).set({
                name,
                address,
                totalSlots,
                pricePerHour,
                isAvailable
            }).where(eq(parkingSpots.id, id));

            return { success: true, message: "Spot updated successfully." };
        } catch (err) {
            console.error(err);
            return fail(500, { message: "Update failed." });
        }
    }
};