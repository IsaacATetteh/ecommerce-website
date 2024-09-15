import { variantImages } from "@/server/schema";
import { Tags } from "lucide-react";
import { z } from "zod";

export const VariantSchema = z.object({
  productID: z.number({
    required_error: "Product ID is required",
    invalid_type_error: "Product ID must be a number",
  }),
  id: z.number({ invalid_type_error: "ID must be a number" }).optional(),
  editMode: z.boolean({
    required_error: "Edit mode is required",
    invalid_type_error: "Edit mode must be a boolean",
  }),
  productType: z
    .string({
      required_error: "Product type is required",
      invalid_type_error: "Product type must be a string",
    })
    .min(3, { message: "Product type must be at least 3 characters" }),
  colour: z
    .string({
      required_error: "Colour is required",
      invalid_type_error: "Colour must be a string",
    })
    .min(3, { message: "Colour must be at least 3 characters" }),
  tags: z
    .array(z.string({ invalid_type_error: "Each tag must be a string" }))
    .min(1, { message: "At least one tag is required" }),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "Please wait for the image to upload",
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
      })
    )
    .min(1, { message: "You must provide at least one image" }),
});
