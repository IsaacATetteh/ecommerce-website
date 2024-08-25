"use client";

import { VariantsWithImagesTags } from "@/lib/inter-type";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VariantSchema } from "@/types/variant-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductInputTags } from "./ProductInputTags";
import VariantImages from "./VariantImages";

export const ProductVariant = ({
  editMode,
  productID,
  variant,
  children,
}: {
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      colour: "#000000",
      variantImages: [],
      editMode: editMode,
      productID,
      id: undefined,
      productType: "Black oversized hoodie",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll rounded-md max-h-[850px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Add" : "Create"} your varitant</DialogTitle>
          <DialogDescription>Manage product variants</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Title</FormLabel>
                  <FormControl></FormControl>
                  <FormDescription>The name of your variant.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Colour</FormLabel>
                  <FormControl>
                    <Input placeholder="Blue" type="color" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <ProductInputTags
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {editMode && variant && (
              <Button type="button" onClick={(e) => e.preventDefault}>
                Delete Variant
              </Button>
            )}
            <Button type="submit">
              {editMode ? "Update" : "Create"} Variant
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
