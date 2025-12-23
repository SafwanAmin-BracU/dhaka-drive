import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { drizzle, schema: { parkingSpots } }, depends, url }) => {
    depends('app:parking-available');
    const showAvailableOnly = url.searchParams.get('available') === 'true';
    // Build the query
    let query = drizzle.select({
        id: parkingSpots.id,
        name: parkingSpots.name,
        address: parkingSpots.address,
        totalSlots: parkingSpots.totalSlots,
        isAvailable: parkingSpots.isAvailable,
        pricePerHour: parkingSpots.pricePerHour,
        location: {
            x: sql<number>`ST_X(${parkingSpots.location}::geometry)`,
            y: sql<number>`ST_Y(${parkingSpots.location}::geometry)`
        }
    }).from(parkingSpots);

    if (showAvailableOnly) {
        query.where(sql`${parkingSpots.isAvailable} = true`);
    }

    return {
        spots: await query
    };
}) satisfies PageServerLoad;