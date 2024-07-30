import * as z from "zod"

export const LoginScehma = z.object({
    email: z.string().email({
        message:"Invalid email"
    }),
    password: z.string().min(1, {  
        message:"Password is too weak",
    }),    
    code: z.optional(z.string()),
})              