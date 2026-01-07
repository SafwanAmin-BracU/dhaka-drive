import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// TODO: Replace with Better Auth session check
export const load = (async () => {
    const isAuthenticated = false;

    // Redirect authenticated users to landing page
    if (isAuthenticated) {
        throw redirect(303, "/");
    }

    return {
        isAuthenticated
    };
}) satisfies PageServerLoad;
