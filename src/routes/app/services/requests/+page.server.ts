import { eq, desc } from 'drizzle-orm';
import { requireUser } from '$lib/server/auth';

export const load = async ({ locals }) => {
    const currentUserId = requireUser(locals);
    const { drizzle, schema: { serviceRequests, serviceProviders } } = locals;

    try {
        const requestHistory = await drizzle
            .select({
                id: serviceRequests.id,
                issue: serviceRequests.issueDescription,
                status: serviceRequests.status, // Pending, Accepted, Completed, Cancelled
                createdAt: serviceRequests.createdAt,
                // Provider info (might be null if still Pending/Searching)
                providerName: serviceProviders.name,
                providerType: serviceProviders.type,
                contactInfo: serviceProviders.contactInfo
            })
            .from(serviceRequests)
            .leftJoin(serviceProviders, eq(serviceRequests.providerId, serviceProviders.id))
            .where(eq(serviceRequests.userId, currentUserId))
            .orderBy(desc(serviceRequests.createdAt));

        return { requestHistory };
    } catch (err) {
        console.error("Error loading request history:", err);
        return { requestHistory: [] };
    }
};