import {prisma} from '$lib/prisma';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const type = data.get('type')?.toString();
		const location = data.get('location')?.toString(); // [cite: 5]
		const photoUrl = data.get('photoUrl')?.toString(); // [cite: 8]

		if (!title || !description || !type || !location) {
			return fail(400, { missing: true, message: 'All required fields must be filled.' });
		}

		try {
			await prisma.incident.create({
				data: {
					title,
					description,
					type,
					location,
					photoUrl: photoUrl || null,
					status: 'Active'
				}
			});

			return { success: true };
		} catch (error) {
			console.error('Submission Error:', error);
			return fail(500, { error: true, message: 'Failed to report incident.' });
		}
	}
} satisfies Actions;