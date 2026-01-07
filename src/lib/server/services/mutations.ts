import { and, eq } from 'drizzle-orm';
import { db } from '$lib/drizzle';
import { savedProviders } from '$lib/drizzle/schema';

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
