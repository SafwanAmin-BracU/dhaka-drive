import { PrismaClient } from '@prisma/client/edge';
import { env } from '$env/dynamic/private';


export const prisma = new PrismaClient({
    datasources: {
        db: {
            url:
                env.DATABASE_URL
        }
    }
});