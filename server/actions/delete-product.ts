"use server";

import { actionClient } from "@/lib/safe-action";
import { ProductSchema } from "@/types/product-schema";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "@/server";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Import z from zod

// Define the schema for the input
const DeleteProductSchema = z.object({
  id: z.number(),
});

export const deleteProduct = actionClient
  .schema(DeleteProductSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    try {
      const product = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      console.log("Product deleted", product);
      return { success: `${product[0].title} successfully deleted` };
    } catch (error) {
      console.log("Product not found", error);
      return { error: "Product not found" };
    }
  });
