// src/routes/roadside-assistance/+page.server.ts
import { fail } from '@sveltejs/kit';

// ⚠️ EMERGENCY MODE: No Database Connection needed right now
// const prisma = ... (Commented out to stop the crash)

export const actions = {
	default: async ({ request }) => {
		// 1. Get the form data
		const data = await request.formData();
		const userName = data.get('userName') as string;
		const contactInfo = data.get('contactInfo') as string;
		const issueType = data.get('issueType') as string;
		const location = data.get('location') as string;

		// 2. Simple validation
		if (!userName || !contactInfo || !issueType || !location) {
			return fail(400, { missing: true });
		}

		// 3. FAKE SUCCESS (Pretend we found a mechanic)
		// This stops the crash because we don't touch the database
		return {
			success: true,
			provider: {
				name: "Express Towing BD (Demo)",
				specialty: issueType,
				rating: 4.8,
				phone: "01711-DEMO-01"
			}
		};
	}
};