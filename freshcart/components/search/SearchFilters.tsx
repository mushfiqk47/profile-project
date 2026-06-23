"use client";

import React from "react";
import { X, Filter, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";
import categories from "@/data/categories.json";

interface SearchFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (slugs: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedDietary: string[];
  onDietaryChange: (tags: string[]) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onClearAll: () => void;
  desktopSticky?: boolean;
}

export default function SearchFilters({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedDietary,
  onDietaryChange,
  selectedBrands,
  onBrandChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  onClearAll,
  desktopSticky = true
}: SearchFiltersProps) {
  const { mobileFiltersOpen, setMobileFiltersOpen } = useUiStore();

  const dietaryOptions = ["Organic", "Local", "Vegan", "Gluten-Free"];
  const brandOptions = [
    "Rajshahi Orchards",
    "Narsingdi Farms",
    "Local Greenhouses",
    "Savar Farm",
    "Organic Cooperatives",
    "Aarong Dairy",
    "Radhuni",
    "Rupchanda",
    "Bashundhara",
    "Pran",
    "Farm Fresh"
  ];

  const handleCategoryToggle = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onCategoryChange(selectedCategories.filter((s) => s !== slug));
    } else {
      onCategoryChange([...selectedCategories, slug]);
    }
  };

  const handleDietaryToggle = (tag: string) => {
    if (selectedDietary.includes(tag)) {
      onDietaryChange(selectedDietary.filter((t) => t !== tag));
    } else {
      onDietaryChange([...selectedDietary, tag]);
    }
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedDietary.length > 0 ||
    selectedBrands.length > 0 ||
    minRating > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000 ||
    inStockOnly;

  const renderFiltersContent = () => (
    <div className="flex flex-col gap-6 p-4 md:p-0 select-none">
      {/* Header with clear action */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-sm">
          <Filter className="w-4 h-4 text-brand-primary" />
          Filter By
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-brand-accent hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">Category</h4>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => handleCategoryToggle(cat.slug)}
                className="w-4 h-4 rounded-md accent-brand-primary border-neutral-300 focus:ring-brand-primary"
              />
              <span className={cn(selectedCategories.includes(cat.slug) && "font-semibold text-neutral-900")}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
          Price Range
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-1.5 border border-neutral-200 rounded-lg px-2 py-1.5 bg-neutral-50 font-mono text-xs">
            <span className="text-neutral-400">৳</span>
            <input
              type="number"
              min={0}
              max={5000}
              value={priceRange[0]}
              onChange={(e) => onPriceRangeChange([Math.max(0, Number(e.target.value)), priceRange[1]])}
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-neutral-700"
            />
          </div>
          <span className="text-neutral-400 text-xs font-bold">to</span>
          <div className="flex-1 flex items-center gap-1.5 border border-neutral-200 rounded-lg px-2 py-1.5 bg-neutral-50 font-mono text-xs">
            <span className="text-neutral-400">৳</span>
            <input
              type="number"
              min={0}
              max={5000}
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], Math.max(priceRange[0], Number(e.target.value))])}
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-neutral-700"
            />
          </div>
        </div>
      </div>

      {/* Dietary Tags */}
      <div>
        <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">Dietary Labels</h4>
        <div className="flex flex-wrap gap-1.5">
          {dietaryOptions.map((tag) => {
            const isActive = selectedDietary.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleDietaryToggle(tag)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer",
                  isActive
                    ? "bg-brand-primary text-white border-brand-primary font-semibold"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">Brand</h4>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {brandOptions.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 rounded-md accent-brand-primary border-neutral-300 focus:ring-brand-primary"
              />
              <span className={cn(selectedBrands.includes(brand) && "font-semibold text-neutral-900")}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div>
        <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">Minimum Rating</h4>
        <div className="flex flex-col gap-2">
          {[4.8, 4.5, 4.0].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(minRating === rating ? 0 : rating)}
              className={cn(
                "text-left text-xs p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between",
                minRating === rating
                  ? "border-brand-primary bg-brand-primary/5 font-semibold text-brand-primary"
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
              )}
            >
              <span>{rating} stars & up</span>
              <div className="flex text-amber-500 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={cn("w-3 h-3 fill-current", i < Math.floor(rating) ? "text-amber-500" : "text-neutral-200")}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-neutral-200 pt-4 mb-2">
        <label className="flex items-center justify-between text-xs font-semibold text-neutral-700 cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-8 h-4 rounded-full bg-neutral-200 border-none appearance-none cursor-pointer checked:bg-brand-primary relative before:absolute before:content-[''] before:w-3 before:h-3 before:bg-white before:rounded-full before:top-[2px] before:left-[2px] checked:before:left-[18px] before:transition-all"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters Panel */}
      <aside
        className={cn(
          "hidden md:block w-64 flex-shrink-0 bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs h-fit",
          desktopSticky && "sticky top-24"
        )}
      >
        {renderFiltersContent()}
      </aside>

      {/* Mobile Drawer Slide-in */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden"
            />
            {/* Filter Drawer sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-2xl shadow-xl z-50 overflow-y-auto md:hidden"
            >
              <div className="sticky top-0 bg-white px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-sm">Refine Results</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full bg-neutral-100 text-neutral-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {renderFiltersContent()}

              <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-brand-primary text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-brand-primary-hover shadow-xs text-center"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
