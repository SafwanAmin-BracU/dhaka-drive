import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { useDb } from "$lib/drizzle"; // your drizzle instance
import { env } from "$env/dynamic/private";

const DATABASE_URL = env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("Missing required environment variable: DATABASE_URL");
}

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
    throw new Error("Missing required environment variable: GOOGLE_CLIENT_ID");
}

const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing required environment variable: GOOGLE_CLIENT_SECRET");
}

export const auth = betterAuth({
    database: drizzleAdapter(useDb(DATABASE_URL), {
        provider: "pg",
    }),
    emailAndPassword: { enabled: false },
    socialProviders: {
        google: {
            prompt: 'select_account',
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }
    }
});