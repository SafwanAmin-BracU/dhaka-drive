import { prisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const providers = await prisma.serviceProvider.findMany({
        orderBy: { name: 'asc' }
    });
    return { providers };
}) satisfies PageServerLoad;