import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';


const DATABASE_URL = process.env.DATABASE_URL as string;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');

const client = neon(DATABASE_URL);
const db = drizzle({ client });