import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export const useDb = (connectionString: string) =>
  drizzle({ client: neon(connectionString), schema });
export { schema };

export type dbRef = ReturnType<typeof useDb>;
export type schemaRef = typeof schema;
