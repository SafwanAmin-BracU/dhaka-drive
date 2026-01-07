import type { Handle } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { schema, useDb } from "$lib/drizzle";
import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "$lib/auth";
import { building } from "$app/environment";

const handlers: Handle[] = [
  // Drizzle DB connection handler
  async ({ event, resolve }) => {
    event.locals.drizzle = useDb(env.DATABASE_URL);
    event.locals.schema = schema;

    const response = await resolve(event);
    return response;
  },

  // Better Auth handler
  async ({ event, resolve }) =>
    svelteKitHandler({ event, resolve, auth, building })

];

export const handle = sequence(...handlers);
