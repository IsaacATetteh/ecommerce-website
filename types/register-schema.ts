import * as z from "zod"

export const RegisterSchema = z.object({
    email: z.string().email({
        message:"Invalid email"
    }),
    password: z.string().min(8, {  
        message:"Password is too weak",
    }),    
    name: z.string().min(3, {
        message : "Must be at at least 3 characters"
    },)
})              