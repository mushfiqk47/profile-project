"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Receipt, Heart, Settings, Plus, ShoppingBag } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useUserStore } from "@/lib/store/user";
import { useCartStore } from "@/lib/store/cart";
import { useUiStore } from "@/lib/store/ui";
import { useToast } from "@/components/ui/Toast";
import productsData from "@/data/products.json";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const { toast } = useToast();
  const { favorites } = useUserStore();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUiStore((state) => state.setCartOpen);

  const [activeTab, setActiveTab] = useState<"All" | "Available" | "OutOfStock">("All");

  const productsList = productsData as Product[];

  // Retrieve full product info of favorites
  const favoritedProducts = useMemo(() => {
    return productsList.filter((p) => favorites.includes(p.id));
  }, [favorites, productsList]);

  // Apply subfilters
  const filteredProducts = useMemo(() => {
    if (activeTab === "All") return favoritedProducts;
    if (activeTab === "Available") return favoritedProducts.filter((p) => p.inStock);
    return favoritedProducts.filter((p) => !p.inStock);
  }, [favoritedProducts, activeTab]);

  const handleAddAllToCart = () => {
    const available = favoritedProducts.filter((p) => p.inStock);
    if (available.length === 0) {
      toast("No available items in favorites to add", "error");
      return;
    }

    available.forEach((p) => {
      addItem(p, p.variants[0] || "Standard");
    });

    toast(`Added ${available.length} items to your shopping bag!`, "success");
    setCartOpen(true);
  };

  const menuItems = [
    { label: "Profile & Settings", href: "/account", icon: Settings },
    { label: "My Orders", href: "/account/orders", icon: Receipt },
    { label: "Favorites", href: "/account/favorites", icon: Heart, active: true },
  ];

  return (
    <PageWrapper className="py-8 select-none text-left">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <aside className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs lg:sticky lg:top-24">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-3 mb-4 select-none">
            Settings Menu
          </h3>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors",
                    item.active
                      ? "bg-brand-primary/5 text-brand-primary"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <Icon className="w-4 h-4 text-neutral-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Favorites catalog display */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-extrabold text-neutral-900 leading-tight">
                Saved Favorites
              </h1>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                Fresh items you've saved to buy again.
              </p>
            </div>
            {favoritedProducts.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="flex items-center justify-center gap-1.5 h-10 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors select-none"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All to Bag</span>
              </button>
            )}
          </div>

          {/* Subfiltering tabs */}
          {favoritedProducts.length > 0 && (
            <div className="flex border-b border-neutral-200 select-none pb-1 gap-2">
              <button
                onClick={() => setActiveTab("All")}
                className={cn(
                  "px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                  activeTab === "All"
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                )}
              >
                All ({favoritedProducts.length})
              </button>
              
              <button
                onClick={() => setActiveTab("Available")}
                className={cn(
                  "px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                  activeTab === "Available"
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                )}
              >
                In Stock ({favoritedProducts.filter((p) => p.inStock).length})
              </button>

              <button
                onClick={() => setActiveTab("OutOfStock")}
                className={cn(
                  "px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                  activeTab === "OutOfStock"
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                )}
              >
                Out of Stock ({favoritedProducts.filter((p) => !p.inStock).length})
              </button>
            </div>
          )}

          {/* Grid display */}
          <div>
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl py-12 shadow-xs select-none">
                <EmptyState
                  variant="favorites"
                  title="No saved items found"
                  description={
                    favoritedProducts.length === 0
                      ? "You haven't favorited any products yet. Tap the heart icons on cards to save favorites here!"
                      : `You don't have any items under "${activeTab}" filter right now.`
                  }
                  action={
                    <Link
                      href="/shop"
                      className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full hover:bg-brand-primary-hover shadow-xs inline-block focus-ring"
                    >
                      Browse Products
                    </Link>
                  }
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
