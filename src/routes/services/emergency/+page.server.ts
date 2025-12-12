import { usePrisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const prisma = await usePrisma();
    const providers = await prisma.serviceProvider.findMany({
        orderBy: { name: 'asc' }
    });
    return { providers };
}) satisfies PageServerLoad;