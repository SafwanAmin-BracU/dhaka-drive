import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { drizzle, schema: { trafficReports } } }) => {
    return {
        incidents: await drizzle.select().from(trafficReports).orderBy(desc(trafficReports.createdAt))
    };
}) satisfies PageServerLoad;