"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ShoppingBag, User, ChevronDown, Heart, Receipt, Settings, LogOut, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useUserStore } from "@/lib/store/user";
import { useUiStore } from "@/lib/store/ui";
import { cn, formatPrice } from "@/lib/utils";
import SearchBar from "@/components/search/SearchBar";
import categories from "@/data/categories.json";

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const cartTotal = useCartStore((state) => state.getTotal());
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  
  const { user, addresses, activeAddressId, setActiveAddress, logout } = useUserStore();
  const activeAddress = addresses.find((addr) => addr.id === activeAddressId);

  // Monitor scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-bg-page/95 backdrop-blur-md border-neutral-200 shadow-sm py-2"
          : "bg-bg-page border-transparent py-4"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer focus-ring rounded-lg">
            <span className="font-display text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 fill-brand-accent text-brand-accent animate-pulse" aria-hidden="true" />
              FreshCart
            </span>
          </Link>

          {/* Location Chip - Desktop */}
          {user && (
            <div className="hidden md:relative flex-shrink-0">
              <button
                onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full border border-neutral-200 cursor-pointer focus-ring transition-colors select-none"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-accent" aria-hidden="true" />
                <span className="max-w-[150px] truncate">
                  Deliver to: {activeAddress ? `${activeAddress.street}, ${activeAddress.city}` : "Set Location"}
                </span>
                <ChevronDown className={cn("w-3 h-3 text-neutral-500 transition-transform duration-200", addressDropdownOpen && "rotate-180")} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {addressDropdownOpen && (
                  <>
                    {/* Backdrop cover for closing */}
                    <div className="fixed inset-0 z-10" onClick={() => setAddressDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-lg p-3 z-20"
                    >
                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">My Addresses</h4>
                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto mb-2 pr-1">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => {
                              setActiveAddress(addr.id);
                              setAddressDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left p-2 rounded-lg text-xs hover:bg-neutral-50 transition-colors border cursor-pointer focus-ring",
                              addr.id === activeAddressId
                                ? "border-brand-primary/30 bg-brand-primary/5 font-semibold text-brand-primary"
                                : "border-transparent text-neutral-700"
                            )}
                          >
                            <div>{addr.street} {addr.apartment && `, ${addr.apartment}`}</div>
                            <div className="text-neutral-400 font-normal">{addr.city}, {addr.state} {addr.zip}</div>
                          </button>
                        ))}
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAddressDropdownOpen(false)}
                        className="block text-center text-xs font-semibold text-brand-primary hover:underline py-1 border-t border-neutral-100 mt-2 focus-ring rounded-sm"
                      >
                        Manage Addresses
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* Search toggler - Mobile only */}
            <div className="md:hidden">
              <SearchBar />
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 bg-brand-primary hover:bg-brand-primary-hover text-brand-primary-foreground rounded-full shadow-xs cursor-pointer focus-ring transition-all hover:scale-105"
              aria-label={`Shopping Cart, ${cartItemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-brand-accent text-[10px] font-mono font-bold text-white shadow-sm"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1 p-0.5 rounded-full hover:bg-neutral-100 cursor-pointer focus-ring border border-neutral-200"
                  aria-label="User account menu"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-20"
                      >
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-sm font-semibold text-neutral-800 truncate">{user.name}</p>
                          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/account/orders"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors focus-ring rounded-md"
                          >
                            <Receipt className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                            <span>My Orders</span>
                          </Link>
                          
                          <Link
                            href="/account/favorites"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors focus-ring rounded-md"
                          >
                            <Heart className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                            <span>Favorites</span>
                          </Link>

                          <Link
                            href="/account"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors focus-ring rounded-md"
                          >
                            <Settings className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                            <span>Profile & Account</span>
                          </Link>
                        </div>

                        <div className="border-t border-neutral-100 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors text-left focus-ring rounded-md"
                          >
                            <LogOut className="w-4 h-4" aria-hidden="true" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full border border-neutral-200 cursor-pointer focus-ring transition-colors select-none"
              >
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign In</span>
              </Link>
            )}

          </div>

        </div>

        {/* Categories Bar - Desktop Only */}
        <nav className="hidden md:flex items-center gap-6 mt-4 border-t border-neutral-200/50 pt-2 flex-wrap">
          <Link
            href="/shop"
            className="text-xs font-bold text-neutral-700 hover:text-brand-primary uppercase tracking-wider cursor-pointer focus-ring rounded-sm px-1"
          >
            All Products
          </Link>
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="text-xs font-semibold text-neutral-500 hover:text-brand-primary uppercase tracking-wider transition-colors cursor-pointer focus-ring rounded-sm px-1"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/promotions"
            className="text-xs font-bold text-brand-accent hover:text-brand-accent-hover uppercase tracking-wider ml-auto cursor-pointer animate-pulse focus-ring rounded-sm px-1"
          >
            Offers %
          </Link>
        </nav>

      </div>
    </header>
  );
}
