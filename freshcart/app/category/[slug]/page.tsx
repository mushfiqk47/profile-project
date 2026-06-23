"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Tag } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import { Product, Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryPageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Find active category
  const category = useMemo(() => {
    return (categoriesData as Category[]).find((cat) => cat.slug === slug);
  }, [slug]);

  // Find all subcategories for pills
  const subcategories = useMemo(() => {
    if (!category) return [];
    
    // Extract unique subcategories from products list
    const filteredProds = (productsData as Product[]).filter((p) => p.category === slug);
    const uniqueSubs = Array.from(new Set(filteredProds.map((p) => p.subcategory)));
    return ["All", ...uniqueSubs];
  }, [category, slug]);

  const [activeSub, setActiveSub] = useState("All");

  // Filter products by category and active subcategory
  const filteredProducts = useMemo(() => {
    let result = (productsData as Product[]).filter((p) => p.category === slug);
    
    if (activeSub !== "All") {
      result = result.filter((p) => p.subcategory === activeSub);
    }
    
    return result;
  }, [slug, activeSub]);

  if (!category) {
    return (
      <PageWrapper className="py-20 text-center select-none">
        <h1 className="text-2xl font-display font-bold text-neutral-800 mb-4">Category Not Found</h1>
        <p className="text-xs text-neutral-500 mb-6">We couldn't find the aisle you were looking for.</p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full hover:bg-brand-primary-hover shadow-xs"
        >
          Browse All Aisles
        </Link>
      </PageWrapper>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      
      {/* Category Hero Block */}
      <section
        className="w-full py-16 text-neutral-900 border-b relative overflow-hidden"
        style={{ backgroundColor: `${category.color}dd` }}
      >
        <PageWrapper className="relative z-10 flex flex-col items-start gap-4">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent uppercase tracking-wider transition-colors cursor-pointer focus-ring rounded-sm px-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Shop</span>
          </Link>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-neutral-900 flex items-center gap-2">
              {category.name}
            </h1>
            <p className="text-xs md:text-sm text-neutral-600 font-semibold max-w-[50ch] mt-2 leading-relaxed">
              {category.description}
            </p>
          </div>
        </PageWrapper>
      </section>

      {/* Subcategory Pills & Catalog Grid */}
      <PageWrapper className="flex flex-col gap-6">
        
        {/* Subcategories Scroll track */}
        {subcategories.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            {subcategories.map((sub) => {
              const isActive = activeSub === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={cn(
                    "px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer select-none flex-shrink-0 focus-ring",
                    isActive
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* Product Grid and Banner */}
        <div className="flex flex-col gap-8">
          {filteredProducts.length > 0 ? (
            <>
              {/* Product cards */}
              <ProductGrid products={filteredProducts.slice(0, 12)} />

              {/* Inline Promotional Banner */}
              {filteredProducts.length >= 12 && (
                <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 select-none mt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-primary text-white rounded-xl border">
                      <Tag className="w-5 h-5 fill-brand-accent text-brand-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800">Fresh organic recipes, sourced locally</h4>
                      <p className="text-[10px] text-neutral-500 leading-normal font-medium mt-0.5">
                        Free delivery on standard orders above ৳1,500. Add more local items to qualify.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/promotions"
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg uppercase tracking-wide cursor-pointer text-center"
                  >
                    View Active Coupons
                  </Link>
                </div>
              )}

              {/* Remaining products */}
              {filteredProducts.length > 12 && (
                <ProductGrid products={filteredProducts.slice(12)} className="mt-4" />
              )}
            </>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-2xl py-12 shadow-xs">
              <EmptyState
                variant="category"
                title="No items found"
                description={`We don't have any items in the "${activeSub}" subcategory of ${category.name} right now.`}
                action={
                  <button
                    onClick={() => setActiveSub("All")}
                    className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-full cursor-pointer transition-colors shadow-xs focus-ring"
                  >
                    Show All {category.name}
                  </button>
                }
              />
            </div>
          )}
        </div>

      </PageWrapper>
    </div>
  );
}
