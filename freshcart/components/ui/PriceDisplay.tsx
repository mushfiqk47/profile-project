import React from "react";
import { cn, formatPrice } from "@/lib/utils";

interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function PriceDisplay({
  price,
  originalPrice,
  size = "md",
  className,
  ...props
}: PriceDisplayProps) {
  const isDiscounted = originalPrice !== undefined && originalPrice > price;
  const savingsPercent = isDiscounted
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  const sizeClasses = {
    sm: {
      price: "text-sm",
      original: "text-xs",
      savings: "text-[10px] px-1 py-0.2"
    },
    md: {
      price: "text-base",
      original: "text-sm",
      savings: "text-[11px] px-1.5 py-0.5"
    },
    lg: {
      price: "text-xl",
      original: "text-base",
      savings: "text-xs px-2 py-0.5"
    },
    xl: {
      price: "text-3xl",
      original: "text-xl",
      savings: "text-sm px-2 py-1"
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-2 flex-wrap", className)} {...props}>
      <span className={cn("font-mono font-bold text-neutral-900", sizeClasses[size].price)}>
        {formatPrice(price)}
      </span>
      {isDiscounted && (
        <>
          <span className={cn("font-mono text-neutral-400 line-through", sizeClasses[size].original)}>
            {formatPrice(originalPrice!)}
          </span>
          <span
            className={cn(
              "font-sans font-bold bg-brand-accent/15 text-brand-accent rounded-sm uppercase tracking-wider select-none",
              sizeClasses[size].savings
            )}
          >
            Save {savingsPercent}%
          </span>
        </>
      )}
    </div>
  );
}
