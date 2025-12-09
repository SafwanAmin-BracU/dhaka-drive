import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

// GET: Fetch all traffic summaries
export const load: PageServerLoad = async () => {
  const summaries = await prisma.trafficSummary.findMany({
    orderBy: { lastUpdated: 'desc' }
  });

  return { summaries };
};

// POST: Actions to update traffic conditions
export const actions: Actions = {
  updateCondition: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id') as string;
    const condition = data.get('condition') as string;
    const severity = parseInt(data.get('severity') as string);
    const description = data.get('description') as string;

    if (!id || !condition) {
      return fail(400, { missing: true });
    }

    try {
      // Update the TrafficSummary record
      // We increment reportCount to show activity
      await prisma.trafficSummary.update({
        where: { id },
        data: {
          condition,
          severity,
          description,
          reportCount: { increment: 1 },
          lastUpdated: new Date() // Force timestamp update
        }
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { error: 'Failed to update traffic data.' });
    }
  }
};