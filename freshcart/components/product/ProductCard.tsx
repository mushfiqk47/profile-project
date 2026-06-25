"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store/cart";
import { useUserStore } from "@/lib/store/user";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import PriceDisplay from "@/components/ui/PriceDisplay";
import QuantityInput from "@/components/ui/QuantityInput";
import { useToast } from "@/components/ui/Toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { id, name, brand, price, originalPrice, weight, image, inStock, tags } = product;

  // Global State
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const { favorites, toggleFavorite } = useUserStore();
  const isFavorited = favorites.includes(id);

  // Find if this item is already in cart
  const cartItem = cartItems.find((item) => item.product.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Local interaction states
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    setIsAdding(true);
    addItem(product);
    toast(`Added ${name} to your shopping bag!`, "success");
    
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleQtyChange = (value: number) => {
    updateQuantity(id, product.variants[0] || "Standard", value);
  };

  // Determine Badge Type
  const getBadgeType = () => {
    if (!inStock) return { label: "Out of stock", variant: "outOfStock" as const };
    if (originalPrice && originalPrice > price) return { label: "Sale", variant: "sale" as const };
    if (tags.includes("Organic")) return { label: "Organic", variant: "organic" as const };
    if (tags.includes("Local")) return { label: "Local", variant: "local" as const };
    return null;
  };

  const badgeInfo = getBadgeType();

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white border border-neutral-200 hover:border-neutral-300 rounded-2xl p-3 shadow-xs flex flex-col relative select-none group w-full h-full"
    >
      
      {/* Aspect Ratio Image Container */}
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-50 mb-3 select-none">
        
        {/* Detail Link wrapper */}
        <Link href={`/product/${id}`} className="absolute inset-0 cursor-pointer z-0">
          <img
            src={image}
            alt={name}
            width={300}
            height={225}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Favorite heart toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(id);
            toast(
              isFavorited ? `Removed ${name} from favorites` : `Saved ${name} to favorites`,
              "info"
            );
          }}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 p-2 rounded-full border shadow-xs transition-all cursor-pointer backdrop-blur-md focus-ring",
            isFavorited
              ? "bg-brand-accent border-brand-accent text-white"
              : "bg-white/80 border-neutral-200/50 text-neutral-500 hover:text-red-500 hover:bg-white"
          )}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-3.5 h-3.5", isFavorited && "fill-current")} aria-hidden="true" />
        </button>

        {/* Dynamic Badge overlay */}
        {badgeInfo && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest leading-none mb-1 block">
          {brand}
        </span>
        <Link href={`/product/${id}`} className="cursor-pointer focus-ring rounded-xs">
          <h3 className="text-xs font-bold text-neutral-800 line-clamp-2 leading-snug hover:text-brand-primary transition-colors min-h-[2.5rem]">
            {name}
          </h3>
        </Link>
        
        <span className="text-[11px] text-neutral-600 mt-1 block">
          {weight}
        </span>

        {/* Bottom row: Price & Stepper */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100/50 min-h-[3rem]">
          <PriceDisplay price={price} originalPrice={originalPrice} size="sm" />

          {/* Cart Stepper Control */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!inStock ? (
                <motion.span
                  key="out"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-neutral-400 bg-neutral-100 rounded-full px-3 py-1.5 border border-neutral-200 select-none block"
                >
                  Sold Out
                </motion.span>
              ) : quantity === 0 ? (
                <motion.button
                  key="add"
                  onClick={handleAddClick}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "inline-flex items-center justify-center gap-1 h-9 px-3.5 bg-brand-primary text-brand-primary-foreground font-semibold text-xs rounded-full cursor-pointer focus-ring transition-colors shadow-xs select-none",
                    isAdding
                      ? "bg-emerald-600 text-white"
                      : "hover:bg-brand-primary-hover"
                  )}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5] animate-pulse" aria-hidden="true" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                      <span>Add</span>
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.div
                  key="stepper"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <QuantityInput
                    value={quantity}
                    onChange={handleQtyChange}
                    size="sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
}
