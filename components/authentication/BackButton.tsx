"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const BackButton = ({ href, label }: { href: string; label: string }) => {
  return (
    <Button>
      <Link aria-label={label} href={href}>
        Back
      </Link>
    </Button>
  );
};

export default BackButton;
