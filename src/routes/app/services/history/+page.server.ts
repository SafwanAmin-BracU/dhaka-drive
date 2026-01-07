import { eq, desc, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';

export const load = async ({ locals }) => {
    const currentUserId = requireUser(locals);
    const { drizzle, schema: { serviceAppointments, serviceProviders } } = locals;

    try {
        const appointments = await drizzle.select({
            id: serviceAppointments.id,
            appointmentTime: serviceAppointments.appointmentTime,
            serviceType: serviceAppointments.serviceType,
            status: serviceAppointments.status, // 'confirmed', 'cancelled', 'completed'
            notes: serviceAppointments.notes,
            // Join Provider Details
            providerName: serviceProviders.name,
            providerAddress: serviceProviders.address,
            providerType: serviceProviders.type,
            contactInfo: serviceProviders.contactInfo
        })
            .from(serviceAppointments)
            .innerJoin(serviceProviders, eq(serviceAppointments.providerId, serviceProviders.id))
            .where(eq(serviceAppointments.userId, currentUserId))
            .orderBy(desc(serviceAppointments.appointmentTime));

        return { appointments };
    } catch (err) {
        console.error(err);
        return { appointments: [] };
    }
};

export const actions = {
    // Action to cancel an appointment
    cancel: async ({ request, locals: { drizzle, schema: { serviceAppointments } } }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        if (!id) return fail(400, { message: "Invalid ID" });

        try {
            // Update status to 'cancelled'
            await drizzle.update(serviceAppointments)
                .set({ status: 'cancelled' })
                .where(and(
                    eq(serviceAppointments.id, id),
                    eq(serviceAppointments.status, 'confirmed') // Can only cancel confirmed ones
                ));

            return { success: true, message: "Appointment cancelled successfully." };
        } catch (err) {
            console.error(err);
            return fail(500, { message: "Could not cancel appointment." });
        }
    }
};