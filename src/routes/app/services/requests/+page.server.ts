import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals: { drizzle, schema: { serviceRequests, serviceProviders } } }) => {
    // Mock User ID
    const currentUserId = 1;

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