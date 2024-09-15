"use client";

import { VariantsWithImagesTags } from "@/lib/inter-type";
import React, { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { createVariant } from "@/server/actions/create-variant";
import { deleteVariant } from "@/server/actions/delete-variant";

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
};

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ editMode, productID, variant, children }, ref) => {
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

    const [open, setOpen] = useState(false);

    const { execute, status } = useAction(createVariant, {
      onExecute: () => {
        toast.loading("Creating variant...,", { duration: 500 });
        setOpen(false);
      },
      onSuccess: (data) => {
        if (data.data?.success) {
          toast.success(data.data.success);
        }
        if (data.data?.error) {
          toast.error(data.data.error);
        }
      },
    });

    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }
      if (editMode && variant) {
        form.setValue("productType", variant.productType);
        form.setValue("colour", variant.colour);
        form.setValue(
          "tags",
          variant.variantTags.map((tag) => tag.tag)
        );
        form.setValue("editMode", editMode);
        form.setValue("productID", variant.productID);
        form.setValue("id", variant.id);
        form.setValue(
          "variantImages",
          variant.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          }))
        );
      }
    };

    const variantAction = useAction(deleteVariant, {
      onExecute: () => {
        toast.loading("Deleting variant...,", { duration: 500 });
        setOpen(false);
      },
      onSuccess: (data) => {
        if (data.data?.success) {
          toast.success(data.data.success);
        }
        if (data.data?.error) {
          toast.error(data.data.error);
        }
      },
    });

    useEffect(() => {
      setEdit();
    }, []);

    function onSubmit(values: z.infer<typeof VariantSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values);
      execute(values);
    }
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll rounded-md max-h-[850px]">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Add" : "Create"} your varitant
            </DialogTitle>
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
                    <FormControl>
                      <Input placeholder="Black oversized hoodie" {...field} />
                    </FormControl>
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
                <Button
                  className="mr-3"
                  variant={"destructive"}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    variantAction.execute({ id: variant.id });
                  }}
                >
                  Delete Variant
                </Button>
              )}
              <Button className="text-white" type="submit">
                {editMode ? "Update" : "Create"} Variant
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);
