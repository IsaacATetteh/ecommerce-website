"use server";

import { RegisterSchema } from "@/types/register-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { generateEmailToken } from "./tokens";
import { sendEmailVerification } from "./email-send";

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    // console.log(email, password);

    // Password hashing
    const passwordHash = await bcrypt.hash(password, 10);
    //console.log(passwordHash);

    // Check to see if user already exists with that email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      // If the existing user isn't verified
      if (!existingUser.emailVerified) {
        //Send a confirmation email
        const verificationToken = await generateEmailToken(email);
        await sendEmailVerification(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "Email confirmation resent" };
      }
      // If the account is already verfied, error
      return { error: "An account with this email already exists" };
    }

    //If the account doesn't exist insert the new user
    await db
      .insert(users)
      .values({ email, name, password: passwordHash })
      .execute();

    // Generate a new token for newly made account
    const verificationToken = await generateEmailToken(email);
    await sendEmailVerification(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: "Email confirmation sent!" };
  });
