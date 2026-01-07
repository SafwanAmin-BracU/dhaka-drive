import { z } from 'zod';

/**
 * Zod schema for validating save/unsave provider input
 */
export const saveProviderSchema = z.object({
	providerId: z.coerce
		.number()
		.int('Provider ID must be an integer')
		.positive('Provider ID must be positive'),
	action: z.enum(['save', 'unsave']).describe('Whether to save or unsave the provider')
});

export type SaveProviderInput = z.infer<typeof saveProviderSchema>;

/**
 * Success response when provider is saved or unsaved
 */
export interface SaveProviderSuccessResponse {
	success: true;
	action: 'save' | 'unsave';
	providerId: number;
	isSaved: boolean;
	message: string;
}

/**
 * Error response when save/unsave operation fails
 */
export interface SaveProviderErrorResponse {
	success: false;
	error: string;
	code: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'NOT_FOUND' | 'SERVER_ERROR';
}

/**
 * Union type for save provider responses
 */
export type SaveProviderResponse = SaveProviderSuccessResponse | SaveProviderErrorResponse;

/**
 * Response for checking if a provider is saved
 */
export interface ProviderSaveStatusResponse {
	isSaved: boolean;
	savedId?: number;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse(
	response: SaveProviderResponse
): response is SaveProviderSuccessResponse {
	return response.success === true;
}

/**
 * Type guard to check if response is error
 */
export function isErrorResponse(
	response: SaveProviderResponse
): response is SaveProviderErrorResponse {
	return response.success === false;
}
