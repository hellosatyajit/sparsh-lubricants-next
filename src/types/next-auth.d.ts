import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    type: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      type: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    type: string;
  }
} 