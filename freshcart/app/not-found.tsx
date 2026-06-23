"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Home, HelpCircle } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <PageWrapper className="py-20 select-none text-center max-w-md">
      <div className="flex flex-col items-center gap-6">
        
        {/* Custom SVG Illustration */}
        <div className="flex justify-center mb-2">
          <svg
            className="w-36 h-36 text-neutral-300"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Bag Body */}
            <path d="M30 40h60v50a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10V40z" fill="var(--neutral-100)" />
            {/* Handle */}
            <path d="M45 40V30a15 15 0 0 1 30 0v10" />
            {/* Large question mark */}
            <path
              d="M60 52c3 0 5.5 2.5 5.5 5.5 0 2.5-1.5 4-3 5.5s-2.5 3-2.5 5v2 M60 78h.01"
              stroke="var(--brand-accent)"
              strokeWidth="3.5"
            />
          </svg>
        </div>

        {/* Heading & description */}
        <div>
          <h1 className="text-3xl font-display font-extrabold text-neutral-900 leading-tight">
            Oops — that shelf is empty
          </h1>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-medium">
            The aisle or page you're searching for doesn't exist, has run out of stock, or has moved elsewhere.
          </p>
        </div>

        {/* Search bar helper */}
        <form onSubmit={handleSearch} className="w-full flex items-center gap-2 relative">
          <Search className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search our aisles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 shadow-xs"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
          >
            Find
          </button>
        </form>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
          <Link
            href="/"
            className="flex-1 h-11 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-colors text-center"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          
          <Link
            href="/help"
            className="flex-1 h-11 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs transition-colors text-center"
          >
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span>Visit Help Desk</span>
          </Link>
        </div>

      </div>
    </PageWrapper>
  );
}
