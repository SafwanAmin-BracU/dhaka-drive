import { usePrisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const prisma = await usePrisma();
  const summaries = await prisma.trafficSummary.findMany({
    orderBy: { lastUpdated: 'desc' }
  });

  return { summaries };
};
