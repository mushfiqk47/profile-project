import React from "react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { cn } from "@/lib/utils";

interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product[];
  loading?: boolean;
  limit?: number;
  skeletonCount?: number;
}

export default function ProductGrid({
  products,
  loading = false,
  limit,
  skeletonCount = 8,
  className,
  ...props
}: ProductGridProps) {
  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6",
        className
      )}
      {...props}
    >
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))
        : displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
