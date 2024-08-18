"use server";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { db } from "..";

export const getProducts = async (id: number) => {
  try {
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    return { sucess: existingProduct };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};
