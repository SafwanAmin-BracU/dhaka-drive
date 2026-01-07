import { redirect, type Handle } from "@sveltejs/kit";

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

  async ({ event, resolve }) => svelteKitHandler({ event, resolve, auth, building }),

  // Better Auth session handler - populate locals.user and locals.session
  async ({ event, resolve }) => {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (session) {
      event.locals.session = session.session;
      event.locals.user = session.user;
    } else {
      event.locals.session = null;
      event.locals.user = null;
      if (event.url.pathname.startsWith("/app")) throw redirect(303, "/auth");
    }

    const response = await resolve(event);
    return response;
  }
];

export const handle = sequence(...handlers);
