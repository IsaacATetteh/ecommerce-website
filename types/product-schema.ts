import * as z from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  price: z.coerce.number().positive({ message: "Price must be above 0" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
});
