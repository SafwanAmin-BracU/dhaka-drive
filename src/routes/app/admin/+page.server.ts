import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { usePrisma } from '$lib/prisma'; // Adjust path to your prisma client instance

export const load: PageServerLoad = async () => {
  try {
    const prisma = await usePrisma();
    const unverifiedIncidents = await prisma.incident.findMany({
      where: {
        status: 'Active'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      incidents: unverifiedIncidents
    };
  } catch (error) {
    console.error('Failed to load incidents:', error);
    return { incidents: [] };
  }
};

export const actions: Actions = {
  approve: async ({ request }) => {
    const prisma = await usePrisma();
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) return fail(400, { message: 'Incident ID is required' });

    try {
      await prisma.incident.update({
        where: { id },
        data: { status: 'Verified' }
      });
      return { success: true };
    } catch (error) {
      return fail(500, { message: 'Failed to approve incident' });
    }
  },

  reject: async ({ request }) => {
    const prisma = await usePrisma();
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) return fail(400, { message: 'Incident ID is required' });

    try {
      await prisma.incident.update({
        where: { id },
        data: { status: 'Rejected' }
      });
      return { success: true };
    } catch (error) {
      return fail(500, { message: 'Failed to reject incident' });
    }
  }
};