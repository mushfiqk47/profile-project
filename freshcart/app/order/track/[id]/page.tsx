"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Phone, MapPin, ChevronDown, ChevronUp, ShieldQuestion, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/lib/store/user";
import { cn, formatPrice } from "@/lib/utils";
import { Order } from "@/lib/types";

interface TrackPageProps {
  params: { id: string };
}

export default function OrderTrackingPage({ params }: TrackPageProps) {
  const { id } = params;
  const { orders } = useUserStore();

  const order = useMemo(() => {
    return orders.find((o) => o.id === id);
  }, [orders, id]);

  const [itemsExpanded, setItemsExpanded] = useState(false);

  // Live ETA Countdown Timer (starts at 12 minutes)
  const [etaSeconds, setEtaSeconds] = useState(12 * 60); // 720 seconds
  useEffect(() => {
    if (order?.status === "Delivered" || order?.status === "Cancelled") {
      setEtaSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(interval);
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const formatCountdown = () => {
    const mins = Math.floor(etaSeconds / 60);
    const secs = etaSeconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  if (!order) {
    return (
      <PageWrapper className="py-20 text-center select-none">
        <h1 className="text-2xl font-display font-bold text-neutral-800 mb-4">Order Record Not Found</h1>
        <p className="text-xs text-neutral-500 mb-6">We couldn't locate this order in your historical files.</p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full hover:bg-brand-primary-hover shadow-xs"
        >
          Back to Shop
        </Link>
      </PageWrapper>
    );
  }

  // Stepper timeline items
  const timelineSteps = [
    { label: "Order Placed", desc: "Received at our market", time: "11:32 AM", done: true },
    { label: "Confirmed", desc: "Basket prepared by hand", time: "11:35 AM", done: true },
    { label: "Being Packed", desc: "Dave R. is packing cool bags", time: "11:38 AM", done: order.status !== "Pending", active: order.status === "Pending" || order.status === "Being Packed" },
    { label: "Out for Delivery", desc: "Courier driving to you", time: "Pending Dispatch", done: order.status === "Out for Delivery" || order.status === "Delivered", active: order.status === "Out for Delivery" },
    { label: "Delivered", desc: "Placed by doorstep", time: "Estimated 11:55 AM", done: order.status === "Delivered", active: order.status === "Delivered" }
  ];

  return (
    <PageWrapper className="py-8 select-none text-left">
      <div className="flex flex-col gap-6">
        
        {/* Header navigation */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-neutral-900 leading-tight">
              Track Order
            </h1>
            <p className="text-xs text-neutral-600 mt-1 font-medium font-mono font-semibold">
              Reference: #{id}
            </p>
          </div>
          <Link
            href="/account/orders"
            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent uppercase tracking-wider transition-colors cursor-pointer focus-ring rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>My Order History</span>
          </Link>
        </div>

        {/* 2-Column Split: Progress tracking / Live Map visual */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns: Timeline and Courier details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Countdown card */}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <div className="bg-brand-primary text-[#FAF9F6] border border-brand-primary/10 rounded-2xl p-6 shadow-md flex items-center justify-between gap-6 relative overflow-hidden select-none">
                {/* Visual mesh glow background */}
                <div className="absolute inset-0 bg-cover bg-center opacity-10 z-0 bg-[radial-gradient(circle_at_top_right,var(--brand-accent),transparent)] pointer-events-none" />
                <div className="relative z-10 flex items-start gap-4">
                  <Clock className="w-10 h-10 text-brand-accent stroke-[2.5] flex-shrink-0 animate-pulse mt-1" aria-hidden="true" />
                  <div>
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest block mb-0.5">Estimated Arrival</span>
                    <h2 className="text-3xl sm:text-4xl font-mono font-extrabold tracking-tight">
                      {formatCountdown()}
                    </h2>
                    <p className="text-xs text-neutral-200 mt-1 leading-normal">
                      Dave is driving carefully to ensure produce safety.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Courier Bio Details */}
            {order.status !== "Cancelled" && (
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                    alt="Dave R. Courier"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-neutral-800">Dave R.</span>
                      <span className="bg-brand-primary/10 text-brand-primary text-[9px] font-bold px-1.5 py-0.2 rounded uppercase select-none">Courier</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-neutral-500 font-semibold">
                      <span className="text-amber-500">★ 4.9 Rating</span>
                      <span>·</span>
                      <span>1,200+ deliveries</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:1-800-FRESH-NOW`}
                  className="flex items-center justify-center gap-1.5 h-10 px-4 border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer focus-ring"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                  <span>Call Dave</span>
                </a>
              </div>
            )}

            {/* Status Timeline */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Delivery Progress</h3>
              
              <div className="flex flex-col gap-6 pl-2 relative border-l border-neutral-200 ml-4 py-2 select-none">
                {timelineSteps.map((step, idx) => {
                  const isDone = step.done;
                  const isActive = step.active;

                  return (
                    <div key={idx} className="relative pl-6 flex items-start gap-4">
                      
                      {/* Circle dot marker */}
                      <div
                        className={cn(
                          "absolute left-[-29px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 shadow-xs",
                          isDone
                            ? "bg-brand-primary border-brand-primary text-white"
                            : isActive
                              ? "bg-white border-brand-primary text-brand-primary animate-pulse"
                              : "bg-white border-neutral-200 text-neutral-400"
                        )}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                        ) : (
                          <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-brand-primary" : "bg-neutral-200")} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-xs">
                        <strong className={cn("text-sm block leading-none font-bold", isDone ? "text-neutral-800" : isActive ? "text-brand-primary" : "text-neutral-400")}>
                          {step.label}
                        </strong>
                        <p className="text-neutral-600 mt-1 font-medium">{step.desc}</p>
                      </div>

                      <span className="font-mono text-[10px] text-neutral-600 text-right font-semibold select-none flex-shrink-0 mt-0.5">
                        {step.time}
                      </span>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Static Visual Map Placeholder & Accordions */}
          <div className="flex flex-col gap-6">
            
            {/* Static route Map */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-neutral-100 p-3.5 border-b flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider select-none">
                <MapPin className="w-4 h-4 text-brand-accent" aria-hidden="true" />
                Live Dispatch Map
              </div>
              
              {/* Route Illustration SVG */}
              <div className="h-56 bg-neutral-50 relative flex items-center justify-center p-4">
                <svg className="w-full h-full text-neutral-300" viewBox="0 0 200 120" fill="none">
                  {/* Grid Lines background */}
                  <path d="M0 20h200M0 50h200M0 80h200M0 110h200M30 0v120M70 0v120M110 0v120M150 0v120" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                  
                  {/* Transit path road */}
                  <path
                    d="M30 30h100v60h40"
                    stroke="#EFECE6"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M30 30h100v60h40"
                    stroke="var(--brand-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                  
                  {/* Farm Depot */}
                  <circle cx="30" cy="30" r="6" fill="#13382B" />
                  <text x="24" y="20" fill="#807766" fontSize="8" fontWeight="bold">DEPOT</text>
                  
                  {/* Destination Dropoff */}
                  <circle cx="170" cy="90" r="6" fill="var(--brand-accent)" />
                  <text x="156" y="104" fill="var(--brand-accent)" fontSize="8" fontWeight="bold">HOME</text>

                  {/* Courier Car indicator */}
                  <g transform="translate(100, 30)">
                    <circle cx="0" cy="0" r="5" fill="#E05E2B" className="animate-ping" />
                    <circle cx="0" cy="0" r="4.5" fill="#E05E2B" />
                  </g>
                </svg>

                {/* Floating Map tooltip */}
                <div className="absolute bottom-3 left-3 bg-white border shadow-md rounded-lg px-2.5 py-1 text-[10px] font-bold text-neutral-700 uppercase tracking-wide select-none">
                  Transit: Market to Doorstep
                </div>
              </div>
            </div>

            {/* Accordion list details */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs select-none">
              <button
                onClick={() => setItemsExpanded(!itemsExpanded)}
                className="flex items-center justify-between w-full text-xs font-bold text-neutral-600 uppercase tracking-wider hover:text-neutral-900 transition-colors cursor-pointer focus-ring rounded-md"
              >
                <span>Items in Order</span>
                {itemsExpanded ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
              </button>

              <AnimatePresence>
                {itemsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-neutral-100 overflow-hidden"
                  >
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium truncate max-w-[200px]">
                          {item.name} <strong className="text-neutral-400 font-normal">x{item.quantity}</strong>
                        </span>
                        <span className="font-mono text-neutral-800">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold text-neutral-800">
                      <span>Total Paid</span>
                      <span className="font-mono">{formatPrice(order.total)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Help Button support trigger */}
            <Link
              href="/help"
              className="w-full flex items-center justify-center gap-1.5 h-11 border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 shadow-xs cursor-pointer select-none transition-colors focus-ring"
            >
              <ShieldQuestion className="w-4.5 h-4.5 text-brand-primary" aria-hidden="true" />
              <span>Need Help with Order?</span>
            </Link>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
