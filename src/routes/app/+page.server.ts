import type { PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';
import { getUser } from '$lib/server/auth';

export const load = (async ({ locals, parent }) => {
    const { drizzle, schema } = locals;
    const { bookings, parkingSpots, serviceRequests, serviceProviders } = schema;

    // Get parent layout data (includes incidents)
    const parentData = await parent();

    // Get current user (optional - dashboard works for guests too)
    const user = getUser(locals);

    // Fetch user's recent bookings (if logged in)
    let recentBookings: Array<{
        id: number;
        spotName: string | null;
        startTime: Date;
        status: string | null;
    }> = [];

    // Fetch user's recent service requests (if logged in)
    let recentServiceRequests: Array<{
        id: number;
        providerName: string | null;
        status: string | null;
        createdAt: Date | null;
    }> = [];

    if (user) {
        try {
            // Recent parking bookings
            recentBookings = await drizzle
                .select({
                    id: bookings.id,
                    spotName: parkingSpots.name,
                    startTime: bookings.startTime,
                    status: bookings.status,
                })
                .from(bookings)
                .leftJoin(parkingSpots, eq(bookings.parkingSpotId, parkingSpots.id))
                .where(eq(bookings.userId, user.id))
                .orderBy(desc(bookings.createdAt))
                .limit(5);

            // Recent service requests
            recentServiceRequests = await drizzle
                .select({
                    id: serviceRequests.id,
                    providerName: serviceProviders.name,
                    status: serviceRequests.status,
                    createdAt: serviceRequests.createdAt,
                })
                .from(serviceRequests)
                .leftJoin(serviceProviders, eq(serviceRequests.providerId, serviceProviders.id))
                .where(eq(serviceRequests.userId, user.id))
                .orderBy(desc(serviceRequests.createdAt))
                .limit(5);
        } catch (err) {
            console.error('Error fetching user activity:', err);
        }
    }

    return {
        incidents: parentData.incidents,
        recentBookings,
        recentServiceRequests,
        isAuthenticated: !!user,
    };
}) satisfies PageServerLoad;