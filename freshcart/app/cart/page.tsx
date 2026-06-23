"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag, ArrowRight, Notebook, CreditCard } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import CartItemRow from "@/components/cart/CartItemRow";
import EmptyState from "@/components/ui/EmptyState";
import PriceDisplay from "@/components/ui/PriceDisplay";
import ProductCarousel from "@/components/product/ProductCarousel";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";
import promotionsData from "@/data/promotions.json";
import products from "@/data/products.json";
import { Product, Promotion } from "@/lib/types";
import { cn } from "@/lib/utils";

const promotions = promotionsData as Promotion[];

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Zustand Store
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
    tipAmount,
    setTip
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [customTipActive, setCustomTipActive] = useState(false);
  const [customTipVal, setCustomTipVal] = useState("");

  const tipOptions = [20, 50, 100, 200];

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
        setErrorMsg(`Minimum spend for this code is ৳${matchedPromo.minSpend}`);
        return;
      }
      
      applyDiscount(matchedPromo);
      setPromoInput("");
      toast(`Code "${matchedPromo.code}" applied!`, "success");
    } else {
      setErrorMsg("Invalid coupon code");
    }
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomTipVal(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setTip(num);
    } else {
      setTip(0);
    }
  };

  // Customers Also Bought recommendations
  const recommendedProducts = useMemo(() => {
    if (items.length === 0) return (products as Product[]).slice(0, 5);
    
    // Sourced from similar categories as items in cart
    const cartCategories = items.map((i) => i.product.category);
    const cartProductIds = items.map((i) => i.product.id);
    
    return (products as Product[])
      .filter((p) => cartCategories.includes(p.category) && !cartProductIds.includes(p.id))
      .slice(0, 8);
  }, [items]);

  if (items.length === 0) {
    return (
      <PageWrapper className="py-20 select-none text-center">
        <EmptyState
          variant="cart"
          title="Your Shopping bag is empty"
          description="Looks like you haven't added anything to your cart yet. Browse our organic and local sections to find delicious items."
          action={
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full hover:bg-brand-primary-hover shadow-xs inline-block focus-ring"
            >
              Start Shopping
            </Link>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-8 select-none text-left">
      <div className="flex flex-col gap-6">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-neutral-900 leading-tight">
              Shopping Bag
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Review items, specify instructions and customize courier tips.
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* 2-Column Split: Items list / Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Cart items and instructions */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* List */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col divide-y divide-neutral-100">
              {items.map((item) => (
                <CartItemRow key={`${item.product.id}-${item.selectedVariant}`} item={item} />
              ))}
            </div>

            {/* Instruction Notepad */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Notebook className="w-4.5 h-4.5 text-brand-primary" />
                Add Delivery Instructions / Notes
              </h3>
              <textarea
                rows={3}
                placeholder="e.g. Ring buzzer 3B. Leave package by the doorstep inside the lobby. If produce is not ripe, please substitute."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary resize-none font-medium text-neutral-700"
              />
            </div>

          </div>

          {/* Right Column: Checkout Pricing Summary */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              
              <div className="pb-3 border-b border-neutral-200">
                <h3 className="font-display font-bold text-neutral-900 text-base">Payment Summary</h3>
              </div>

              {/* Coupon Codes */}
              {!discountCode ? (
                <form onSubmit={handleApplyPromo} className="mb-2">
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
                        className="w-full pl-9 pr-3 py-2 border border-neutral-200 text-xs rounded-lg bg-white focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary uppercase font-semibold"
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
                <div className="flex items-center justify-between bg-brand-primary/5 border border-brand-primary/10 rounded-lg p-2.5 mb-2">
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

              {/* Tip Selection */}
              <div>
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Courier Tip</h4>
                <div className="grid grid-cols-5 gap-1.5 mb-1.5">
                  {tipOptions.map((opt) => {
                    const isSelected = tipAmount === opt && !customTipActive;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          setCustomTipActive(false);
                          setTip(opt);
                        }}
                        className={cn(
                          "py-1.5 border rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center",
                          isSelected
                            ? "border-brand-primary bg-brand-primary text-white"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-neutral-50"
                        )}
                      >
                        ৳{opt}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => {
                      setCustomTipActive(true);
                      setTip(0);
                    }}
                    className={cn(
                      "py-1.5 border rounded-lg text-xs font-semibold transition-all cursor-pointer text-center",
                      customTipActive
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-neutral-50"
                    )}
                  >
                    Custom
                  </button>
                </div>

                {customTipActive && (
                  <div className="flex items-center gap-1.5 border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-neutral-50 font-mono text-xs mt-1.5 animate-fade-in">
                    <span className="text-neutral-400">৳</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="Enter custom tip..."
                      value={customTipVal}
                      onChange={handleCustomTipChange}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-neutral-700 font-sans text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Detailed Breakdown */}
              <div className="flex flex-col gap-2.5 text-xs border-t border-neutral-200 pt-3 mt-1">
                
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(getSubtotal())}</span>
                </div>

                {getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-brand-accent font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span className="flex items-center gap-1">
                    Delivery Fee
                    {getSubtotal() >= 1500 && (
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

                <div className="flex justify-between text-neutral-600">
                  <span>Courier Tip</span>
                  <span className="font-mono">{formatPrice(tipAmount)}</span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-end border-t border-neutral-100 pt-3 mt-2">
                  <span className="text-sm font-bold text-neutral-800">Total Due</span>
                  <span className="text-xl font-mono font-extrabold text-neutral-900">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => router.push("/checkout")}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm select-none mt-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Checkout Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Payment methods row */}
              <div className="flex items-center justify-center gap-2 select-none opacity-50 mt-1">
                <span className="text-[8px] font-mono font-bold border rounded px-1">bKash</span>
                <span className="text-[8px] font-mono font-bold border rounded px-1">Nagad</span>
                <span className="text-[8px] font-mono font-bold border rounded px-1">Rocket</span>
                <span className="text-[8px] font-mono font-bold border rounded px-1">COD</span>
                <span className="text-[8px] font-mono font-bold border rounded px-1">VISA</span>
                <span className="text-[8px] font-mono font-bold border rounded px-1">MC</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Recommendations Carousel */}
      {recommendedProducts.length > 0 && (
        <section className="py-4 select-none border-t mt-8">
          <ProductCarousel products={recommendedProducts} title="Customers Also Bought" subtitle="Popular organic pairings in other shopping bags." />
        </section>
      )}
    </PageWrapper>
  );
}
