import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://ph16334613591:828by9Px~@p3nlmysql11plsk.secureserver.net:3306/ph16334613591_email"!,
  },
  strict: false,
} satisfies Config;


// import type { Config } from 'drizzle-kit';

// export default {
//   schema: './src/db/schema.ts',
//   out: './drizzle',
//   dialect: 'mysql2',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// } satisfies Config;
