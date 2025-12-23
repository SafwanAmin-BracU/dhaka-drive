import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { drizzle, schema: { trafficReports } } }) => {
    // NOTE: In a real app, ensure you check for Admin role here!
    // if (!locals.user?.isAdmin) throw error(403, "Unauthorized");

    try {
        const pendingReports = await drizzle
            .select()
            .from(trafficReports)
            .where(eq(trafficReports.isVerified, false))
            .orderBy(desc(trafficReports.createdAt));

        return { pendingReports };
    } catch (err) {
        console.error("Error loading pending reports:", err);
        return { pendingReports: [] };
    }
};

export const actions = {
    verify: async ({ request, locals: { drizzle, schema: { trafficReports } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        if (!id) return fail(400, { message: "Invalid ID" });

        try {
            await drizzle.update(trafficReports)
                .set({ isVerified: true })
                .where(eq(trafficReports.id, id));

            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { message: "Could not verify report." });
        }
    },

    reject: async ({ request, locals: { drizzle, schema: { trafficReports } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        if (!id) return fail(400, { message: "Invalid ID" });

        try {
            // Rejection currently deletes the report to clean up spam
            await drizzle.delete(trafficReports).where(eq(trafficReports.id, id));

            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { message: "Could not reject report." });
        }
    }
};