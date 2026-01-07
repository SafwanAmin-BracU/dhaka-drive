import { and, eq } from 'drizzle-orm';
import { db } from '$lib/drizzle';
import { savedProviders } from '$lib/drizzle/schema';
import type { ProviderSaveStatusResponse } from '$lib/types/saved-provider';

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
