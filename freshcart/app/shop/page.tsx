"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import SearchFilters from "@/components/search/SearchFilters";
import ProductGrid from "@/components/product/ProductGrid";
import { useUiStore } from "@/lib/store/ui";
import productsData from "@/data/products.json";
import { Product } from "@/lib/types";

export default function ShopPage() {
  const setMobileFiltersOpen = useUiStore((state) => state.setMobileFiltersOpen);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("best-match");

  // Pagination states
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  const productsList = productsData as Product[];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Price Filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Dietary Filter
    if (selectedDietary.length > 0) {
      result = result.filter((p) =>
        selectedDietary.every((tag) => p.tags.includes(tag))
      );
    }

    // Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Rating Filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Availability Filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === "price-low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "highest-rated") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      // Just mock sorting by ID or reverse
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [productsList, selectedCategories, priceRange, selectedDietary, selectedBrands, minRating, inStockOnly, sortBy]);

  // Reset page size when filters change
  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCategories, priceRange, selectedDietary, selectedBrands, minRating, inStockOnly, sortBy]);

  const handleClearAll = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSelectedDietary([]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setLoadingMore(false);
    }, 600);
  };

  const handleRemoveCategory = (slug: string) => {
    setSelectedCategories(selectedCategories.filter((s) => s !== slug));
  };

  const handleRemoveBrand = (brand: string) => {
    setSelectedBrands(selectedBrands.filter((b) => b !== brand));
  };

  const handleRemoveDietary = (tag: string) => {
    setSelectedDietary(selectedDietary.filter((t) => t !== tag));
  };

  return (
    <PageWrapper className="py-8 select-none">
      <div className="flex flex-col gap-6">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-neutral-900 leading-tight">
            Browse Market
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            Explore 50+ fresh deshi produce, local breads & parathas, organic meats, and fresh dairy.
          </p>
        </div>

        {/* Filter / Sort Control Toolbar */}
        <div className="flex items-center justify-between gap-4 p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            {/* Mobile filters open trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex md:hidden items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl cursor-pointer transition-colors border"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-neutral-500 font-semibold">
              Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} items
            </span>
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 px-3 py-2 rounded-xl cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-brand-primary"
            >
              <option value="best-match">Best Match</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedDietary.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider pr-1">Active:</span>
            {selectedCategories.map((slug) => (
              <span
                key={slug}
                className="inline-flex items-center gap-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full select-none"
              >
                <span>Category: {slug}</span>
                <button onClick={() => handleRemoveCategory(slug)} className="hover:text-red-500 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            ))}
            {selectedBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full select-none"
              >
                <span>Brand: {brand}</span>
                <button onClick={() => handleRemoveBrand(brand)} className="hover:text-red-500 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            ))}
            {selectedDietary.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full select-none"
              >
                <span>Label: {tag}</span>
                <button onClick={() => handleRemoveDietary(tag)} className="hover:text-red-500 font-bold ml-0.5 cursor-pointer">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Main Grid & Sidebar Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Filters Sidebar */}
          <SearchFilters
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedDietary={selectedDietary}
            onDietaryChange={setSelectedDietary}
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
            minRating={minRating}
            onRatingChange={setMinRating}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            onClearAll={handleClearAll}
          />

          {/* Product Grid Area */}
          <div className="flex-1 flex flex-col gap-8">
            {filteredProducts.length > 0 ? (
              <>
                <ProductGrid
                  products={filteredProducts.slice(0, visibleCount)}
                  loading={false}
                />
                
                {/* Load More Trigger */}
                {visibleCount < filteredProducts.length && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-6 py-3 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:bg-neutral-50 disabled:text-neutral-400 select-none text-center"
                    >
                      {loadingMore ? "Loading more fresh items..." : "Load More Products"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 border border-neutral-200 border-dashed rounded-2xl bg-white">
                <p className="text-center text-sm font-semibold text-neutral-500 select-none">
                  No products match your active filters. Try clearing some constraints.
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-full cursor-pointer hover:bg-brand-primary-hover shadow-xs"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
