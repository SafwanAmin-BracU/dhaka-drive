import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function GET({ url }) {
    try {
        const areaName = url.searchParams.get('area');
        const condition = url.searchParams.get('condition');

        const summaries = await prisma.trafficSummary.findMany({
            where: {

                areaName: areaName?.trim().toLocaleLowerCase() ?? undefined,
                condition: condition ?? undefined,
            },
            orderBy: {
                lastUpdated: 'desc'
            }
        });

        return json({
            success: true,
            data: summaries,
            count: summaries.length
        });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }

}

export async function POST({ request }) {
    try {
        const data = await request.json();



        // Validation
        if (!data.areaName) return json({
            success: false,
            error: 'areaName is required'
        }, { status: 400 });
        if (!data.routeName) return json({
            success: false,
            error: 'routeName is required'
        }, { status: 400 });
        if (!data.condition) return json({
            success: false,
            error: 'condition is required'
        }, { status: 400 });



        const newSummary = await prisma.trafficSummary.create({
            data: {
                areaName: data.areaName.trim().toLocaleLowerCase(),
                routeName: data.routeName.trim().toLocaleLowerCase(),
                condition: data.condition.trim().toLocaleLowerCase(),

            }
        });

        return json({
            success: true,
            message: 'Traffic summary created successfully',
            data: newSummary
        }, { status: 201 });

    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    const data = await request.json();
    const id = data.id;
    if (!id) {
        return json({
            success: false,
            error: 'id is required'
        }, { status: 400 });
    }
    try {
        const result = await prisma.trafficSummary.delete({
            where: { id },

        });

        return json({
            success: true,
            message: `Deleted ${result.id} traffic summaries`
        });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}