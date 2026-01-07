import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Action, PageServerLoad } from './$types';
import { requireUser } from '$lib/server/auth';

export const load = (async ({ locals }) => {
    const currentUserId = requireUser(locals);
    const { drizzle, schema: { savedProviders, serviceProviders } } = locals;

    try {
        const savedList = await drizzle
            .select({
                id: savedProviders.id, // The ID of the bookmark itself
                providerId: serviceProviders.id,
                name: serviceProviders.name,
                type: serviceProviders.type,
                address: serviceProviders.address,
                rating: serviceProviders.rating,
                contactInfo: serviceProviders.contactInfo,
                savedAt: savedProviders.createdAt
            })
            .from(savedProviders)
            .innerJoin(serviceProviders, eq(savedProviders.providerId, serviceProviders.id))
            .where(eq(savedProviders.userId, currentUserId))
            .orderBy(desc(savedProviders.createdAt));

        return { savedList };
    } catch (err) {
        console.error("Error loading saved providers:", err);
        return { savedList: [] };
    }
}) satisfies PageServerLoad;



export const actions = {
    delete: async ({ request, locals: { drizzle, schema: { savedProviders } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        if (!id) return fail(400, { message: "Invalid ID" });

        try {
            await drizzle.delete(savedProviders).where(eq(savedProviders.id, id));
            return { success: true, message: "Removed from saved list." };
        } catch (err) {
            return fail(500, { message: "Could not remove provider." });
        }
    }
};