import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getRequestById } from '$lib/server/services/queries';
import { rejectRequest, updateRequestNotes } from '$lib/server/services/mutations';
import { requireAdmin } from '$lib/server/auth';

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
		throw error(400, `Cannot reject a ${request.status.toLowerCase()} request`);
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
		const rejectionReason = formData.get('rejectionReason')?.toString() ?? 'Other';
		const customReason = formData.get('customReason')?.toString() ?? '';

		try {
			// Build the final rejection reason string
			let finalReason = rejectionReason;
			if (rejectionReason === 'Other' && customReason.trim()) {
				finalReason = customReason;
			} else if (rejectionReason === 'Other') {
				throw error(400, 'Please specify a custom rejection reason');
			}

			// Reject the request
			const result = await rejectRequest(requestId, finalReason, user.id);

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
