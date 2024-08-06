"use server";

import { actionClient } from "@/lib/safe-action";
import { ResetSchema } from "@/types/reset-schema";
import { users } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { generateResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email-send";

export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return { error: "User does not exist" };
    }

    const passwordResetToken = await generateResetToken(email);
    if (!passwordResetToken) {
      return { error: "Error generating reset token" };
    }
    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );
    return { success: "Password reset email sent" };
  });
