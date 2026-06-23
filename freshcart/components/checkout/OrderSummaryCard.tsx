"use client";

import React, { useState } from "react";
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface OrderSummaryCardProps {
  showItemsDefault?: boolean;
}

export default function OrderSummaryCard({ showItemsDefault = false }: OrderSummaryCardProps) {
  const {
    items,
    getSubtotal,
    getDiscountAmount,
    getDeliveryFee,
    getTaxAmount,
    getTotal,
    tipAmount,
    setTip
  } = useCartStore();

  const [expanded, setExpanded] = useState(showItemsDefault);
  const [customTipActive, setCustomTipActive] = useState(false);
  const [customTipVal, setCustomTipVal] = useState("");

  const tipOptions = [20, 50, 100, 200];

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

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4 select-none w-full sticky top-24">
      
      {/* Title block */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <h3 className="font-display font-bold text-neutral-900 text-base">Order Summary</h3>
        <span className="bg-neutral-100 text-neutral-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
          {items.reduce((acc, curr) => acc + curr.quantity, 0)} items
        </span>
      </div>

      {/* Toggleable Item list */}
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-xs font-bold text-neutral-500 uppercase tracking-wider hover:text-neutral-800 transition-colors cursor-pointer"
        >
          <span>View Items in Bag</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mt-3 pr-1 border-b border-neutral-100 pb-3">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedVariant}`} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-8 h-8 rounded-md object-cover border"
                  />
                  <div className="truncate min-w-0">
                    <p className="font-semibold text-neutral-800 truncate">{item.product.name}</p>
                    <span className="text-[10px] text-neutral-400">Qty: {item.quantity} · {item.selectedVariant}</span>
                  </div>
                </div>
                <span className="font-mono text-neutral-700 flex-shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tip Selector */}
      <div className="py-1">
        <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Courier Tip</h4>
        <div className="grid grid-cols-5 gap-1.5 mb-2">
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
              placeholder="Enter custom tip (e.g. 50)"
              value={customTipVal}
              onChange={handleCustomTipChange}
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-neutral-700 font-sans text-xs"
            />
          </div>
        )}
        <p className="text-[9px] text-neutral-400 mt-1 leading-normal">
          100% of tips are sent directly to your delivery courier. Thank you!
        </p>
      </div>

      {/* Calculations Breakdown */}
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
      
    </div>
  );
}
