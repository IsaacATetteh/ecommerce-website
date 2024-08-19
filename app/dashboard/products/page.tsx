import { db } from "@/server";
// Remove the import statement if not needed
import placeholder from "@/public/placeholder.jpg";
import React from "react";
import { DataTable } from "@/app/dashboard/products/data-table";
import { columns } from "./columns";

async function Products() {
  const products = await db.query.products.findMany({
    with: { productVariants: { with: { variantImages: true } } },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) return <div>No products found</div>;
  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      variants: [],
      image: placeholder.src,
    };
  });

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}

export default Products;
