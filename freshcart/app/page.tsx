"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  ArrowRight, 
  Clock, 
  Heart,
  Sparkles, 
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
      
      {/* 1. Hero Section — Editorial Split */}
      <section className="relative w-full min-h-[92vh] flex items-center bg-[#13382B] text-[#FAF9F6] overflow-hidden select-none">

        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#13382B] via-[#1a4a38] to-[#0E2C22]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px]" />
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <PageWrapper className="relative z-10 w-full py-16 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[75vh]">

            {/* ── Left Column: Copy + CTA ── */}
            <div className="flex flex-col gap-8 text-left">
              {/* Eyebrow */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-accent/15 border border-brand-accent/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-brand-accent">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Dhaka&apos;s Premium Grocery Delivery
                </span>
              </motion.div>

              {/* Headline — staggered word reveal */}
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-display font-extrabold tracking-tight leading-[1.08]"
              >
                {["Farm-fresh", "organic", "groceries,", "delivered", "in", ""].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 24, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word === "" ? (
                      <span className="text-brand-accent italic">30 minutes</span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-sm sm:text-base text-neutral-300 max-w-[48ch] leading-relaxed"
              >
                Hand-picked organic crops, fresh Padma Hilsha, local dairy, parathas, and pantry staples — sourced directly from farms across Bangladesh.
              </motion.p>

              {/* Address input form */}
              <motion.form
                onSubmit={handleAddressSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="w-full max-w-lg flex flex-col sm:flex-row items-stretch gap-0 p-1.5 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-center gap-2.5 flex-1 w-full pl-4 py-1">
                  <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your delivery address..."
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    aria-label="Delivery address"
                    className="w-full text-neutral-800 text-sm bg-transparent border-none p-0 focus:ring-0 placeholder-neutral-400 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto h-12 px-7 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold rounded-xl sm:rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Check Coverage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>

              {/* Trust Indicator Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { icon: "2,000+", label: "Fresh Products" },
                  { icon: "30 min", label: "Express Delivery" },
                  { icon: "100%", label: "Organic Certified" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] rounded-xl">
                    <span className="text-sm font-mono font-extrabold text-brand-accent">{item.icon}</span>
                    <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Social Proof Strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="flex items-center gap-3 pt-2"
              >
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-[#13382B] object-cover" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-medium">Loved by <strong className="text-neutral-200">12,400+</strong> Dhaka families</span>
                </div>
              </motion.div>
            </div>

            {/* ── Right Column: Floating Product Showcase ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:flex items-center justify-center h-[600px]"
            >
              {/* Central Glow */}
              <div className="absolute w-[380px] h-[380px] bg-brand-accent/10 rounded-full blur-[80px]" />

              {/* Floating Product Cards */}
              {[
                { img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80", name: "Rajshahi Mangoes", price: "৳599", x: "5%", y: "8%", rotate: -6, delay: 0.6 },
                { img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&auto=format&fit=crop&q=80", name: "Fresh Strawberries", price: "৳479", x: "55%", y: "2%", rotate: 4, delay: 0.8 },
                { img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80", name: "Aarong Dairy Milk", price: "৳95", x: "60%", y: "55%", rotate: -3, delay: 1.0 },
                { img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80", name: "Padma Hilsha", price: "৳1,450", x: "2%", y: "52%", rotate: 5, delay: 1.2 },
                { img: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&auto=format&fit=crop&q=80", name: "Sundarban Honey", price: "৳320", x: "32%", y: "75%", rotate: -4, delay: 1.4 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, rotate: item.rotate - 10 }}
                  animate={{ opacity: 1, y: 0, rotate: item.rotate }}
                  transition={{ delay: item.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute"
                  style={{ left: item.x, top: item.y }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[140px] bg-white/[0.12] backdrop-blur-md border border-white/[0.15] rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <p className="text-[10px] font-bold text-white/90 truncate leading-tight">{item.name}</p>
                    <span className="text-[11px] font-mono font-extrabold text-brand-accent">{item.price}</span>
                  </motion.div>
                </motion.div>
              ))}

              {/* Decorative Rings */}
              <div className="absolute w-[420px] h-[420px] border border-white/[0.04] rounded-full" />
              <div className="absolute w-[320px] h-[320px] border border-white/[0.06] rounded-full" />
            </motion.div>

          </div>
        </PageWrapper>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10" />
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

      {/* 5. How It Works — Connected Timeline */}
      <section className="relative py-20 bg-[#13382B] text-[#FAF9F6] overflow-hidden select-none">
        {/* Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-accent/6 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-white/[0.02] rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>

        <PageWrapper className="relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-accent/15 border border-brand-accent/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-brand-accent mb-5"
            >
              How It Works
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-3"
            >
              Freshness in 3 Simple Steps
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed"
            >
              From farm to your doorstep — fast, fresh, and fuss-free.
            </motion.p>
          </div>

          {/* Timeline Cards — Desktop */}
          <div className="relative hidden md:block">
            {/* Connecting Line */}
            <div className="absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px]">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full bg-gradient-to-r from-brand-accent/40 via-brand-accent/20 to-brand-accent/40 origin-left"
              />
            </div>

            <div className="grid grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Fill Your Cart",
                  desc: "Browse 2,000+ hand-picked organic crops, fresh Padma Hilsha, local dairy, and pantry staples.",
                  icon: (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  ),
                  img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
                  stat: "2,000+",
                  statLabel: "Fresh Products",
                  delay: 0.3,
                },
                {
                  step: "02",
                  title: "Set Your Window",
                  desc: "Choose 30-min express, standard same-day, or schedule delivery slots up to 7 days ahead.",
                  icon: (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80",
                  stat: "30 min",
                  statLabel: "Express ETA",
                  delay: 0.5,
                },
                {
                  step: "03",
                  title: "Fresh to Your Door",
                  desc: "Our courier hand-picks every item, packs in cold insulation bags, and delivers straight home.",
                  icon: (
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  ),
                  img: "https://images.unsplash.com/photo-1566478989037-eec170784dcd?w=400&auto=format&fit=crop&q=80",
                  stat: "100%",
                  statLabel: "Satisfaction",
                  delay: 0.7,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Circle with Image Background */}
                  <div className="relative mb-8">
                    <div className="w-[104px] h-[104px] rounded-full overflow-hidden border-2 border-brand-accent/30 shadow-[0_0_30px_rgba(224,94,43,0.15)] relative">
                      <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-brand-primary/70" />
                    </div>
                    {/* Icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-brand-accent">{item.icon}</div>
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-[11px] font-mono font-extrabold text-white shadow-lg">
                      {item.step}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 w-full transition-all duration-300 group-hover:bg-white/[0.1] group-hover:border-white/[0.12]">
                    <h3 className="text-base font-display font-bold mb-2">{item.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">{item.desc}</p>
                    {/* Stat */}
                    <div className="flex items-center justify-center gap-2 pt-3 border-t border-white/[0.06]">
                      <span className="text-lg font-mono font-extrabold text-brand-accent">{item.stat}</span>
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{item.statLabel}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline Cards — Mobile (Horizontal Scroll) */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
              {[
                {
                  step: "01",
                  title: "Fill Your Cart",
                  desc: "Browse 2,000+ hand-picked organic crops, fresh fish, dairy, and pantry staples.",
                  img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
                  stat: "2,000+",
                  statLabel: "Fresh Products",
                },
                {
                  step: "02",
                  title: "Set Your Window",
                  desc: "Choose 30-min express, standard same-day, or schedule up to 7 days ahead.",
                  img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80",
                  stat: "30 min",
                  statLabel: "Express ETA",
                },
                {
                  step: "03",
                  title: "Fresh to Your Door",
                  desc: "Courier hand-picks, cold-packs, and delivers straight to your home.",
                  img: "https://images.unsplash.com/photo-1566478989037-eec170784dcd?w=400&auto=format&fit=crop&q=80",
                  stat: "100%",
                  statLabel: "Satisfaction",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="min-w-[260px] snap-start bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden flex-shrink-0"
                >
                  {/* Image Header */}
                  <div className="relative h-32 overflow-hidden">
                    <img src={item.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13382B] to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span className="w-7 h-7 bg-brand-accent rounded-full flex items-center justify-center text-[10px] font-mono font-extrabold text-white">{item.step}</span>
                      <span className="text-sm font-display font-bold">{item.title}</span>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-4">
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">{item.desc}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                      <span className="text-base font-mono font-extrabold text-brand-accent">{item.stat}</span>
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{item.statLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-14"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(224,94,43,0.3)] hover:shadow-[0_6px_28px_rgba(224,94,43,0.4)] hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Start Shopping Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </PageWrapper>

        {/* Top & Bottom Gradient Fades */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
      </section>

      {/* 6. Persona Ads — Fresh Food for Every Lifestyle */}

      {/* Ad 1: The Fitness Enthusiast — Split Layout */}
      <section className="py-6 select-none">
        <PageWrapper>
          <div className="relative bg-[#0f2d23] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
              {/* Left: Copy */}
              <div className="flex flex-col justify-center p-8 lg:p-12 text-left relative z-10">
                <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-accent/15 border border-brand-accent/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4">
                    For the Fitness Devoted
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#FAF9F6] leading-tight mb-3">
                    Fuel Your Gains with <span className="text-brand-accent">Farm-Fresh</span> Protein
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-[42ch] mb-6">
                    Pasture-raised eggs, grass-fed milk, organic chicken, and lean cuts — delivered before your post-workout shake.
                  </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}>
                  <Link href="/category/dairy-eggs" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(224,94,43,0.3)] hover:scale-[1.03] active:scale-[0.98]">
                    Shop Protein Picks
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
              {/* Right: Floating Products */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0f2d23]/50 z-10" />
                {[
                  { img: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&auto=format&fit=crop&q=80", name: "Farm Fresh Eggs", price: "৳150", x: "10%", y: "10%", r: -5 },
                  { img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&auto=format&fit=crop&q=80", name: "Grass-Fed Milk", price: "৳707", x: "50%", y: "5%", r: 4 },
                  { img: "https://images.unsplash.com/photo-1587593817642-5999c1a654fb?w=300&auto=format&fit=crop&q=80", name: "Ground Turkey", price: "৳779", x: "55%", y: "55%", r: -3 },
                  { img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop&q=80", name: "Aarong Milk", price: "৳95", x: "5%", y: "55%", r: 6 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                    className="absolute"
                    style={{ left: item.x, top: item.y }}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-[120px] bg-white/[0.1] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-2 shadow-[0_6px_24px_rgba(0,0,0,0.3)]"
                      style={{ transform: `rotate(${item.r}deg)` }}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-1.5">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <p className="text-[9px] font-bold text-white/90 truncate">{item.name}</p>
                      <span className="text-[10px] font-mono font-extrabold text-brand-accent">{item.price}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Ad 2: The Busy Mom — Full-Width Banner with Floating Cards */}
      <section className="py-6 select-none">
        <PageWrapper>
          <div className="relative rounded-3xl overflow-hidden min-h-[380px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#13382B]/95 via-[#13382B]/80 to-[#13382B]/40" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 lg:p-12 min-h-[380px]">
              {/* Left Copy */}
              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4">
                  For the Busy Parent
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#FAF9F6] leading-tight mb-3">
                  Dinner Sorted in <span className="text-brand-accent">30 Minutes</span>
                </h2>
                <p className="text-xs text-neutral-300 leading-relaxed mb-6 max-w-[40ch]">
                  Parathas, frozen veggies, fresh fish, and ready-to-cook packs — everything a busy family needs, delivered same-day.
                </p>
                <Link href="/category/frozen-foods" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(224,94,43,0.3)] hover:scale-[1.03] active:scale-[0.98]">
                  Shop Family Essentials
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Right: Product Strip */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex gap-3 overflow-x-auto md:overflow-visible scrollbar-none pb-2 md:pb-0">
                {[
                  { img: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop&q=80", name: "Kazi Farms Paratha", price: "৳160", tag: "Best Seller" },
                  { img: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=300&auto=format&fit=crop&q=80", name: "Frozen Blueberries", price: "৳587", tag: "Organic" },
                  { img: "https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=300&auto=format&fit=crop&q=80", name: "Fresh Rui Fish", price: "৳450", tag: "Local" },
                  { img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80", name: "Stone Baked Pizza", price: "৳1,079", tag: "New" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="min-w-[140px] flex-shrink-0 bg-white/[0.1] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-2.5 snap-start"
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-brand-accent text-white text-[8px] font-bold uppercase rounded-sm">{item.tag}</span>
                    </div>
                    <p className="text-[10px] font-bold text-white/90 truncate">{item.name}</p>
                    <span className="text-[11px] font-mono font-extrabold text-brand-accent">{item.price}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Ad 3: The Home Chef — 3-Column Feature Grid */}
      <section className="py-6 select-none">
        <PageWrapper>
          <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
            {/* Top Banner */}
            <div className="bg-[#1C1E1B] p-8 text-center">
              <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-accent/15 border border-brand-accent/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-3">
                For the Home Chef
              </motion.span>
              <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-2xl md:text-3xl font-display font-extrabold text-[#FAF9F6] leading-tight mb-2">
                Authentic Bangladeshi Flavors, <span className="text-brand-accent">Always Fresh</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xs text-neutral-400 max-w-md mx-auto">
                Radhuni spices, pure mustard oil, Chinigura rice, and sundry fresh herbs — the backbone of every deshi kitchen.
              </motion.p>
            </div>
            {/* 3-Column Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&auto=format&fit=crop&q=80",
                  title: "Pure Mustard Oil",
                  desc: "Cold-pressed Radhuni mustard oil for authentic tempering and cooking.",
                  price: "৳180",
                  products: [
                    { name: "Radhuni Mustard Oil", img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=100&auto=format&fit=crop&q=80" },
                    { name: "Rupchanda Soybean", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=100&auto=format&fit=crop&q=80" },
                  ],
                },
                {
                  img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80",
                  title: "Radhuni Spices",
                  desc: "Freshly ground turmeric, chili, and cumin powders for rich curry color.",
                  price: "৳90",
                  products: [
                    { name: "Turmeric Powder", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&auto=format&fit=crop&q=80" },
                    { name: "Chili Powder", img: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=100&auto=format&fit=crop&q=80" },
                  ],
                },
                {
                  img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80",
                  title: "Chinigura Rice",
                  desc: "Aromatic Kalijira rice, perfect for payesh, pulao, and biryani.",
                  price: "৳160",
                  products: [
                    { name: "Chinigura Rice", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&auto=format&fit=crop&q=80" },
                    { name: "Masoor Dal", img: "https://images.unsplash.com/photo-1566478989037-eec170784dcd?w=100&auto=format&fit=crop&q=80" },
                  ],
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="p-6 border-t md:border-t-0 md:border-r border-neutral-100 last:border-r-0 group cursor-pointer hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <h3 className="text-sm font-display font-bold text-neutral-900 mb-1">{item.title}</h3>
                  <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-mono font-extrabold text-brand-primary">From {item.price}</span>
                  </div>
                  {/* Mini product pair */}
                  <div className="flex gap-2">
                    {item.products.map((p, j) => (
                      <div key={j} className="flex items-center gap-1.5 bg-neutral-100 rounded-lg px-2 py-1.5">
                        <img src={p.img} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                        <span className="text-[9px] font-bold text-neutral-600 truncate max-w-[70px]">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Ad 4: The Budget Shopper — Savings Spotlight */}
      <section className="py-6 select-none">
        <PageWrapper>
          <div className="relative bg-gradient-to-br from-brand-accent via-[#c64f20] to-[#a34018] rounded-3xl overflow-hidden min-h-[360px]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 min-h-[360px] items-center">
              {/* Left: Copy */}
              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-4">
                  For the Budget Conscious
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white leading-tight mb-3">
                  Save More on <span className="text-white/80">Every Basket</span>
                </h2>
                <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-[42ch]">
                  Flash deals, bundle discounts, and promo codes that stretch your taka further. Smart shopping starts here.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/promotions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-accent text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all duration-200 hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] shadow-lg">
                    View All Coupons
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all duration-200 hover:bg-white/20">
                    Shop Deals
                  </Link>
                </div>
              </motion.div>

              {/* Right: Deal Cards */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col gap-3">
                {[
                  { code: "FRESH20", discount: "20% OFF", desc: "First order · Min ৳1,500", color: "bg-white/15 border-white/20" },
                  { code: "DESHI200", discount: "৳200 OFF", desc: "Local farm picks · Min ৳2,500", color: "bg-white/10 border-white/15" },
                  { code: "FREESHIP", discount: "FREE DELIVERY", desc: "No delivery fee · Min ৳1,500", color: "bg-white/10 border-white/15" },
                ].map((deal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.12 }}
                    className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm ${deal.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-mono font-extrabold text-white">{deal.discount}</span>
                      <div>
                        <span className="text-[10px] font-bold text-white/80 block">{deal.desc}</span>
                      </div>
                    </div>
                    <code className="text-[10px] font-mono font-bold text-white/60 bg-white/10 px-2 py-1 rounded">{deal.code}</code>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* 7. Active Promotions Banner */}
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
