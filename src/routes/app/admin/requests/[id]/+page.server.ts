import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRequestById } from '$lib/server/services/queries';
import { requireAdmin } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	// Ensure user is admin
	await requireAdmin(event);

	const requestId = parseInt(event.params.id);

	if (isNaN(requestId)) {
		throw error(400, 'Invalid request ID');
	}

	const request = await getRequestById(requestId);

	if (!request) {
		throw error(404, 'Request not found');
	}

	return { request };
};
