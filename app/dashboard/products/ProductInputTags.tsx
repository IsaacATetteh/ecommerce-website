"use client";
import { Input, InputProps } from "@/components/ui/input";
import React, { Dispatch, forwardRef, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { IoIosClose } from "react-icons/io";

type ProductInputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};
export const ProductInputTags = forwardRef<
  HTMLInputElement,
  ProductInputTagsProps
>(({ onChange, value, ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  const [pendingData, setPendingData] = useState("");

  function addPendingDataPoint() {
    if (pendingData) {
      const newDataPoints = new Set([...value, pendingData]);
      onChange(Array.from(newDataPoints));
      setPendingData("");
    }
  }

  const { setFocus } = useFormContext();

  return (
    <div
      className={cn(
        "flex w-full min-h-10 rounded-lg border border-input bg-background  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        focused
          ? "ring-offset-2 outline-none ring-ring ring-2"
          : "ring-offset-0 outline-none ring-ring ring-0"
      )}
      onClick={() => setFocus("tags")}
    >
      <motion.div className="rounded-md min-h-[2.5rem]  p-2 flex gap-2 flex-wrap items-center">
        <AnimatePresence>
          {value.map((tag) => (
            <motion.div
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              exit={{ scale: 0 }}
              key={tag}
            >
              <Badge variant={"secondary"}>{tag}</Badge>
              <button
                className="w-3 ml-1"
                onClick={() => onChange(value.filter((i) => i !== tag))}
              >
                <IoIosClose />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex">
          <Input
            className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 "
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPendingDataPoint();
              }
              if (e.key === "Backspace" && !pendingData && value.length > 0) {
                e.preventDefault();
                const newValue = [...value];
                newValue.pop();
                onChange(newValue);
              }
            }}
            value={pendingData}
            onFocus={(e) => setFocused(true)}
            onBlurCapture={(e) => setFocused(false)}
            onChange={(e) => setPendingData(e.target.value)}
            {...props}
          />
        </div>
      </motion.div>
    </div>
  );
});

ProductInputTags.displayName = "ProductInputTags";
