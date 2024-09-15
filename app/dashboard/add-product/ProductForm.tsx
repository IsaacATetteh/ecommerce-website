"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import { ProductSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/server/actions/get-product";
import { createProduct } from "@/server/actions/create-product";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Tiptap from "./Tiptap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaPoundSign } from "react-icons/fa";
import { cn } from "@/lib/utils";
function ProductForm() {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        router.push("/dashboard/products");
        toast.success("Product created successfully");
        console.log(data.data.success);
      }
      if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const edit = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (edit) {
      const data = await getProducts(id);
      if (data.error) {
        toast.error(data.error);
        router.push("/dashboard/products");
        return;
      }
      if (data.sucess) {
        const id = parseInt(edit);
        form.setValue("id", id);
        form.setValue("title", data.sucess.title);
        form.setValue("price", data.sucess.price);
        form.setValue("description", data.sucess.description);
      }
    }
  };

  useEffect(() => {
    if (edit) {
      checkProduct(parseInt(edit));
    }
  }, []);

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{edit ? "Edit Product" : "Add a Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className=" space-y-3">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Plantain Chips" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className=" space-y-3">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className=" space-y-3">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <FaPoundSign className="" />
                      <Input
                        placeholder="£1.00"
                        type="number"
                        step="0.1"
                        min={0}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className={cn(
                "w-full mt-6",
                status === "executing" ? "animate-pulse" : ""
              )}
              disabled={
                status === "executing" ||
                !form.formState.isDirty ||
                !form.formState.isValid
              }
              type="submit"
            >
              {edit ? "Edit Product" : "Add Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ProductForm;
