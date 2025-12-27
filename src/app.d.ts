// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      drizzle: import("$lib/drizzle").dbRef;
      schema: import("$lib/drizzle").schemaRef;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
