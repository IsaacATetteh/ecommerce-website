import { variantImages } from "@/server/schema";
import { Tags } from "lucide-react";
import { z } from "zod";

export const VariantSchema = z.object({
  productID: z.number(),
  id: z.number(),
  editMode: z.boolean(),
  productType: z
    .string()
    .min(3, { message: "Product type must be at least 3 characters" }),
  colour: z
    .string()
    .min(3, { message: "Colour must be at least 3 characters" }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
  variantImages: z.array(
    z.object({
      url: z.string().refine(
        (url) => {
          url.search("blob:") !== 0;
        },
        { message: "Please wait for the image to finsih uploading" }
      ),
      size: z.number(),
      id: z.number().optional(),
      name: z.string(),
    })
  ),
});
