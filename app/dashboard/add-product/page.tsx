import React from "react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import ProductForm from "./ProductForm";

async function AddProduct() {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect("/");
  }
  return <ProductForm />;
}

export default AddProduct;
