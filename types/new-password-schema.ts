import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(8, "password should be at least 8 characters"),
  token: z.string().nullable().optional(),
});
