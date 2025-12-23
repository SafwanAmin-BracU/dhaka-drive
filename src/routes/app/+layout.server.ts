import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { drizzle, schema } }) => {

    return {
        incidents: await drizzle.select().from(schema.trafficNews)
    };
}) satisfies LayoutServerLoad;