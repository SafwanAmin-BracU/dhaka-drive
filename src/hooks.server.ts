import type { Handle } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
import { schema, useDb } from "$lib/drizzle";
import { sequence } from "@sveltejs/kit/hooks";

const handlers: Handle[] = [
  // Drizzle DB connection handler
  async ({ event, resolve }) => {
    event.locals.drizzle = useDb(env.DATABASE_URL);
    event.locals.schema = schema;

    const response = await resolve(event);
    return response;
  },
];

export const handle = sequence(...handlers);
