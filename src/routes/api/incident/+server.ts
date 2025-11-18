import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function GET() {
    try {

        const incidents = await prisma.incident.findMany();
        return json({
            success: true,
            data: incidents,
            count: incidents.length
        });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}
