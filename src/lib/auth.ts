import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { useDb } from "$lib/drizzle"; // your drizzle instance
import { env } from "$env/dynamic/private";
export const auth = betterAuth({
    database: drizzleAdapter(useDb(env.DATABASE_URL), {
        provider: "pg",
    }),
    emailAndPassword: { enabled: false },
    socialProviders: {
        google: {
            prompt: 'select_account',
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        }
    }
});