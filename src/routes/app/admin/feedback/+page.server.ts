import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { drizzle, schema: { userFeedback } } }) => {
    try {
        const messages = await drizzle
            .select()
            .from(userFeedback)
            .orderBy(desc(userFeedback.createdAt));

        return { messages };
    } catch (err) {
        console.error("Error loading feedback:", err);
        return { messages: [] };
    }
};

export const actions = {
    markRead: async ({ request, locals: { drizzle, schema: { userFeedback } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        if (!id) return fail(400, { message: "Invalid ID" });

        try {
            await drizzle.update(userFeedback)
                .set({ isRead: true })
                .where(eq(userFeedback.id, id));
            return { success: true };
        } catch (err) {
            return fail(500, { message: "Error updating status." });
        }
    },

    delete: async ({ request, locals: { drizzle, schema: { userFeedback } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        if (!id) return fail(400, { message: "Invalid ID" });

        try {
            await drizzle.delete(userFeedback).where(eq(userFeedback.id, id));
            return { success: true };
        } catch (err) {
            return fail(500, { message: "Error deleting message." });
        }
    }
};