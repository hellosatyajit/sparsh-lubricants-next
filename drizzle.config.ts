import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // e.g., "mysql://user:pass@localhost:3306/dbname"
  },
  strict: false, // useful for compatibility with older MySQL versions (e.g., 5.7)
} satisfies Config;
