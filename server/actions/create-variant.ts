"use server";

import { VariantSchema } from "@/types/variant-schema";
import { actionClient } from "@/lib/safe-action";
import { productVariants, variantTags } from "../schema";
import { variantImages } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch";

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        colour,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: newImages,
      },
    }) => {
      try {
        if (editMode && id) {
          const editedVariant = await db
            .update(productVariants)
            .set({ colour, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();
          console.log("111111111");
          await db
            .delete(variantTags)
            .where(eq(variantTags.id, editedVariant[0].id));
          console.log("22222222");
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: editedVariant[0].id,
            }))
          );
          console.log("33333333");

          await db
            .delete(variantImages)
            .where(eq(variantImages.id, editedVariant[0].id));

          await db.insert(variantImages).values(
            newImages.map((image, index) => ({
              name: image.name,
              url: image.url,
              size: image.size,
              order: index,
              variantID: editedVariant[0].id,
            }))
          );
          revalidatePath("/dashboard/products");
          return { success: "Variant updated successfully" };
        }
        if (!editMode) {
          console.log("reachedd");
          const newVariant = await db
            .insert(productVariants)
            .values({
              colour,
              productType,
              productID,
            })
            .returning();
          console.log("error1");
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );
          console.log("error2");

          await db.insert(variantImages).values(
            newImages.map((image, index) => ({
              name: image.name,
              url: image.url,
              size: image.size,
              order: index,
              variantID: newVariant[0].id,
            }))
          );
          revalidatePath("/dashboard/products");
          return { success: "Variant created successfully" };
        }
      } catch (error) {
        return { error: "Failed to update variant" };
      }
    }
  );
