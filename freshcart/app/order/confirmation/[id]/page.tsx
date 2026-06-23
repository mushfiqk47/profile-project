"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Check, Clipboard, ClipboardCheck, Compass, ArrowRight, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/lib/store/user";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/lib/types";

interface ConfirmationPageProps {
  params: { id: string };
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = params;
  const { toast } = useToast();
  const { orders } = useUserStore();

  const [copied, setCopied] = React.useState(false);

  const order = useMemo(() => {
    return orders.find((o) => o.id === id);
  }, [orders, id]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast("Order ID copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const getETA = () => {
    if (!order) return "Arriving shortly";
    if (order.deliveryMethod === "Express") {
      return "Arriving in 30 minutes";
    }
    if (order.deliveryMethod === "Standard") {
      return "Arriving in 2-4 hours";
    }
    return `Scheduled for ${order.deliveryMethod}`;
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

  // Animation variants
  const checkVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1, transition: { duration: 0.5, ease: "easeInOut" } }
  } as const;

  const containerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", damping: 15 } }
  } as const;

  return (
    <PageWrapper className="py-12 select-none text-center max-w-2xl">
      <div className="flex flex-col items-center gap-6">
        
        {/* Animated Checkmark Circle */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-20 h-20 bg-brand-primary/10 border border-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary relative"
        >
          <svg className="w-10 h-10 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3">
            <motion.path
              variants={checkVariants}
              initial="hidden"
              animate="visible"
              d="M20 6L9 17L4 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-display font-extrabold text-neutral-900 leading-tight">
            Order Confirmed!
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">
            Thank you for shopping local with FreshCart.
          </p>
        </div>

        {/* Monospace Order ID Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs w-full flex items-center justify-between gap-4 text-left">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Order Reference</span>
            <code className="text-sm font-mono font-extrabold text-neutral-900 mt-1 block select-all">
              {id}
            </code>
          </div>
          <button
            onClick={handleCopyId}
            className="p-2 border rounded-lg hover:bg-neutral-50 transition-colors text-neutral-500 hover:text-brand-primary cursor-pointer focus-ring"
            aria-label="Copy order ID"
          >
            {copied ? <ClipboardCheck className="w-4 h-4 text-emerald-600 animate-bounce" /> : <Clipboard className="w-4 h-4" />}
          </button>
        </div>

        {/* Delivery / Address Info Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs w-full text-left flex flex-col gap-4">
          
          <div className="flex items-start gap-3 text-xs border-b pb-3.5">
            <MapPin className="w-5 h-5 text-brand-accent mt-0.5" />
            <div>
              <strong className="text-neutral-800 text-sm uppercase font-display block">Delivery Destination</strong>
              <p className="text-neutral-600 font-semibold mt-1">
                {order.deliveryAddress}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <Calendar className="w-5 h-5 text-brand-accent mt-0.5" />
            <div>
              <strong className="text-neutral-800 text-sm uppercase font-display block">Estimated Dispatch</strong>
              <p className="text-brand-primary font-bold text-sm mt-1">
                {getETA()}
              </p>
            </div>
          </div>

        </div>

        {/* Order Items Summary */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs w-full text-left">
          <strong className="text-neutral-800 text-sm uppercase font-display block mb-3">Item Summary</strong>
          <div className="flex flex-col gap-2.5 max-h-36 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-xs">
                <span className="text-neutral-600 font-medium">
                  {item.name} <strong className="text-neutral-400 font-normal">x{item.quantity}</strong>
                </span>
                <span className="font-mono text-neutral-800">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3.5 mt-3 flex justify-between items-end">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Paid</span>
            <span className="text-lg font-mono font-extrabold text-neutral-900">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <Link
            href={`/order/track/${id}`}
            className="flex-1 h-12 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-colors text-center"
          >
            <Compass className="w-4 h-4 animate-spin" />
            <span>Track Delivery Live</span>
          </Link>
          
          <Link
            href="/shop"
            className="flex-grow-0 sm:px-6 h-12 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </PageWrapper>
  );
}
