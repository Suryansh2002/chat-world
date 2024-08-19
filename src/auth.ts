import NextAuth from "next-auth";
import { User } from "./db/schema";
import { db } from "./db";
import { user } from "./db/schema";
import { eq } from "drizzle-orm";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    dbUser?: User;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      if (
        account &&
        profile &&
        account.provider === "google" &&
        profile.email_verified === true
      ) {
        return true;
      }
      return false;
    },
    async session({ session }) {
      const dbUser = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, session.user.email),
      });

      if (
        dbUser &&
        session.user.image &&
        !dbUser.imageIsSet &&
        dbUser.imageUrl !== session.user.image
      ) {
        await db
          .update(user)
          .set({ imageUrl: session.user.image })
          .where(eq(user.email, session.user.email));
        dbUser.imageUrl = session.user.image;
      }

      return {
        ...session,
        dbUser: dbUser,
      };
    },
  },
});
