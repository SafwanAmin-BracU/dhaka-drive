import { json, type RequestHandler } from '@sveltejs/kit';
import { saveProvider, unsaveProvider } from '$lib/server/services/mutations';
import { checkProviderSaveStatus } from '$lib/server/services/queries';
import { saveProviderSchema } from '$lib/types/saved-provider';
import { isErrorResponse } from '$lib/types/saved-provider';

export const POST: RequestHandler = async (event) => {
	try {
		// Authenticate user
		const session = await event.locals.auth.api.getSession({ headers: event.request.headers });
		if (!session?.user?.id) {
			return json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await event.request.json();

		// Validate input
		const validationResult = saveProviderSchema.safeParse(body);
		if (!validationResult.success) {
			return json(
				{
					error: 'Invalid request',
					details: validationResult.error.errors
				},
				{ status: 400 }
			);
		}

		const { providerId, action } = validationResult.data;
		const userId = session.user.id;

		// Execute appropriate action
		let result;
		if (action === 'save') {
			result = await saveProvider(userId, providerId);
		} else if (action === 'unsave') {
			result = await unsaveProvider(userId, providerId);
		} else {
			return json(
				{ error: 'Invalid action' },
				{ status: 400 }
			);
		}

		// Check if result is an error
		if (isErrorResponse(result)) {
			return json(result, { status: 400 });
		}

		// Return success response
		return json(result, { status: 200 });
	} catch (error) {
		console.error('Save provider action error:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};

export const GET: RequestHandler = async (event) => {
	try {
		// Authenticate user
		const session = await event.locals.auth.api.getSession({ headers: event.request.headers });
		if (!session?.user?.id) {
			return json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Get provider ID from URL
		const providerId = event.params.id;
		if (!providerId) {
			return json(
				{ error: 'Provider ID is required' },
				{ status: 400 }
			);
		}

		// Check save status
		const result = await checkProviderSaveStatus(session.user.id, providerId);

		return json(result, { status: 200 });
	} catch (error) {
		console.error('Get provider save status error:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
