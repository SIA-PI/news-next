import { api } from '@/lib/http-client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { endpoints } from '@/features/auth/endpoints';
import { DecodedToken, LoginResponse } from '@/features/auth/types';
import { User } from 'next-auth';
import type { User as AppUser } from '@/features/auth/types';
import { jwtDecode } from 'jwt-decode';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const { data } = await api.post<LoginResponse>(
            endpoints.auth.login(),
            {
              username: credentials.username,
              password: credentials.password,
            },
          );

          if (data && data.access_token) {
            const decoded: DecodedToken = jwtDecode(data.access_token);
            if (!decoded) return null;

            return {
              id: decoded.sub,
              username: decoded.username,
              accessToken: data.access_token,
            } as User;
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as User).accessToken;
        token.user = {
            id: user.id,
            username: (user as User).username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.user) {
        session.user = token.user as AppUser;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };