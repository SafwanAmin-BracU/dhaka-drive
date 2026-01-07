import { and, eq } from 'drizzle-orm';
import { db } from '$lib/drizzle';
import { savedProviders, serviceRequests } from '$lib/drizzle/schema';
import type {
	ApprovalResponse,
	RejectionResponse,
} from '$lib/types/service-request-approval';
import {
	sendApprovalNotification,
	sendRejectionNotification,
	sendProviderApprovalNotification,
} from './notifications';

/**
 * Save a provider to user's saved list
 * Uses onConflictDoNothing for idempotency
 * @param userId - The user's ID
 * @param providerId - The provider's ID
 * @returns The created saved provider record or null if already existed
 */
export async function saveProvider(userId: string, providerId: number) {
	const result = await db
		.insert(savedProviders)
		.values({
			userId,
			providerId
		})
		.onConflictDoNothing()
		.returning();

	return result[0] || null;
}

/**
 * Unsave a provider from user's saved list
 * Idempotent - returns null if provider was not saved
 * @param userId - The user's ID
 * @param providerId - The provider's ID
 * @returns The deleted record's ID or null if nothing was deleted
 */
export async function unsaveProvider(userId: string, providerId: number) {
	const result = await db
		.delete(savedProviders)
		.where(
			and(
				eq(savedProviders.userId, userId),
				eq(savedProviders.providerId, providerId)
			)
		)
		.returning({ id: savedProviders.id });

	return result[0] || null;
}

/**
 * Approve a pending service request
 * @param requestId - The request ID to approve
 * @param adminId - The ID of the admin approving the request
 * @returns Approval response with updated request details
 */
export async function approveRequest(
	requestId: number,
	adminId: string
): Promise<ApprovalResponse> {
	const now = new Date();

	// Get the request before updating (to send notifications)
	const requestBefore = await db
		.select()
		.from(serviceRequests)
		.where(eq(serviceRequests.id, requestId));

	if (requestBefore.length === 0) {
		throw new Error(`Request ${requestId} not found`);
	}

	const request = requestBefore[0];

	// Update request to Approved status
	const updated = await db
		.update(serviceRequests)
		.set({
			status: 'Approved',
			approvedAt: now,
			approvedByAdminId: adminId,
		})
		.where(eq(serviceRequests.id, requestId))
		.returning();

	if (updated.length === 0) {
		throw new Error(`Failed to approve request ${requestId}`);
	}

	// Send notifications
	await sendApprovalNotification(request.userId, {
		requestId,
		issueDescription: request.issueDescription,
	});

	if (request.providerId) {
		await sendProviderApprovalNotification(request.providerId, {
			requestId,
			issueDescription: request.issueDescription,
		});
	}

	return {
		success: true,
		requestId,
		status: 'Approved',
		approvedAt: now.toISOString(),
		message: 'Request approved successfully',
	};
}

/**
 * Reject a pending service request
 * @param requestId - The request ID to reject
 * @param rejectionReason - The reason for rejection
 * @param adminId - The ID of the admin rejecting the request
 * @returns Rejection response with updated request details
 */
export async function rejectRequest(
	requestId: number,
	rejectionReason: string,
	adminId: string
): Promise<RejectionResponse> {
	const now = new Date();

	// Get the request before updating (to send notifications)
	const requestBefore = await db
		.select()
		.from(serviceRequests)
		.where(eq(serviceRequests.id, requestId));

	if (requestBefore.length === 0) {
		throw new Error(`Request ${requestId} not found`);
	}

	const request = requestBefore[0];

	// Update request to Rejected status
	const updated = await db
		.update(serviceRequests)
		.set({
			status: 'Rejected',
			rejectedAt: now,
			rejectionReason,
			approvedByAdminId: adminId, // Track which admin rejected
		})
		.where(eq(serviceRequests.id, requestId))
		.returning();

	if (updated.length === 0) {
		throw new Error(`Failed to reject request ${requestId}`);
	}

	// Send rejection notification to user
	await sendRejectionNotification(request.userId, requestId, rejectionReason);

	return {
		success: true,
		requestId,
		status: 'Rejected',
		rejectionReason,
		rejectedAt: now.toISOString(),
		message: 'Request rejected successfully',
	};
}

/**
 * Update request notes (admin can add notes at any time)
 * @param requestId - The request ID to update
 * @param notes - Notes to add/update
 * @returns Updated request notes
 */
export async function updateRequestNotes(requestId: number, notes: string): Promise<string> {
	const updated = await db
		.update(serviceRequests)
		.set({ notes })
		.where(eq(serviceRequests.id, requestId))
		.returning({ notes: serviceRequests.notes });

	if (updated.length === 0) {
		throw new Error(`Request ${requestId} not found`);
	}

	return updated[0].notes || '';
}
