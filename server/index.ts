import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/server/schema";

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(sql, { schema, logger: true });
