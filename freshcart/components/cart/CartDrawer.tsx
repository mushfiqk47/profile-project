"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Tag, ShoppingBag, ArrowRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useUiStore } from "@/lib/store/ui";
import { formatPrice } from "@/lib/utils";
import CartItemRow from "./CartItemRow";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import promotionsData from "@/data/promotions.json";
import { Promotion } from "@/lib/types";

const promotions = promotionsData as Promotion[];

export default function CartDrawer() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Zustand Store
  const { cartOpen, setCartOpen } = useUiStore();
  const {
    items,
    discountCode,
    applyDiscount,
    removeDiscount,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTaxAmount,
    getTotal,
    getItemCount
  } = useCartStore();

  // Local state for discount code input
  const [promoInput, setPromoInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!promoInput.trim()) return;

    const matchedPromo = promotions.find(
      (p) => p.code.toLowerCase() === promoInput.trim().toLowerCase()
    );

    if (matchedPromo) {
      const subtotal = getSubtotal();
      if (subtotal < matchedPromo.minSpend) {
        setErrorMsg(`Minimum spend for this code is $${matchedPromo.minSpend.toFixed(2)}`);
        return;
      }
      
      applyDiscount(matchedPromo);
      setPromoInput("");
      toast(`Code "${matchedPromo.code}" applied!`, "success");
    } else {
      setErrorMsg("Invalid coupon code");
    }
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  } as const;

  const drawerVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", damping: 30, stiffness: 300 } }
  } as const;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop mask */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 pointer-events-auto"
          />

          {/* Drawer content panel */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-full md:w-[460px] bg-white shadow-2xl z-50 flex flex-col pointer-events-auto"
          >
            
            {/* Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-primary" />
                <span className="text-lg font-display font-bold text-neutral-900">
                  Your Cart
                </span>
                <span className="bg-neutral-100 text-neutral-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                  {getItemCount()}
                </span>
              </div>
              
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 cursor-pointer focus-ring"
                aria-label="Close cart panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              {items.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <CartItemRow key={`${item.product.id}-${item.selectedVariant}`} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  variant="cart"
                  title="Your bag is empty"
                  description="Looks like you haven't added anything to your cart yet. Browse our aisles to find the freshest organic items!"
                  action={
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full cursor-pointer hover:bg-brand-primary-hover shadow-xs focus-ring"
                    >
                      Start Shopping
                    </button>
                  }
                />
              )}
            </div>

            {/* Sticky summary footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-5 bg-neutral-50/50 select-none">
                
                {/* Promo Input */}
                {!discountCode ? (
                  <form onSubmit={handleApplyPromo} className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Promo code (e.g. FRESH20)"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            setErrorMsg("");
                          }}
                          className="w-full pl-9 pr-3 py-2 border border-neutral-200 text-xs rounded-lg bg-white focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary uppercase"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!promoInput.trim()}
                        className="h-9 px-4 bg-neutral-800 hover:bg-neutral-900 disabled:bg-neutral-200 text-white disabled:text-neutral-400 font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                    {errorMsg && <p className="text-[10px] text-red-600 font-semibold mt-1 pl-1">{errorMsg}</p>}
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-brand-primary/5 border border-brand-primary/10 rounded-lg p-2.5 mb-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-primary" />
                      <div>
                        <span className="text-xs font-bold text-brand-primary">{discountCode.code}</span>
                        <p className="text-[10px] text-neutral-500 leading-none mt-0.5">{discountCode.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeDiscount();
                        toast("Discount code removed", "info");
                      }}
                      className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Subtotal list */}
                <div className="flex flex-col gap-2 text-xs border-b border-neutral-200 pb-3 mb-3">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(getSubtotal())}</span>
                  </div>
                  
                  {discountCode && (
                    <div className="flex justify-between text-brand-accent font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-{formatPrice(getDiscountAmount())}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span className="flex items-center gap-1">
                      Delivery Fee
                      {getSubtotal() >= 75 && (
                        <span className="bg-brand-primary/10 text-brand-primary text-[9px] font-bold px-1 py-0.2 rounded uppercase">Free</span>
                      )}
                    </span>
                    <span className="font-mono">
                      {getDeliveryFee() === 0 ? "Free" : formatPrice(getDeliveryFee())}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Tax</span>
                    <span className="font-mono">{formatPrice(getTaxAmount())}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-end mb-5">
                  <span className="text-sm font-bold text-neutral-800">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-mono font-extrabold text-neutral-900">
                      {formatPrice(getTotal())}
                    </span>
                    <p className="text-[9px] text-neutral-400 mt-0.5">Includes taxes & standard tip</p>
                  </div>
                </div>

                {/* Action Checkout */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm select-none"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
