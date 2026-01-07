import type { PageServerLoad } from "./$types";

// TODO: Replace with Better Auth session check
export const load = (async () => {
    return {
        isAuthenticated: false
    };
}) satisfies PageServerLoad;
