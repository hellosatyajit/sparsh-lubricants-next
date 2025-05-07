
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export const authProviders = [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { email, password } = credentials;
        try {
          const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
          if (user.length === 0) {
            return null;
          }

          const isMatch = await bcrypt.compare(password, user[0].password);
          console.log(isMatch);
          if (!isMatch) {
            return null;
          }

          return { id: user[0].id.toString(), name: user[0].name, email: user[0].email, type: user[0].type };

        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ]