"use server"

import { LoginScehma } from "@/types/login-schema";
import { actionClient } from "@/lib/safe-action";


export const emailSignIn = actionClient.schema(LoginScehma).action(async ({ parsedInput: { email, password, code } }) => { 

  console.log(email, password, code);
  return email;
   
});