"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, HelpCircle, ArrowRight, Filter } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import SearchFilters from "@/components/search/SearchFilters";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useUiStore } from "@/lib/store/ui";
import productsData from "@/data/products.json";
import { Product } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setMobileFiltersOpen = useUiStore((state) => state.setMobileFiltersOpen);

  const queryParam = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(queryParam);

  // Sync search input when param changes
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const handleClearAll = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSelectedDietary([]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };

  const productsList = productsData as Product[];

  // 1. First-pass matching search query
  const queryMatchedProducts = useMemo(() => {
    if (!queryParam.trim()) return [];
    
    return productsList.filter((p) =>
      p.name.toLowerCase().includes(queryParam.toLowerCase()) ||
      p.brand.toLowerCase().includes(queryParam.toLowerCase()) ||
      p.category.toLowerCase().includes(queryParam.toLowerCase())
    );
  }, [queryParam, productsList]);

  // 2. Dynamic filter application
  const filteredProducts = useMemo(() => {
    let result = [...queryMatchedProducts];

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

    return result;
  }, [queryMatchedProducts, selectedCategories, priceRange, selectedDietary, selectedBrands, minRating, inStockOnly]);

  // 3. Autocorrect / Did you mean logic when results are 0
  const didYouMeanSuggestion = useMemo(() => {
    if (queryMatchedProducts.length > 0 || !queryParam.trim()) return null;

    // Standard simple fuzzy matching (prefix/substring)
    const queryLower = queryParam.toLowerCase();
    const suggestions = [
      { key: "mango", target: "Mangoes" },
      { key: "mago", target: "Mangoes" },
      { key: "ilish", target: "Hilsha" },
      { key: "hilsa", target: "Hilsha" },
      { key: "morich", target: "chili" },
      { key: "chili", target: "chillies" },
      { key: "ghee", target: "Ghee" },
      { key: "parata", target: "paratha" },
      { key: "mik", target: "milk" },
      { key: "chiken", target: "chicken" }
    ];

    const match = suggestions.find((s) => s.key.includes(queryLower) || queryLower.includes(s.key));
    return match ? match.target : null;
  }, [queryParam, queryMatchedProducts]);

  return (
    <PageWrapper className="py-8 select-none text-left">
      <div className="flex flex-col gap-6">
        
        {/* Search header container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-neutral-900 leading-tight">
              Search Results
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              {queryParam ? `Showing matches for "${queryParam}"` : "Search across all products."}
            </p>
          </div>

          {/* Expanded Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full relative">
            <Search className="absolute left-3 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 shadow-xs font-semibold text-neutral-700"
            />
            <button
              type="submit"
              className="h-10 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs flex-shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Suggestion panel */}
        {didYouMeanSuggestion && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-800 font-semibold select-none">
            <HelpCircle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
            <span>
              Did you mean:{" "}
              <button
                onClick={() => {
                  setSearchInput(didYouMeanSuggestion);
                  router.push(`/search?q=${encodeURIComponent(didYouMeanSuggestion)}`);
                }}
                className="underline hover:text-amber-950 font-bold cursor-pointer"
              >
                {didYouMeanSuggestion}
              </button>
              ?
            </span>
          </div>
        )}

        {/* Catalog grid split panel */}
        {queryMatchedProducts.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            
            {/* Filters Sidebar */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mb-4 md:hidden">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 text-neutral-800 text-xs font-bold rounded-xl border"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter Options</span>
                </button>
                <span className="text-xs text-neutral-400 font-bold">
                  {filteredProducts.length} items found
                </span>
              </div>
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
            </div>

            {/* Product results list */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="py-20 text-center border rounded-2xl bg-white">
                  <p className="text-xs font-semibold text-neutral-500">
                    No items in this search match your active filter tags.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="mt-4 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-full cursor-pointer hover:bg-brand-primary-hover shadow-xs"
                  >
                    Clear Filter Tags
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Empty Search results display */
          <div className="bg-white border border-neutral-200 rounded-2xl py-12 mt-4 shadow-xs">
            <EmptyState
              variant="search"
              title="No results found"
              description={`We couldn't find any products matching "${queryParam}". Try checking spelling or look through other popular collections.`}
               action={
                <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-sm mx-auto">
                  <Link
                    href="/category/fresh-produce"
                    className="px-3.5 py-1.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold rounded-full cursor-pointer transition-colors focus-ring"
                  >
                    Fruits & Veggies
                  </Link>
                  <Link
                    href="/category/dairy-eggs"
                    className="px-3.5 py-1.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold rounded-full cursor-pointer transition-colors focus-ring"
                  >
                    Eggs & Dairies
                  </Link>
                  <Link
                    href="/category/bakery"
                    className="px-3.5 py-1.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-semibold rounded-full cursor-pointer transition-colors focus-ring"
                  >
                    Artisanal Breads
                  </Link>
                </div>
              }
            />
          </div>
        )}

      </div>
    </PageWrapper>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <PageWrapper className="py-8 select-none text-left animate-pulse">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-48 bg-neutral-200 rounded-xl" />
              <div className="h-4 w-32 bg-neutral-100 rounded-lg mt-2" />
            </div>
            <div className="h-10 max-w-md w-full bg-neutral-100 rounded-xl animate-pulse" />
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="w-64 h-96 bg-neutral-100 rounded-2xl hidden md:block animate-pulse" />
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
              <div className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
              <div className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </PageWrapper>
    }>
      <SearchContent />
    </Suspense>
  );
}
