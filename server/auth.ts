import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from ".";
import { eq } from "drizzle-orm";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import bcrypt from "bcrypt";
import { LoginScehma } from "@/types/login-schema";
import Credentials from "@auth/core/providers/credentials";
import { users } from "./schema";
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginScehma.safeParse(credentials);
        if (validatedFields.success) {
          const user = await db.query.users.findFirst({
            where: eq(users.email, validatedFields.data.email),
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            validatedFields.data.password,
            user.password
          );
          if (passwordMatch) {
            console.log("matched!")
            return user;
          }
        }
        console.log("not matched!")
        return null;
      },
    }),
  ],
});
