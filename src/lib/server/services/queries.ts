import { and, eq, desc, asc } from 'drizzle-orm';
import { db } from '$lib/drizzle';
import { savedProviders, serviceRequests, user, serviceProviders } from '$lib/drizzle/schema';
import type { ProviderSaveStatusResponse } from '$lib/types/saved-provider';
import type { ServiceRequestListItem, ServiceRequestDetail, GetPendingRequestsInput } from '$lib/types/service-request-approval';

/**
 * Check if a provider is saved by a user
 * @param userId - The user's ID
 * @param providerId - The provider's ID
 * @returns Object with isSaved boolean and optional savedId
 */
export async function checkProviderSaveStatus(
	userId: string,
	providerId: number
): Promise<ProviderSaveStatusResponse> {
	const result = await db
		.select({ id: savedProviders.id })
		.from(savedProviders)
		.where(
			and(
				eq(savedProviders.userId, userId),
				eq(savedProviders.providerId, providerId)
			)
		)
		.limit(1);

	return {
		isSaved: result.length > 0,
		savedId: result[0]?.id
	};
}

/**
 * Get pending service requests for admin approval dashboard
 * @param filters - Filtering and sorting options
 * @returns Array of pending requests with user and provider details
 */
export async function getPendingRequests(
	filters: GetPendingRequestsInput
): Promise<ServiceRequestListItem[]> {
	const { sortBy, sortOrder, limit, offset } = filters;

	// Determine sort column
	let orderColumn: any = serviceRequests.createdAt;
	if (sortBy === 'serviceType') {
		orderColumn = serviceRequests.issueDescription;
	}

	const sortFn = sortOrder === 'asc' ? asc : desc;

	const results = await db
		.select({
			id: serviceRequests.id,
			userId: serviceRequests.userId,
			userName: user.name,
			userEmail: user.email,
			serviceType: serviceProviders.type,
			requestedDateTime: serviceRequests.requestedDateTime,
			submittedAt: serviceRequests.createdAt,
			providerName: serviceProviders.name,
			providerType: serviceProviders.type,
			notes: serviceRequests.notes,
			status: serviceRequests.status,
		})
		.from(serviceRequests)
		.innerJoin(user, eq(serviceRequests.userId, user.id))
		.leftJoin(serviceProviders, eq(serviceRequests.providerId, serviceProviders.id))
		.where(eq(serviceRequests.status, 'Pending'))
		.orderBy(sortFn(orderColumn))
		.limit(limit)
		.offset(offset);

	return results;
}

/**
 * Get total count of pending requests
 * @returns Total number of pending requests
 */
export async function getTotalPendingCount(): Promise<number> {
	const result = await db
		.select({ count: serviceRequests.id })
		.from(serviceRequests)
		.where(eq(serviceRequests.status, 'Pending'));

	return result.length;
}

/**
 * Get a specific request by ID with full details
 * @param requestId - Request ID to fetch
 * @returns Full request details or null if not found
 */
export async function getRequestById(requestId: number): Promise<ServiceRequestDetail | null> {
	const results = await db
		.select({
			id: serviceRequests.id,
			userId: serviceRequests.userId,
			userName: user.name,
			userEmail: user.email,
			issueDescription: serviceRequests.issueDescription,
			serviceType: serviceProviders.type,
			providerId: serviceRequests.providerId,
			providerName: serviceProviders.name,
			providerType: serviceProviders.type,
			providerContact: serviceProviders.contactInfo,
			providerAddress: serviceProviders.address,
			providerRating: serviceProviders.rating,
			requestedDateTime: serviceRequests.requestedDateTime,
			notes: serviceRequests.notes,
			status: serviceRequests.status,
			submittedAt: serviceRequests.createdAt,
			approvedAt: serviceRequests.approvedAt,
			rejectedAt: serviceRequests.rejectedAt,
			rejectionReason: serviceRequests.rejectionReason,
		})
		.from(serviceRequests)
		.innerJoin(user, eq(serviceRequests.userId, user.id))
		.leftJoin(serviceProviders, eq(serviceRequests.providerId, serviceProviders.id))
		.where(eq(serviceRequests.id, requestId));

	if (results.length === 0) {
		return null;
	}

	// TODO: Check provider availability conflict
	// For now, always false
	const providerAvailabilityConflict = false;

	return {
		...results[0],
		providerAvailabilityConflict,
	} as ServiceRequestDetail;
}
