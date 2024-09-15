"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useFieldArray, useFormContext } from "react-hook-form";
import { VariantSchema } from "@/types/variant-schema";
import { FaRegTrashAlt } from "react-icons/fa";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadDropzone } from "@/src/utils/uploadthing";
import { Button } from "@/components/ui/button";
function VariantImages() {
  const { getValues, control, setError } =
    useFormContext<z.infer<typeof VariantSchema>>();

  const { move, append, remove, update, fields } = useFieldArray({
    control,
    name: "variantImages",
  });

  const [active, setActive] = useState(0);

  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <UploadDropzone
                className="hover:bg-primary/10 transition-all ut-button:bg-primary ut-upload-icon:text-primary/50 duration-500 ease-in-out rounded-md "
                onUploadError={(error) => {
                  setError("variantImages", {
                    message: error.message,
                    type: "validate",
                  });
                  return;
                }}
                onBeforeUploadBegin={(files) => {
                  files.map((file) =>
                    append({
                      name: file.name,
                      size: file.size,
                      url: URL.createObjectURL(file),
                    })
                  );
                  return files;
                }}
                onClientUploadComplete={(files) => {
                  const images = getValues("variantImages");
                  images.map((field, index) => {
                    if (field.url.search("blob:") === 0) {
                      const image = files.find(
                        (img) => img.name === field.name
                      );
                      if (image) {
                        update(index, {
                          url: image.url,
                          name: image.name,
                          size: image.size,
                        });
                      }
                    }
                  });
                  return;
                }}
                endpoint="variantUploader"
                config={{ mode: "auto" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeIndex = fields[active];
              e.map((field, index) => {
                if (field.id === activeIndex.id) {
                  move(active, index);
                  setActive(index);
                  return;
                }
                return;
              });
            }}
          >
            {fields.map((field, index) => (
              <Reorder.Item
                as="tr"
                key={field.id}
                value={field}
                id={field.id}
                onDragStart={() => setActive(index)}
                className={cn(
                  field.url.search("blob:") === 0
                    ? "animate-pulse transition-all"
                    : "",
                  "text-sm font-bold hover:text-primary"
                )}
              >
                <TableCell>{index}</TableCell>
                <TableCell>{field.name}</TableCell>
                <TableCell>{(field.size / (1024 * 1024)).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="">
                    <img
                      src={field.url}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant={"destructive"}
                    onClick={(e) => {
                      e.preventDefault();
                      remove(index);
                    }}
                  >
                    <FaRegTrashAlt />
                  </Button>
                </TableCell>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
}

export default VariantImages;
