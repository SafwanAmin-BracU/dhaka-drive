import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getRequestById } from '$lib/server/services/queries';
import { approveRequest, updateRequestNotes } from '$lib/server/services/mutations';
import { requireAdmin } from '$lib/server/auth';
import { approveRequestSchema } from '$lib/types/service-request-approval';

export const load: PageServerLoad = async (event) => {
	// Ensure user is admin
	const user = await requireAdmin(event);

	const requestId = parseInt(event.params.id);

	if (isNaN(requestId)) {
		throw error(400, 'Invalid request ID');
	}

	const request = await getRequestById(requestId);

	if (!request) {
		throw error(404, 'Request not found');
	}

	if (request.status !== 'Pending') {
		throw error(400, `Cannot approve a ${request.status.toLowerCase()} request`);
	}

	return { request };
};

export const actions: Actions = {
	default: async (event) => {
		// Ensure user is admin
		const user = await requireAdmin(event);

		const requestId = parseInt(event.params.id);

		if (isNaN(requestId)) {
			throw error(400, 'Invalid request ID');
		}

		const formData = await event.request.formData();
		const notes = formData.get('notes')?.toString() ?? '';

		try {
			// Approve the request
			const result = await approveRequest(requestId, user.id);

			// Update notes if provided
			if (notes.trim()) {
				await updateRequestNotes(requestId, notes);
			}

			// Redirect back to request detail
			throw redirect(303, `/app/admin/requests/${requestId}`);
		} catch (err) {
			if (err instanceof Error) {
				if (err.message.includes('not found')) {
					throw error(404, 'Request not found');
				}
				throw error(500, err.message);
			}
			throw err;
		}
	},
};
