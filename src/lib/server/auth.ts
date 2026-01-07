import { redirect } from "@sveltejs/kit";

/**
 * Requires an authenticated user and returns their ID.
 * Throws a redirect to /auth if no user is authenticated.
 *
 * @param locals - The App.Locals object from the request event
 * @returns The authenticated user's ID
 * @throws Redirect to /auth if not authenticated
 */
export function requireUser(locals: App.Locals): string {
    if (!locals.user?.id) {
        throw redirect(303, "/auth");
    }
    return locals.user.id;
}

/**
 * Gets the current user if authenticated, or null if not.
 * Does not throw - use for optional auth scenarios.
 *
 * @param locals - The App.Locals object from the request event
 * @returns The authenticated user or null
 */
export function getUser(locals: App.Locals) {
    return locals.user ?? null;
}
