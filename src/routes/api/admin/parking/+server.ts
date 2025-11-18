import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function GET({ url }) {
    try {

        return json({
            success: true,
            data: await prisma.parkingSpot.findMany(),
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

export async function PUT({ request }) {
    try {
        const data = await request.json();
        const updatedSpot = await prisma.parkingSpot.update({
            where: { id: data.id },
            data: {
                ownerId: data.ownerId,
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