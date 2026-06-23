"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);

  const tabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Browse", href: "/shop", icon: Compass },
    { label: "Search", href: "/search", icon: Search, triggerSearch: true },
    { label: "Cart", href: "#", icon: ShoppingBag, triggerCart: true },
    { label: "Account", href: "/account", icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 z-50 flex items-center justify-around px-2 pb-safe shadow-lg select-none">
      {tabs.map((tab) => {
        const isCart = tab.triggerCart;
        const isSearch = tab.triggerSearch;
        const isCurrent = isCart 
          ? false 
          : isSearch 
            ? pathname === "/search" 
            : pathname === tab.href;

        const handleClick = (e: React.MouseEvent) => {
          if (isCart) {
            e.preventDefault();
            setCartOpen(true);
          } else if (isSearch) {
            // Can open search overlay or route
            setSearchOpen(true);
          }
        };

        const Icon = tab.icon;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            onClick={handleClick}
            className="flex flex-col items-center justify-center flex-1 py-1 relative h-full text-center cursor-pointer focus-ring rounded-lg"
          >
            <div className={cn("relative p-1 transition-all duration-300", isCurrent ? "text-brand-primary" : "text-neutral-400")}>
              <Icon className="w-5.5 h-5.5 stroke-[2]" />
              
              {/* Item counter for Cart tab */}
              {isCart && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-brand-accent text-[9px] font-mono font-bold text-white shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </div>

            {/* Label only visible when active */}
            <AnimatePresence initial={false}>
              {isCurrent && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-bold text-brand-primary tracking-wide uppercase mt-0.5"
                >
                  {tab.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </div>
  );
}
