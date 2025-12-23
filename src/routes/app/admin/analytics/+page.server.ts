import { sql } from 'drizzle-orm';

export const load = async ({ locals: { drizzle, schema: { trafficReports } } }) => {
    try {
        // 1. Status Distribution (Pie Chart Data)
        const statusCounts = await drizzle
            .select({
                status: trafficReports.status,
                count: sql<number>`cast(count(${trafficReports.id}) as int)`
            })
            .from(trafficReports)
            .groupBy(trafficReports.status);

        // 2. Weekly Activity (Bar Chart Data - Last 7 Days)
        // Note: Syntax is PostgreSQL specific (to_char). 
        // If using SQLite/MySQL, date functions will differ slightly.
        const weeklyActivity = await drizzle
            .select({
                date: sql<string>`to_char(${trafficReports.createdAt}, 'Mon DD')`,
                count: sql<number>`cast(count(${trafficReports.id}) as int)`
            })
            .from(trafficReports)
            .groupBy(sql`to_char(${trafficReports.createdAt}, 'Mon DD')`)
            .orderBy(sql`min(${trafficReports.createdAt}) desc`)
            .limit(7);

        // Reverse to show oldest -> newest left-to-right
        return {
            stats: statusCounts,
            activity: weeklyActivity.reverse()
        };

    } catch (err) {
        console.error("Error loading analytics:", err);
        return { stats: [], activity: [] };
    }
};