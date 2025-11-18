import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function GET({ params }) {
    try {
        console.log('Fetching parking spot with id:', params.id);
        return json({
            success: true,
            data: await prisma.parkingSpot.findMany({
                where: { ownerId: params.id }
            }),
            count: await prisma.parkingSpot.count()
        });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }

}
export async function DELETE({ request }) {
    try {
        const data = await request.json();
        const deletedSpot = await prisma.parkingSpot.delete({
            where: { id: data.id }
        });
        return json({
            success: true,
            message: 'Parking spot deleted successfully',
            data: deletedSpot
        });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }

}

export async function PUT({ params, request }) {
    try {
        const data = await request.json();
        const updatedSpot = await prisma.parkingSpot.update({
            where: { id: data.id },
            data: {
                ownerId: params.id,
                location: data.location,
                address: data.address,
                additionalInfo: data.additionalInfo
            }
        });
        return json({
            success: true,
            message: 'Parking spot updated successfully',
            data: updatedSpot
        });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function POST({ request, params }) {

    try {

        const data = await request.json();
        const ownerId = params.id;
        if (ownerId !== data.ownerId) {
            return json({
                success: false,
                error: 'ownerId in URL does not match ownerId in body'
            }, { status: 400 });
        }
        const location = data.location;
        if (!location) {
            return json({
                success: false,
                error: 'location is required'
            }, { status: 400 });
        }
        const address = data.address;
        if (!address) {
            return json({
                success: false,
                error: 'address is required'
            }, { status: 400 });
        }

        const newSpot = await prisma.parkingSpot.create({
            data: {
                ownerId,
                location,
                address,
                additionalInfo: data.additionalInfo
            }
        });
        return json({
            success: true,
            message: 'Parking spot created successfully',
            data: newSpot
        }, { status: 201 });
    } catch (error) {
        return json({
            success: false,
            error: (error as Error).message
        }, { status: 500 });
    }
}