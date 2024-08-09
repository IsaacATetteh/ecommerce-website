"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, animate } from "framer-motion";
import { cn } from "@/lib/utils";
function DashboardNavBar({
  allLinks,
}: {
  allLinks: { label: string; path: string; icon: JSX.Element }[];
}) {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav className="px-5 py-2 text-sm font-semibold">
      <ul className="flex gap-5">
        <AnimatePresence>
          {allLinks.map((link, index) => (
            <motion.li whileTap={{ scale: 0.95 }} key={index}>
              <Link
                className={cn(
                  "flex flex-col items-center relative",
                  pathname === link.path && "text-primary"
                )}
                href={link.path}
              >
                {link.icon}
                {link.label}
                {pathname === link.path && (
                  <motion.div
                    className="h-[2px] w-full rounded-full absolute z-0 left-0 bg-primary -bottom-1"
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}

export default DashboardNavBar;
