import 'next-auth';
import 'next-auth/jwt';
import { User as AppUser } from '@/features/auth/types';

declare module 'next-auth' {
  interface Session {
    user: AppUser;
    accessToken: string;
  }

  // The user object passed to callbacks
  interface User extends AppUser {
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    user: AppUser;
  }
}
