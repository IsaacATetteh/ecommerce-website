"use server";

import { LoginSchema } from "@/types/login-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailToken } from "./tokens";
import { sendEmailVerification } from "./email-send";
import { signIn } from "../auth";
import { AuthError } from "next-auth";
import { get } from "http";

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
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
      if (error instanceof AuthError) {
        return { error: "Invalid credentials" };
      }
      console.error(error);
      throw error;
    }
  });
