"use server"

import { RegisterSchema } from "@/types/register-schema";
import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt"

export const emailRegister = actionClient.schema(RegisterSchema).action(async ({ parsedInput: { email, password, username } }) => { 
  console.log(email, password);
 
  const passwordHash = await bcrypt.hash(password, 10)
  console.log(passwordHash);
  
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if(existingUser?.email === email) {
    return {error : "An account with this email already exists"};
  }

  return {success : "reached!"};
});