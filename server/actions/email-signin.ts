"use server"

import { LoginScehma } from "@/types/login-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

export const emailSignIn = actionClient.schema(LoginScehma).action(async ({ parsedInput: { email, password, code } }) => { 
  console.log(email, password, code);
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if(existingUser?.email === email) {
    return {error : "User already exists"};
  }

  return {success : email};
});