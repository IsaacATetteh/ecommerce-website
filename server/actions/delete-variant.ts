"use server";
import * as z from "zod";
import { actionClient } from "@/lib/safe-action";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "@/server";
import { revalidatePath } from "next/cache";

const DeleteVariantSchema = z.object({
  id: z.number(),
});

export const deleteVariant = actionClient
  .schema(DeleteVariantSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      return {
        success: `${deletedVariant[0].productType} has been succesfully deleted`,
      };
    } catch (error) {
      return { error: "Error deleting variant" };
    }
  });
