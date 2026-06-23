import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "organic" | "sale" | "new" | "local" | "outOfStock" | "default";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant = "default", children, className, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-neutral-200 text-neutral-800",
    organic: "bg-[#13382B] text-[#FAF9F6] font-medium border border-[#13382B]/20",
    sale: "bg-[#E05E2B] text-[#FAF9F6] font-medium animate-pulse",
    new: "bg-blue-600 text-white font-medium",
    local: "bg-amber-600 text-white font-medium",
    outOfStock: "bg-neutral-500 text-white font-normal"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs select-none tracking-wide uppercase transition-all duration-300",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
