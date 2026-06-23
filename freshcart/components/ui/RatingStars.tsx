import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}

export default function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  className,
  ...props
}: RatingStarsProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const roundedRating = Math.round(rating);
  const extraFull = rating % 1 >= 0.75 ? 1 : 0;
  
  const totalFull = fullStars + extraFull;
  const emptyStars = Math.max(0, 5 - totalFull - (hasHalf ? 1 : 0));

  const starSizeClass = isSm ? "w-3.5 h-3.5" : isLg ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className={cn("inline-flex items-center gap-1", className)} {...props}>
      <div className="flex items-center text-amber-500">
        {/* Full Stars */}
        {Array.from({ length: totalFull }).map((_, i) => (
          <Star key={`full-${i}`} className={cn("fill-current", starSizeClass)} />
        ))}
        
        {/* Half Star */}
        {hasHalf && <StarHalf className={cn("fill-current", starSizeClass)} />}
        
        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={cn("text-neutral-300", starSizeClass)} />
        ))}
      </div>
      
      <span className={cn("font-mono font-bold text-neutral-800", isSm ? "text-xs" : isLg ? "text-base" : "text-sm")}>
        {rating.toFixed(1)}
      </span>

      {reviewCount !== undefined && (
        <span className={cn("text-neutral-400 font-sans font-medium", isSm ? "text-[11px]" : isLg ? "text-sm" : "text-xs")}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
