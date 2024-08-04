import * as z from "zod";

export const SettingSchema = z
  .object({
    name: z.string().optional(),
    image: z.string().optional(),
    isTwofactorEnabled: z.boolean().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
  })
  .refine((data) => {
    if (data.password && data.newPassword) {
      return false;
    }
    return true;
  });
