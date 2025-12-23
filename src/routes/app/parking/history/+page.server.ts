
import { eq, desc, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { drizzle, schema: { bookings, parkingSpots } } }) => {
    // Mock User ID (Replace with locals.user.id in real auth)
    const currentUserId = 1;

    try {
        const history = await drizzle.select({
            id: bookings.id,
            startTime: bookings.startTime,
            endTime: bookings.endTime,
            status: bookings.status,
            // Join fields from Parking Spot
            spotName: parkingSpots.name,
            address: parkingSpots.address,
            pricePerHour: parkingSpots.pricePerHour
        })
            .from(bookings)
            .innerJoin(parkingSpots, eq(bookings.parkingSpotId, parkingSpots.id))
            .where(eq(bookings.userId, currentUserId))
            .orderBy(desc(bookings.startTime));

        return { history };
    } catch (err) {
        console.error(err);
        return { history: [] };
    }
};

export const actions = {
    cancel: async ({ request, locals: { drizzle, schema: { bookings } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        if (!id) return fail(400, { message: "Invalid ID" });

        try {
            // Only cancel if it's currently confirmed
            await drizzle.update(bookings)
                .set({ status: 'cancelled' })
                .where(and(eq(bookings.id, id), eq(bookings.status, 'confirmed')));

            return { success: true, message: "Booking cancelled successfully." };
        } catch (err) {
            return fail(500, { message: "Could not cancel booking." });
        }
    }
};