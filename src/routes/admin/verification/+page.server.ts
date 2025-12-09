// src/routes/admin/verification/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma'; // Assuming you have a prisma client instance

// --- Load Function: Fetch Unverified Incidents ---
export const load: PageServerLoad = async () => {
  try {
    // Fetch incidents with 'Active' status for verification
    const reports = await prisma.incident.findMany({
      where: {
        status: 'Active',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      reports: reports.map(report => ({
        id: report.id,
        title: report.title,
        description: report.description,
        type: report.type,
        location: report.location,
        reportedBy: report.reportedBy ?? 'Anonymous',
        createdAt: report.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Return an empty array or handle error gracefully
    return {
      reports: [],
      error: 'Failed to load reports.',
    };
  }
};

// --- Server Actions: Handle Verification ---
export const actions: Actions = {
  // Action to approve a report
  approve: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');

    if (typeof id !== 'string') {
      return fail(400, { error: 'Invalid report ID provided.' });
    }

    try {
      await prisma.incident.update({
        where: { id },
        data: {
          status: 'Verified', // Update status to Verified
        },
      });
      // Optionally, update the TrafficSummary table based on the approved report
      // (This is a complex business logic step, omitted for simplicity)
      
      return { success: true, action: 'approved', id };
    } catch (error) {
      console.error('Error approving report:', error);
      return fail(500, { error: 'Could not approve report.' });
    }
  },

  // Action to reject a report
  reject: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');
    const reason = data.get('reason'); // Admin might provide a rejection reason

    if (typeof id !== 'string') {
      return fail(400, { error: 'Invalid report ID provided.' });
    }

    try {
      await prisma.incident.update({
        where: { id },
        data: {
          status: 'Rejected', // Update status to Rejected
          // You might add another field to store the rejection reason
        },
      });

      return { success: true, action: 'rejected', id };
    } catch (error) {
      console.error('Error rejecting report:', error);
      return fail(500, { error: 'Could not reject report.' });
    }
  },
};