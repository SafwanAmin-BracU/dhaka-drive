import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function GET({ url }) {
    try {
        const type = url.searchParams.get('type');
        const status = url.searchParams.get('status');
        const location = url.searchParams.get('location');

        const incidents = await prisma.incident.findMany({
            where: {
                type: type ?? undefined,
                status: status ?? undefined,
                location: location ? {
                    contains: location,
                    mode: 'insensitive'
                } : undefined
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

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

export async function POST({ request }) {
    try {
        const data = await request.json();


        if (!data.title) {
            return json({
                success: false,
                error: 'title is required'
            }, { status: 400 });
        }
        if (!data.description) {
            return json({
                success: false,
                error: 'description is required'
            }, { status: 400 });
        }
        if (!data.location) {
            return json({
                success: false,
                error: 'location is required'
            }, { status: 400 });
        }
        if (!data.type) {
            return json({
                success: false,
                error: 'type is required'
            }, { status: 400 });
        }

        const newIncident = await prisma.incident.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                location: data.location,
                latitude: data.latitude ?? null,
                longitude: data.longitude ?? null,
                photoUrl: data.photoUrl ?? null,
                reportedBy: data.reportedBy ?? null,
                status: data.status || 'Active'
            }
        });

        return json({
            success: true,
            message: 'Incident reported successfully',
            data: newIncident
        }, { status: 201 });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    const id = (await request.json()).id;
    if (!id) {
        return json({
            success: false,
            error: 'id is required'
        }, { status: 400 });
    }
    try {
        const result = await prisma.incident.deleteMany({
            where: {
                id
            }
        });

        return json({
            success: true,
            message: `Deleted ${result.count} incidents`
        });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}