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

/**
 * Requires an authenticated admin user and returns their ID.
 * Throws a redirect to /auth if not authenticated or not an admin.
 * Admin is identified by role === 'admin' in the user object.
 *
 * @param locals - The App.Locals object from the request event
 * @returns The authenticated admin user's ID
 * @throws Redirect to /auth if not authenticated
 * @throws Redirect to /app if authenticated but not admin (403 would be better but SvelteKit recommends redirect)
 */
export function requireAdmin(locals: App.Locals): string {
    if (!locals.user?.id) {
        throw redirect(303, "/auth");
    }

    // Check for admin role
    if (locals.user.role !== 'admin') {
        throw redirect(303, "/app");
    }

    return locals.user.id;
}
