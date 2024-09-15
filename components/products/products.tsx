"use client";
import { VariantsWithProduct } from "@/lib/inter-type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/format-price";
import { FormMessage } from "../ui/form";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

function Products({ variants }: ProductTypes) {
  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {variants.map((variant) => (
        <Link
          className="py-3"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=%{variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <Image
            src={variant.variantImages[0].url}
            alt={variant.product.title}
            width={720}
            height={480}
            className="pb-2 rounded-md"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}

export default Products;
