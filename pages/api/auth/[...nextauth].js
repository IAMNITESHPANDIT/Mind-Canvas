import { LOGIN_USER } from "@utils/endPoint";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(`${process.env.BASE_URL}${LOGIN_USER}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.username,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            console.error(`Error: ${res.statusText}`);
            return null;
          }

          const user = await res.json();

          if (user.ok && user) {
            return user;
          } else {
            console.error(`Login failed. Response: ${JSON.stringify(user)}`);
            return null;
          }
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Assuming that token contains the user information
      session.user = token;
      return session;
    },
  },
});
