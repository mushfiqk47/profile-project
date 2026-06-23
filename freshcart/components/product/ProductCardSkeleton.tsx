import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-3 shadow-xs flex flex-col relative select-none animate-pulse overflow-hidden w-full">
      {/* 4:3 Aspect Ratio Image Skeleton */}
      <div className="aspect-[4/3] w-full rounded-xl bg-neutral-200 relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Content Skeletons */}
      <div className="mt-3 flex-1 flex flex-col gap-2">
        {/* Brand */}
        <div className="h-3 w-16 bg-neutral-200 rounded-sm" />
        
        {/* Title */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="h-4 w-full bg-neutral-200 rounded-sm" />
          <div className="h-4 w-2/3 bg-neutral-200 rounded-sm" />
        </div>

        {/* Size/Weight */}
        <div className="h-3.5 w-12 bg-neutral-100 rounded-sm mt-1" />

        {/* Price and Add button block */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100/50">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-16 bg-neutral-200 rounded-sm" />
            <div className="h-3 w-10 bg-neutral-100 rounded-sm" />
          </div>
          
          <div className="h-9 w-20 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
