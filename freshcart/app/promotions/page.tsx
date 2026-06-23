"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clipboard, ClipboardCheck, Tag, ArrowRight, Check } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/components/ui/Toast";
import promotionsData from "@/data/promotions.json";
import productsData from "@/data/products.json";
import { Promotion, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PromotionsPage() {
  const { toast } = useToast();
  
  // Zustand Store
  const { discountCode, applyDiscount, removeDiscount } = useCartStore();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast(`Coupon code "${code}" copied!`, "success");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyToCart = (promo: Promotion) => {
    applyDiscount(promo);
    toast(`Code "${promo.code}" applied to your active cart!`, "success");
  };

  // Mock Bundle Groupings (Buy 2 Get 1 or general deals)
  const bundleProducts = (productsData as Product[]).slice(0, 3);

  return (
    <div className="flex flex-col gap-10 pb-16 select-none text-left">
      
      {/* 1. Branded seasonal banner */}
      <section className="bg-brand-primary text-white py-16 border-b relative overflow-hidden">
        {/* Background mesh */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80')"
          }}
        />
        <PageWrapper className="relative z-10 flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-accent animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Seasonal Offers
          </span>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#FAF9F6] leading-tight">
              Harvest Savings Campaign
            </h1>
            <p className="text-xs md:text-sm text-neutral-300 max-w-[55ch] leading-relaxed mt-2 font-medium">
              Save on organic crops, farm-fresh milk, local breads & parathas, and kitchen staples. Freshly picked, safely delivered.
            </p>
          </div>
        </PageWrapper>
      </section>

      {/* 2. Coupons Grid */}
      <section>
        <PageWrapper>
          <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 mb-6">
            Available Coupon Codes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(promotionsData as Promotion[]).map((promo) => {
              const isApplied = discountCode?.id === promo.id;
              const isCopied = copiedCode === promo.code;

              return (
                <div
                  key={promo.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4 relative"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-neutral-100 rounded-2xl border flex-shrink-0">
                        <Tag className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-neutral-800 leading-tight">
                          {promo.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-[32ch] font-medium">
                          {promo.description}
                        </p>
                      </div>
                    </div>

                    {/* Value Badge */}
                    <span className="text-2xl font-mono font-extrabold text-brand-primary flex-shrink-0 bg-brand-primary/5 px-2.5 py-1 rounded-lg border border-brand-primary/10">
                      {promo.discountType === "percentage" ? `${promo.value}%` : `৳${promo.value}`}
                    </span>
                  </div>

                  {/* Conditions & Action buttons */}
                  <div className="border-t pt-4 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                      Min spend: ৳{promo.minSpend} · Exp: {promo.expiryDate}
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleCopyCode(promo.code)}
                        className="flex-1 sm:flex-initial h-9 px-3 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isCopied ? <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600 animate-bounce" /> : <Clipboard className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                      </button>

                      {isApplied ? (
                        <button
                          disabled
                          className="flex-1 sm:flex-initial h-9 px-3.5 bg-emerald-600 text-white text-xs font-bold rounded-lg select-none flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Applied</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyToCart(promo)}
                          className="flex-1 sm:flex-initial h-9 px-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                        >
                          Apply to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PageWrapper>
      </section>

      {/* 3. Bundle Promotional Sections */}
      <section className="py-4 border-t">
        <PageWrapper>
          <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 mb-6">
            Featured Farmers Bundles
          </h2>

          <div className="bg-[#FAF9F6] border border-neutral-300 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest leading-none mb-0.5 block">
                Exclusive bundle deals
              </span>
              <h3 className="text-lg font-display font-bold text-neutral-800">
                Farmers Organic Basket (Save 15%)
              </h3>
              <p className="text-xs text-neutral-500 max-w-[45ch] leading-relaxed font-medium">
                Pack of sweet Rajshahi Himchagor mangoes, Sagar bananas, and fresh strawberries. A wholesome local bundle for your home.
              </p>
              
              {/* Product previews list */}
              <div className="flex items-center gap-3 mt-3">
                {bundleProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-white border px-2 py-1.5 rounded-xl text-[10px] font-bold text-neutral-700">
                    <img src={p.image} alt={p.name} className="w-6 h-6 object-cover rounded-md" />
                    <span className="max-w-[80px] truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/shop"
              className="w-full md:w-auto h-11 px-6 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 flex-shrink-0 shadow-xs uppercase tracking-wide"
            >
              <span>Browse Farmer Bundles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageWrapper>
      </section>

    </div>
  );
}
