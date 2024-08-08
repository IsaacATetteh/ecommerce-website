"use server";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import { verificationTokens } from "../schema";
import { twoFactorTokens } from "../schema";
import crypto from "crypto";

export const getTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      // Check to see if the email arelady has a token corresponding to it
      where: eq(verificationTokens.token, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailToken = async (email: string) => {
  // Generate a token
  const token = crypto.randomUUID();

  // Set its expiry date
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTokenByEmail(email);

  // If the email already has an old token associated with it, delete it
  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  // Generate a new token
  const emailToken = await db
    .insert(verificationTokens)
    .values({ token, email, expires })
    .returning();

  return emailToken;
};

export const newVerification = async (token: string) => {
  const existingToken = await getTokenByEmail(token);
  if (!existingToken) return { error: "Invalid token" };

  const tokenHasExpired = new Date(existingToken.expires) < new Date();
  if (tokenHasExpired) return { error: "Token has expired" };

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) return { error: "User no longer exists" };

  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id));

  return { success: "Email verified" };
};

export const getPasswordResetByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    });
    return twoFactorTokens;
  } catch (error) {
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, existingToken.id));
    }

    const twoFactorToken = await db
      .insert(twoFactorTokens)
      .values({ token, email, expires })
      .returning();

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const generateResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    }

    const passwordResetToken = await db
      .insert(passwordResetTokens)
      .values({ token, email, expires })
      .returning();

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
