"use server"
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { verificationTokens } from "../schema";
import { date } from "drizzle-orm/pg-core";

export const getTokenByEmail = async(email : string) => {
   try {
    const verificationToken = await db.query.verificationTokens.findFirst({
         // Check to see if the email arelady has a token corresponding to it
        where: eq(verificationTokens.token, email)
    })
    return verificationToken;
   } catch (error) {
    return null;
   } 
}

export const generateEmailToken = async(email : string) => {
    // Generate a token
    const token = crypto.randomUUID()

    // Set its expiry date
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getTokenByEmail(email)

    // If the email already has an old token associated with it, delete it
    if(existingToken) {
        await db.delete(verificationTokens).where(eq(verificationTokens.id, existingToken.id))
    }

    // Generate a new token
    const emailToken = await db.insert(verificationTokens).values({token, email, expires}).returning()

    return emailToken;
}

export const newVerification = async(token : string) => {
    const existingToken = await getTokenByEmail(token)
    if(!existingToken) return {error : "Invalid token"}

    const tokenHasExpired = new Date(existingToken.expires) < new Date()

    const existingUser = await db.query.users.findFirst({
        where: eq(existingToken.email, users.email)
    })

    if(!existingUser) return { error: "User no longer exists" }

    await db.update(users).set({
        emailVerified: new Date(),
        email: existingToken.email
    })

    await db.delete(verificationTokens).where(
        eq(verificationTokens.id, existingToken.id)
    )

    return { success: "Email verified" }
}

