"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { IoIosMore } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import ProductVariant from "./product-variant";
import { VariantsWithImagesTags } from "@/lib/inter-type";
import { FaPlusCircle } from "react-icons/fa";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ProductList = {
  id: number;
  title: string | undefined;
  price: number;
  image: string;
  variants: VariantsWithImagesTags[];
};

async function handleDelete(id: number) {
  if (!id) return toast.error("Product not found");
  const data = await deleteProduct({ id });
  if (!data) return toast.error("Product not found");
  if (data.data?.success) {
    toast.success(data.data.success);
  }
  if (data.data?.error) {
    toast.error(data.data.error);
  }
}

const ActionCell = ({ row }: { row: Row<ProductList> }) => {
  const product = row.original;
  const { execute, status } = useAction(deleteProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data.success);
      }
      if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
    onExecute: () => {
      toast.loading("Deleting product...");
    },
  });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-primary/75 scale-75">
          <IoIosMore className="text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/dashboard/add-product?id=${product.id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<ProductList>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formattedPrice = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(price);
      return <div>{formattedPrice}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellTitle = row.getValue("title") as string;
      return (
        <img
          className="w-10 h-8 rounded-md"
          src={row.getValue("image")}
          alt={cellTitle}
        />
      );
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[];
      return (
        <div>
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant
                      producID={variant.productID}
                      variant={variant}
                      editMode
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: variant.colour }}
                      />
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ProductVariant editMode={false}>
                  <FaPlusCircle className="w-5 h-5" />
                </ProductVariant>
              </TooltipTrigger>
              <TooltipContent>Create a new variant</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionCell,
  },
];
