"use server"
import { db } from "..";
import { eq } from "drizzle-orm";
import { verificationTokens } from "../schema";

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