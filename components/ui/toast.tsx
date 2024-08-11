"use client";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import React from "react";

function Toast() {
  const theme = useTheme();
  if (typeof theme === "string") {
    return (
      <Toaster
        richColors
        theme={theme as "dark" | "light" | "system" | undefined}
      />
    );
  }
}

export default Toast;
