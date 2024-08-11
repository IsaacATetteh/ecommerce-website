"use server";

import { actionClient } from "@/lib/safe-action";
import { ProductSchema } from "@/types/product-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { title, price, description, id } }) => {
    try {
      if (id) {
        const currProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!currProduct) {
          return { error: "Product not found" };
        }

        const editedProduct = await db
          .update(products)
          .set({ title, price, description })
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/products");

        return { success: `${editedProduct[0].title} successfully edited` };
      }

      const newProduct = await db
        .insert(products)
        .values({ title, price, description })
        .returning();

      return { success: `${newProduct[0].title} created` };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
