
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals: { drizzle, schema: { serviceProviders } } }) => {
    const providerId = parseInt(params.id);

    if (isNaN(providerId)) throw error(404, "Invalid Provider ID");

    // Fetch provider details to display on the booking page
    const result = await drizzle.select().from(serviceProviders).where(eq(serviceProviders.id, providerId));
    const provider = result[0];

    if (!provider) throw error(404, "Service Provider not found");

    return { provider };
};

export const actions = {
    default: async ({ request, params, locals: { drizzle, schema: { serviceAppointments } } }) => {
        const data = await request.formData();
        const providerId = parseInt(params.id);

        // 1. Extract Form Data
        const appointmentTimeStr = data.get('appointmentTime') as string;
        const serviceType = data.get('serviceType') as string;
        const notes = data.get('notes') as string;

        const appointmentTime = new Date(appointmentTimeStr);

        // 2. Validation
        if (isNaN(appointmentTime.getTime())) {
            return fail(400, { message: "Invalid date provided." });
        }
        if (appointmentTime < new Date()) {
            return fail(400, { message: "Cannot schedule appointments in the past." });
        }
        if (!serviceType) {
            return fail(400, { message: "Please select a service type." });
        }

        try {
            // 3. Insert Appointment
            await drizzle.insert(serviceAppointments).values({
                userId: 1, // Mock User ID (Replace with locals.user.id)
                providerId: providerId,
                appointmentTime: appointmentTime,
                serviceType: serviceType,
                notes: notes || '',
                status: 'confirmed'
            });

        } catch (err) {
            console.error(err);
            return fail(500, { message: "Server error. Could not book appointment." });
        }

        // 4. Redirect on success (e.g., to a history page or back to map)
        throw redirect(303, '/services/history');
    }
};