"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  seeAllHref?: string;
  loading?: boolean;
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  seeAllHref,
  loading = false,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Monitor scroll positioning to toggle arrows
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    setShowLeftArrow(el.scrollLeft > 10);
    // Add small tolerance to avoid rounding issues
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      // Run once on load
      checkScroll();
      
      // Also observe size changes
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(el);
      
      return () => {
        el.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [products, loading]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8; // Scroll 80% of width
    const targetScroll = el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);

    el.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full group py-4 select-none">
      
      {/* Header and See All */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-neutral-400 mt-1 leading-normal font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors uppercase tracking-wider cursor-pointer"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Carousel Track Container */}
      <div className="relative">
        
        {/* Navigation Arrows - Desktop Only */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white text-neutral-800 rounded-full border border-neutral-200 shadow-md cursor-pointer transition-all hover:scale-105 hidden md:flex"
            aria-label="Previous items"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white text-neutral-800 rounded-full border border-neutral-200 shadow-md cursor-pointer transition-all hover:scale-105 hidden md:flex"
            aria-label="Next items"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Scrolling Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pr-4 pb-2 scrollbar-none"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-car-${i}`}
                  className="w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0 snap-start"
                >
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

      </div>

    </div>
  );
}
