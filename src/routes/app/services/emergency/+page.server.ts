import type { PageServerLoad } from './$types';
import { eq, desc } from 'drizzle-orm';

export const load = (async ({ locals: { drizzle, schema: { serviceProviders } } }) => {
    try {
        const emergencyContacts = await drizzle
            .select()
            .from(serviceProviders)
            .where(eq(serviceProviders.type, 'Emergency'))
            .orderBy(desc(serviceProviders.rating));
        return { emergencyContacts };
    } catch (err) {
        console.error("Error loading emergency contacts:", err);
        return { emergencyContacts: [] };
    }
}) satisfies PageServerLoad;


