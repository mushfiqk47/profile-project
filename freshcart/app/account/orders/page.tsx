"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Receipt, Heart, Settings, LogOut, Compass, ArrowRight, Package } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { useUserStore } from "@/lib/store/user";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import productsData from "@/data/products.json";
import { Product, Order } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

export default function OrderHistoryPage() {
  const { toast } = useToast();
  const { orders } = useUserStore();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUiStore((state) => state.setCartOpen);

  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Delivered" | "Cancelled">("All");

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return order.status !== "Delivered" && order.status !== "Cancelled";
    return order.status === activeTab;
  });

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      // Find full product info
      const fullProd = (productsData as Product[]).find((p) => p.id === item.productId);
      if (fullProd && fullProd.inStock) {
        addItem(fullProd, item.weight);
      }
    });

    toast("All available items from this order added to bag!", "success");
    setCartOpen(true);
  };

  const menuItems = [
    { label: "Profile & Settings", href: "/account", icon: Settings },
    { label: "My Orders", href: "/account/orders", icon: Receipt, active: true },
    { label: "Favorites", href: "/account/favorites", icon: Heart },
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

        {/* Orders list container */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-neutral-900 leading-tight">
              Order History
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Review and reorder from your past neighborhood grocery purchases.
            </p>
          </div>

          {/* Filtering tabs */}
          <div className="flex border-b border-neutral-200 select-none pb-1 gap-2">
            {(["All", "Active", "Delivered", "Cancelled"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                  activeTab === tab
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Order Cards Grid */}
          <div className="flex flex-col gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex flex-col gap-3 flex-1">
                    {/* ID and date */}
                    <div className="flex flex-wrap items-center gap-3">
                      <code className="text-xs font-mono font-extrabold text-neutral-900 select-all border rounded px-1.5 py-0.5 bg-neutral-50">
                        #{order.id}
                      </code>
                      <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider rounded px-1.5 py-0.2 select-none border",
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : order.status === "Cancelled"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-brand-primary/10 text-brand-primary border-brand-primary/20 animate-pulse"
                        )}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Previews strip */}
                    <div className="flex items-center gap-2 mt-1">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.productId} className="w-10 h-10 rounded-lg overflow-hidden border bg-neutral-50 relative group">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 border rounded-lg h-10 px-2 flex items-center justify-center select-none font-mono">
                          +{order.items.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Total info */}
                    <div className="text-xs font-medium text-neutral-500 mt-1">
                      Order total: <strong className="text-neutral-900 font-mono font-bold">{formatPrice(order.total)}</strong> · {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} items
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-neutral-100 pt-3 sm:pt-0">
                    <Link
                      href={`/order/track/${order.id}`}
                      className="flex items-center justify-center gap-1 h-9 px-4 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {order.status !== "Cancelled" && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center justify-center gap-1.5 h-9 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Reorder Bag</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl py-12 shadow-xs select-none">
                <EmptyState
                  variant="orders"
                  title="No orders found"
                  description={`You don't have any orders categorized under "${activeTab}" yet.`}
                  action={
                    <Link
                      href="/shop"
                      className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full hover:bg-brand-primary-hover shadow-xs inline-block focus-ring"
                    >
                      Go to Market
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
