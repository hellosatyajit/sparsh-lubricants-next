import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .execute();

        if (!user.length) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user[0].password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].name,
          type: user[0].type, // Admin, Sales, Finance, etc.
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.type = token.type;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default NextAuth(authOptions);
