"use server";

import { actionClient } from "@/lib/safe-action";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import { getPasswordResetByToken } from "./tokens";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import bcrypt from "bcrypt";

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({
      connectionString: process.env.DRIZZLE_DATABASE_URL!,
    });
    const dbPool = drizzle(pool);
    //console.log(password, token);
    if (!token) {
      return { error: "No token provided" };
    }

    const existingToken = await getPasswordResetByToken(token);

    if (!existingToken) {
      return { error: "Invalid token" };
    }

    const tokenHasExpired = new Date(existingToken.expires) < new Date();

    if (tokenHasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "User does not exist" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (trx) => {
      await trx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));
      await trx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });
    return { success: "Password reset" };
  });
