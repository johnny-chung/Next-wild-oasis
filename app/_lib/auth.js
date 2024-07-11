import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      //call by auth (export below) when auth is used as middle
      return !!auth?.user; // !!convert to boolean = if user exist -> true, else false
    },
    // call after user input crediential, but before login to the app
    async signIn({ user, account, profile }) {
      try {
        // custom function to get user info from supabase
        const existGuest = await getGuest(user.email);
        if (!existGuest) {
          await createGuest({ fullName: user.name, email: user.email });
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    // store the user id from supabase into session
    // don't need to fetch everytime
    // session is called right after login or session ttl revoke
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
