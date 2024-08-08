"use server";

import { LoginSchema } from "@/types/login-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailToken, generateTwoFactorToken } from "./tokens";
import { sendEmailVerification } from "./email-send";
import { signIn } from "../auth";
import { AuthError } from "next-auth";
import { getTwoFactorTokenByEmail } from "./tokens";
import { twoFactorTokens } from "../schema";
import { sendTwoFactorEmail } from "./email-send";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    //console.log(email, password, code);
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "User does not exist" };
      }

      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailToken(existingUser?.email);
        await sendEmailVerification(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Email confirmation sent" };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        console.log("User exists");

        if (code) {
          console.log("Two factor code provided", code);
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
          if (!twoFactorToken || twoFactorToken.token !== code) {
            console.log("error1");
            return { error: "Invalid two factor code" };
          }
          const tokenExpired = new Date(twoFactorToken.expires) < new Date();
          if (tokenExpired) {
            console.log("error2");
            return { error: "Two factor token has expired" };
          }
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);
          if (!token) {
            return { error: "Failed to generate two factor token" };
          }
          await sendTwoFactorEmail(token[0].email, token[0].token);
          console.log("Two factor token sent");
          return { twoFactor: "Two factor token sent" };
        }
      }
      console.log("Before Signed in");

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      console.log("Signed in");

      return { success: email };
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: "Invalid credentials" };
      }
      console.error(error);
      throw error;
    }
  });
