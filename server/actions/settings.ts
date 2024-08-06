"use server";

import { actionClient } from "@/lib/safe-action";
import { users } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { SettingsSchema } from "@/types/settings-schema";
import { auth } from "../auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export const settings = actionClient
  .schema(SettingsSchema)
  .action(async ({ parsedInput }) => {
    const user = await auth();
    if (!user) {
      return { error: "User not found" };
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    if (!dbUser) {
      return { error: "User not found" };
    }

    if (user.user.isoAuth) {
      parsedInput.email = undefined;
      parsedInput.password = undefined;
      parsedInput.newPassword = undefined;
      parsedInput.isTwoFactorEnabled = undefined;
    }

    if (parsedInput.password && parsedInput.newPassword && dbUser.password) {
      const match = await bcrypt.compare(
        parsedInput.password,
        dbUser.password!
      );

      if (!match) {
        return { error: "Password does not match" };
      }

      const samePassword = await bcrypt.compare(
        parsedInput.newPassword,
        dbUser.password
      );

      if (samePassword) {
        return { error: "New password cannot be the same as the old password" };
      }

      const hashedPassword = await bcrypt.hash(parsedInput.newPassword, 10);
      parsedInput.password = hashedPassword;
      parsedInput.newPassword = undefined;
    }

    await db
      .update(users)
      .set({
        name: parsedInput.name,
        password: parsedInput.password,
        twoFactorEnabled: parsedInput.isTwoFactorEnabled,
        email: parsedInput.email,
        image: parsedInput.image,
      })
      .where(eq(users.id, dbUser.id));
    revalidatePath("/dashboard/settings");
    return { success: "Settings updated" };
  });
