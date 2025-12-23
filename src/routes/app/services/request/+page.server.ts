
import { fail } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const load = async ({ locals: { drizzle, schema: { serviceProviders } } }) => {
    // Fetch providers with coordinates extracted for the map
    const providers = await drizzle.select({
        id: serviceProviders.id,
        name: serviceProviders.name,
        type: serviceProviders.type, // 'Mechanic', 'Towing', 'CarWash', 'Emergency', 'Fuel'
        contactInfo: serviceProviders.contactInfo,
        address: serviceProviders.address,
        rating: serviceProviders.rating,
        location: {
            x: sql<number>`ST_X(${serviceProviders.location}::geometry)`,
            y: sql<number>`ST_Y(${serviceProviders.location}::geometry)`
        }
    }).from(serviceProviders);

    return { providers };
};

export const actions = {
    default: async ({ request, locals: { drizzle, schema: { serviceRequests } } }) => {
        const formData = await request.formData();

        // Extract Data
        const providerId = parseInt(formData.get('providerId') as string);
        const issueDescription = formData.get('issueDescription') as string;
        const userLat = parseFloat(formData.get('userLat') as string);
        const userLng = parseFloat(formData.get('userLng') as string);

        // Validation
        if (!providerId || !issueDescription || isNaN(userLat)) {
            return fail(400, { missing: true, message: "Please select a provider and provide your location." });
        }

        try {
            // Create the Service Request
            await drizzle.insert(serviceRequests).values({
                userId: 1, // Mock User ID
                providerId: providerId,
                issueDescription: issueDescription,
                status: 'Pending',
                // Save user's current location so the mechanic knows where to go
                userLocation: { x: userLng, y: userLat }
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: "Server error. Could not send request." });
        }

        return { success: true };
    }
};