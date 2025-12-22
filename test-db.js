// test-db.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Turn on LOUD logging
});

async function main() {
  console.log("--- TEST STARTING ---");
  console.log("1. Attempting to connect to NeonDB...");
  
  try {
    // Try to fetch just 1 item
    const results = await prisma.serviceProvider.findMany({ take: 1 });
    console.log("2. SUCCESS! Connection worked.");
    console.log("Data found:", results);
  } catch (error) {
    console.error("3. CRITICAL FAILURE:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();