"use client";
import React from "react";
import z from "zod";
import { ProductSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaPoundSign } from "react-icons/fa";

function ProductForm() {
  const form = useForm<z.infer<typeof ProductSchema>>({
    defaultValues: {
      title: "",
      price: 0,
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    // execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Product</CardTitle>
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
                  <FormDescription>The name of the product</FormDescription>
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
                    <Input placeholder="Plantain Chips" {...field} />
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ProductForm;
