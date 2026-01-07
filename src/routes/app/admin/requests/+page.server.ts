import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPendingRequests, getTotalPendingCount } from '$lib/server/services/queries';
import { requireAdmin } from '$lib/server/auth';
import { APPROVAL_PAGE_SIZE } from '$lib/constants/admin';
import { getPendingRequestsSchema } from '$lib/types/service-request-approval';

export const load: PageServerLoad = async (event) => {
	// Ensure user is admin
	const user = await requireAdmin(event);

	// Get query parameters
	const url = new URL(event.request.url);
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const sortBy = (url.searchParams.get('sortBy') ?? 'submittedAt') as 'submittedAt' | 'serviceType' | 'providerName';
	const sortOrder = (url.searchParams.get('order') ?? 'desc') as 'asc' | 'desc';

	// Validate input
	const validation = getPendingRequestsSchema.safeParse({
		sortBy,
		sortOrder,
		limit: APPROVAL_PAGE_SIZE,
		offset: (page - 1) * APPROVAL_PAGE_SIZE,
	});

	if (!validation.success) {
		throw error(400, 'Invalid query parameters');
	}

	const params = validation.data;

	// Fetch requests and total count in parallel
	const [requests, total] = await Promise.all([
		getPendingRequests(params),
		getTotalPendingCount(),
	]);

	return {
		requests,
		total,
		page,
		pageSize: APPROVAL_PAGE_SIZE,
		sortBy,
		sortOrder,
		totalPages: Math.ceil(total / APPROVAL_PAGE_SIZE),
	};
};
