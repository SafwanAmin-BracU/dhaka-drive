import {prisma} from '$lib/prisma';

export const load = async () => {
	try {
		const incidents = await prisma.incident.findMany({
			orderBy: { createdAt: 'desc' },
			take: 50
		});

		return { incidents };
	} catch (error) {
		console.error('Database Error:', error);
		return { incidents: [] };
	}
};