"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, History, Tag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/lib/store/ui";
import { cn, formatPrice } from "@/lib/utils";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import { Product } from "@/lib/types";

export default function SearchBar() {
  const router = useRouter();
  const searchOpen = useUiStore((state) => state.searchOpen);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "organic eggs",
    "sourdough bread",
    "apples"
  ]);

  const trendingItems = ["avocados", "croissants", "berries", "milk", "ribeye"];

  // Debounced search logic
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const matched = (productsData as Product[])
        .filter((prod) =>
          prod.name.toLowerCase().includes(query.toLowerCase()) ||
          prod.brand.toLowerCase().includes(query.toLowerCase()) ||
          prod.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limit suggestions to 5
      setSuggestions(matched);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchOpen]);

  const handleSearchSubmit = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Save to recents
    if (!recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
    }

    setIsFocused(false);
    setSearchOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  // Helper to highlight matching characters
  const highlightMatch = (text: string, match: string) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === match.toLowerCase() ? (
            <strong key={i} className="text-brand-accent font-bold">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full z-30">
      
      {/* Search Input Container */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search organic grocery, fresh foods…"
          aria-label="Search catalog for organic groceries"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setSearchOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full pl-9 pr-9 py-2 bg-neutral-100 border border-neutral-200 text-sm rounded-full transition-all duration-300 focus:outline-hidden focus:border-brand-primary/50 focus:bg-white focus:ring-2 focus:ring-brand-primary/10",
            isFocused ? "md:w-[400px]" : "md:w-[240px]"
          )}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 p-0.5 rounded-full hover:bg-neutral-200 cursor-pointer text-neutral-500 focus-ring"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Suggestion & History Dropdown */}
      <AnimatePresence>
        {(isFocused || searchOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 left-0 md:left-auto md:w-[400px] mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden"
          >
            
            {/* Suggestions View */}
            {query.trim().length > 0 ? (
              <div className="p-2">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 py-1.5 border-b border-neutral-100">
                  Search Suggestions
                </h4>
                {suggestions.length > 0 ? (
                  <div className="flex flex-col mt-1">
                    {suggestions.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          setIsFocused(false);
                          setSearchOpen(false);
                          setQuery("");
                          router.push(`/product/${prod.id}`);
                        }}
                        className="flex items-center gap-3 w-full text-left p-2 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer focus-ring"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-neutral-800 truncate">
                            {highlightMatch(prod.name, query)}
                          </p>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            {prod.brand}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-900 pr-2">
                          {formatPrice(prod.price)}
                        </span>
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handleSearchSubmit(query)}
                      className="flex items-center justify-between w-full text-left p-3 mt-1 hover:bg-brand-primary/5 text-brand-primary text-xs font-bold rounded-xl border-t border-neutral-100 cursor-pointer focus-ring"
                    >
                      <span>Show all results for "{query}"</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 px-3 py-4 text-center">
                    No matching products found.
                  </p>
                )}
              </div>
            ) : (
              
              /* History & Trending View */
              <div className="p-4 flex flex-col gap-4">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <History className="w-3 h-3 text-neutral-400" aria-hidden="true" />
                      Recent Searches
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearchSubmit(search)}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-full cursor-pointer transition-colors focus-ring"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Items */}
                <div>
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3 h-3 text-neutral-400" aria-hidden="true" />
                    Trending Searches
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingItems.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSearchSubmit(item)}
                        className="px-2.5 py-1 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent text-xs font-semibold rounded-full cursor-pointer transition-colors focus-ring"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Categories */}
                <div className="border-t border-neutral-100 pt-3">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Tag className="w-3 h-3 text-neutral-400" aria-hidden="true" />
                    Category Shortcuts
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categoriesData.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setIsFocused(false);
                          setSearchOpen(false);
                          router.push(`/category/${cat.slug}`);
                        }}
                        className="text-left px-3 py-1.5 border border-neutral-200 rounded-lg hover:border-brand-primary/30 hover:bg-neutral-50 transition-all text-xs font-semibold text-neutral-700 cursor-pointer focus-ring"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
