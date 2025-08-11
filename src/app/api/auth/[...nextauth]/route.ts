import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Login Mockado
        if (
          credentials?.email === 'test@test.com' &&
          credentials?.password === 'password'
        ) {
          return {
            id: '1',
            name: 'Test User',
            email: 'test@test.com',
          };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
});

export { handler as GET, handler as POST };
