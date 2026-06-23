"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Check,
  Leaf, 
  Egg, 
  Beef, 
  Wheat, 
  CupSoda, 
  Container, 
  Cookie, 
  Apple, 
  Snowflake, 
  Store
} from "lucide-react";

const iconRegistry: Record<string, React.ComponentType<any>> = {
  Leaf,
  Egg,
  Beef,
  Wheat,
  CupSoda,
  Container,
  Cookie,
  Apple,
  Snowflake,
  Sparkles,
  Heart,
  Store
};
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import ProductCarousel from "@/components/product/ProductCarousel";
import { useUserStore } from "@/lib/store/user";
import { useToast } from "@/components/ui/Toast";
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import { Product } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, addresses, activeAddressId } = useUserStore();
  
  const [addressInput, setAddressInput] = useState("");
  const activeAddress = addresses.find((addr) => addr.id === activeAddressId);

  // Set default address input if user is logged in
  useEffect(() => {
    if (activeAddress) {
      setAddressInput(`${activeAddress.street}, ${activeAddress.city}`);
    }
  }, [activeAddress]);

  // Flash Deals Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 59 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) {
      toast("Please enter a delivery address", "error");
      return;
    }
    toast(`Delivery zone checked for: ${addressInput}`, "success");
    router.push("/shop");
  };

  // Filter collections
  const saleProducts = (products as Product[]).filter((p) => p.originalPrice && p.originalPrice > p.price);
  const organicProducts = (products as Product[]).filter((p) => p.tags.includes("Organic"));
  const localProducts = (products as Product[]).filter((p) => p.tags.includes("Local"));
  const dinnersProducts = (products as Product[]).filter(
    (p) => p.category === "meat-seafood" || p.category === "frozen-foods" || p.category === "bakery"
  ).slice(0, 10);

  return (
    <div className="flex flex-col gap-12 pb-16 select-none">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-[#13382B] text-[#FAF9F6] overflow-hidden select-none">
        
        {/* Background Image Overlay with blur and opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80')"
          }}
        />

        {/* Hero Content Wrapper */}
        <PageWrapper className="relative z-10 flex flex-col items-center text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-4xl"
          >
            
            {/* Eyebrow badge */}
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-accent/25 border border-brand-accent/20 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-accent mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Neighborhood Grocery Delivery
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.05] mb-6">
              The finest organic groceries, delivered in <span className="text-brand-accent italic">30 minutes</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-[60ch] leading-relaxed mb-8">
              Hand-picked organic crops, fresh local fish & meat, organic dairy, parathas, and pantry staples sourced directly from farms across Bangladesh.
            </p>

            {/* Address input form */}
            <form
              onSubmit={handleAddressSubmit}
              className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-neutral-200 rounded-2xl md:rounded-full shadow-lg mb-8"
            >
              <div className="flex items-center gap-2 flex-1 w-full pl-3 py-1">
                <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your delivery address..."
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full text-neutral-800 text-sm bg-transparent border-none p-0 focus:ring-0 placeholder-neutral-400"
                />
              </div>
              
              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-6 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold rounded-xl md:rounded-full cursor-pointer transition-all flex items-center justify-center gap-1.5 flex-shrink-0 shadow-xs"
              >
                <span>Check Coverage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-neutral-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-accent stroke-[3]" />
                2,000+ Hand-Picked Products
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-accent stroke-[3]" />
                Zero-Carbon Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-accent stroke-[3]" />
                No Order Minimums
              </span>
            </div>

          </motion.div>
        </PageWrapper>
      </section>

      {/* 2. Category Grid */}
      <section className="py-6 select-none">
        <PageWrapper>
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900">
                Explore the Aisles
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                Browse our fresh categories hand-picked for quality.
              </p>
            </div>
            
            {/* Category Cards Carousel/Grid */}
            <div
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 md:overflow-visible"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {categories.map((cat) => {
                const IconComponent = iconRegistry[cat.icon] || Leaf;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex flex-col items-center p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300 snap-start text-center min-w-[110px] flex-shrink-0 md:min-w-0 focus-ring"
                    style={{ backgroundColor: cat.color }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xs border border-neutral-200/30 mb-3 transition-transform duration-300 hover:scale-110">
                      <IconComponent className="w-6 h-6 text-brand-primary" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-800 leading-snug uppercase tracking-wider block text-center max-w-full break-words">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* 3. Flash Deals Section */}
      <section className="py-4 select-none">
        <PageWrapper>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
            
            {/* Flash Deal Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <span className="bg-[#E05E2B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm animate-pulse">
                  Flash deals
                </span>
                <h3 className="text-lg font-display font-bold text-neutral-900">
                  Offers of the Day
                </h3>
              </div>
              
              {/* Timer */}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-800">
                <Clock className="w-4 h-4 text-brand-accent animate-spin" />
                <span>Ends in:</span>
                <span className="bg-neutral-100 border px-2 py-1 rounded-md text-brand-accent">
                  {timeLeft.hours.toString().padStart(2, "0")}h
                </span>
                <span>:</span>
                <span className="bg-neutral-100 border px-2 py-1 rounded-md text-brand-accent">
                  {timeLeft.minutes.toString().padStart(2, "0")}m
                </span>
                <span>:</span>
                <span className="bg-neutral-100 border px-2 py-1 rounded-md text-brand-accent">
                  {timeLeft.seconds.toString().padStart(2, "0")}s
                </span>
              </div>
            </div>

            <ProductCarousel products={saleProducts} title="" seeAllHref="/shop" />

          </div>
        </PageWrapper>
      </section>

      {/* 4. Featured Collections */}
      <section className="py-4 select-none">
        <PageWrapper className="flex flex-col gap-10">
          <ProductCarousel products={organicProducts} title="Organic Curations" subtitle="Certified organic, pesticide-free fresh crops." seeAllHref="/shop" />
          <ProductCarousel products={localProducts} title="Direct From Local Farms" subtitle="Sourced from trusted growers in Savar, Narsingdi, and Bogura." seeAllHref="/shop" />
          <ProductCarousel products={dinnersProducts} title="Bangladeshi Dinner Staples" subtitle="Padma Ilish, local Rui fish, parathas, and cooking essentials." seeAllHref="/shop" />
        </PageWrapper>
      </section>

      {/* 5. How It Works Explainer */}
      <section className="py-12 bg-neutral-100 border-y border-neutral-200/50 select-none">
        <PageWrapper className="text-center">
          <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 mb-2">
            Freshness in 3 Simple Steps
          </h2>
          <p className="text-xs text-neutral-400 font-medium mb-12 uppercase tracking-widest">
            How FreshCart works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-display font-extrabold text-xl mb-4 border border-brand-primary/25">
                01
              </div>
              <h3 className="text-sm font-bold text-neutral-800 mb-2">Fill Your Cart</h3>
              <p className="text-xs text-neutral-500 max-w-[28ch] leading-relaxed">
                Browse our selection of fresh organic crops, farm meats, and cupboard essentials.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-display font-extrabold text-xl mb-4 border border-brand-primary/25">
                02
              </div>
              <h3 className="text-sm font-bold text-neutral-800 mb-2">Set Your Window</h3>
              <p className="text-xs text-neutral-500 max-w-[28ch] leading-relaxed">
                Pick 30-min express dispatch, standard same-day, or schedule slots up to 7 days ahead.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-display font-extrabold text-xl mb-4 border border-brand-primary/25">
                03
              </div>
              <h3 className="text-sm font-bold text-neutral-800 mb-2">Fresh to Your Door</h3>
              <p className="text-xs text-neutral-500 max-w-[28ch] leading-relaxed">
                Your courier hand-picks items and dispatches them in cold insulation bags straight to your home.
              </p>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* 6. Active Promotions Banner */}
      <section className="py-6 select-none">
        <PageWrapper>
          <div className="bg-[#FAF9F6] border border-neutral-300 rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-brand-primary text-white rounded-2xl border flex-shrink-0">
                <Sparkles className="w-8 h-8 fill-brand-accent text-brand-accent" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest leading-none mb-1 block">
                  Limited time offer
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 leading-snug">
                  Get 20% off your first neighborhood order
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-[45ch] leading-normal font-medium">
                  Use coupon code <strong className="text-brand-primary font-mono">FRESH20</strong> at checkout on orders of ৳1,500 or more.
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="w-full md:w-auto h-11 px-6 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 flex-shrink-0 shadow-xs uppercase tracking-wide"
            >
              <span>Activate Coupon</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </PageWrapper>
      </section>

    </div>
  );
}
