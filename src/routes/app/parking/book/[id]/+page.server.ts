import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';

export const load = async ({ params, locals: { drizzle, schema: { parkingSpots } } }) => {
    const spotId = parseInt(params.id);

    // Fetch spot details
    const spot = await drizzle.query.parkingSpots.findFirst({
        where: eq(parkingSpots.id, spotId)
    });

    if (!spot) throw error(404, "Parking spot not found");

    return { spot };
};

export const actions = {
    default: async ({ request, params, locals }) => {
        const userId = requireUser(locals);
        const { drizzle, schema: { bookings, parkingSpots } } = locals;
        const data = await request.formData();
        const spotId = parseInt(params.id);

        // 1. Get Form Data
        const startTimeStr = data.get('startTime') as string;
        const endTimeStr = data.get('endTime') as string;

        const start = new Date(startTimeStr);
        const end = new Date(endTimeStr);

        // 2. Basic Validation
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return fail(400, { message: "Invalid dates provided." });
        }
        if (start >= end) {
            return fail(400, { message: "End time must be after start time." });
        }
        if (start < new Date()) {
            return fail(400, { message: "Cannot book in the past." });
        }

        try {
            // 3. Check Availability (Conflict Detection)
            // We count how many active bookings exist that overlap with the requested window.
            // Overlap Logic: (ExistingStart < RequestedEnd) AND (ExistingEnd > RequestedStart)
            const existingBookings = await drizzle.select({ count: sql<number>`count(*)` })
                .from(bookings)
                .where(and(
                    eq(bookings.parkingSpotId, spotId),
                    sql`${bookings.startTime} < ${end.toISOString()}`,
                    sql`${bookings.endTime} > ${start.toISOString()}`
                ));

            const spot = await drizzle.query.parkingSpots.findFirst({
                where: eq(parkingSpots.id, spotId),
                columns: { totalSlots: true }
            });

            const currentOccupancy = Number(existingBookings[0].count);

            if (spot && currentOccupancy >= spot.totalSlots) {
                return fail(400, { message: "Spot is fully booked for this time range." });
            }

            // 4. Create Booking
            await drizzle.insert(bookings).values({
                userId,
                parkingSpotId: spotId,
                startTime: start,
                endTime: end,
                status: 'confirmed'
            });

        } catch (err) {
            console.error(err);
            return fail(500, { message: "Server error during booking." });
        }

        // 5. Redirect to History/Success page
        throw redirect(303, '/app/parking/history');
    }
};