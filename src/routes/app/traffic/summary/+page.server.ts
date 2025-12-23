import type { PageServerLoad } from './$types';

import { desc, eq, sql } from 'drizzle-orm';

export const load = (async ({ locals: { drizzle, schema: { trafficReports } } }) => {
    try {
        // 1. Get counts for each status (Heavy, Moderate, Clear)
        // We use raw SQL for aggregation for efficiency
        const statusCounts = await drizzle
            .select({
                status: trafficReports.status,
                count: sql<number>`cast(count(${trafficReports.id}) as int)`
            })
            .from(trafficReports)
            .groupBy(trafficReports.status);

        // Convert array to object for easier access in Svelte
        const summary = {
            Heavy: 0,
            Moderate: 0,
            Clear: 0
        };

        statusCounts.forEach(item => {
            if (item.status && item.status in summary) {
                summary[item.status as keyof typeof summary] = item.count;
            }
        });

        // 2. Fetch recent "Heavy" reports for the "Alerts" section
        const recentAlerts = await drizzle
            .select({
                id: trafficReports.id,
                description: trafficReports.description,
                createdAt: trafficReports.createdAt,
                status: trafficReports.status
            })
            .from(trafficReports)
            .where(eq(trafficReports.status, 'Heavy'))
            .orderBy(desc(trafficReports.createdAt))
            .limit(5);

        return { summary, recentAlerts };

    } catch (err) {
        console.error("Error loading traffic summary:", err);
        return {
            summary: { Heavy: 0, Moderate: 0, Clear: 0 },
            recentAlerts: []
        };
    }
}) satisfies PageServerLoad;


