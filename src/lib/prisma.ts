import { env } from '$env/dynamic/private';
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })