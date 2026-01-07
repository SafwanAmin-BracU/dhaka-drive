// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Session, User } from "better-auth/types";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      drizzle: import("$lib/drizzle").dbRef;
      schema: import("$lib/drizzle").schemaRef;
      user: User | null;
      session: Session | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
