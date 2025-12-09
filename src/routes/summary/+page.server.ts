import { prisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const summaries = await prisma.trafficSummary.findMany({
    orderBy: { lastUpdated: 'desc' }
  });

  return { summaries };
};
