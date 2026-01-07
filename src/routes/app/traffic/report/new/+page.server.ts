import type { Actions, PageServerLoad } from './$types';
import { requireUser } from '$lib/server/auth';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request, locals }) => {
        const userId = requireUser(locals);
        const { drizzle, schema: { trafficReports } } = locals;
        const formData = await request.formData();

        // 1. Extract Data
        const status = formData.get('status') as "Heavy" | "Moderate" | "Clear";
        const description = formData.get('description') as string;
        const latStr = formData.get('lat') as string;
        const lngStr = formData.get('lng') as string;
        const imageFile = formData.get('image') as File;

        // 2. Validation
        if (!status || !latStr || !lngStr) {
            return { success: false, message: 'Please fill in all required fields.' };
        }

        let imageUrl: string | null = null;

        // 3. Handle Image Upload (Basic Local File Save Example)
        // In production, you would upload this to Cloudflare R2 or AWS S3
        if (imageFile && imageFile.size > 0) {
            imageUrl = "https://placehold.co/600x400?text=Uploaded+Image";
        }

        // 4. Insert into Database
        try {
            await drizzle.insert(trafficReports).values({
                status,
                description,
                // Drizzle handles the geometry point object structure automatically
                location: { x: parseFloat(lngStr), y: parseFloat(latStr) },
                imageUrl,
                isVerified: false, // Default to unverified
                userId,
            });
        } catch (err) {
            console.error(err);
            return {
                success: false, message: 'Failed to submit report. Please try again.'
            };

        }
        return { success: true, message: 'Report submitted successfully!' };
    }
} satisfies Actions;