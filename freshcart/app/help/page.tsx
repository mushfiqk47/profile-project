"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, MessageSquare, Phone, Mail, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export default function HelpPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const faqs: FAQItem[] = [
    {
      category: "Delivery",
      q: "How does the 30-minute Express Delivery work?",
      a: "Our Express Delivery dispatch option assigns a personal shopper immediately to pick items from your neighborhood market and drop them at your doorstep in insulation bags within 30 minutes. Surcharge of ৳120 applies."
    },
    {
      category: "Delivery",
      q: "Where do you deliver? Do you cover my area?",
      a: "We currently deliver across Dhaka City, covering areas like Gulshan, Banani, Dhanmondi, Lalmatia, and Uttara. Enter your delivery address on the homepage or checkout steps to check coverage!"
    },
    {
      category: "Delivery",
      q: "Is there a minimum spend limit for free delivery?",
      a: "Yes! Standard Same-Day delivery (2-4 hours) is completely free on any order of ৳1,500 or more. For smaller orders, a standard fee of ৳60 is applied."
    },
    {
      category: "Orders",
      q: "What is your Freshness Guarantee?",
      a: "We guarantee 100% fresh, ripe produce. Our couriers inspect every item. If any crop arrives damaged or subpar, tap 'Need Help' on the order tracking page, and we will issue an immediate refund or replacement."
    },
    {
      category: "Orders",
      q: "Can I make changes to my order after placing it?",
      a: "Once an order status is marked as 'Confirmed' or 'Being Packed', we cannot alter items because they are already being gathered by the shopper. You can cancel orders before packing starts by visiting your order tracking portal."
    },
    {
      category: "Payments",
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD) as well as Mobile Financial Services (MFS) including bKash, Nagad, and Rocket. We also accept local and international debit/credit cards (Visa, Mastercard, American Express)."
    },
    {
      category: "Payments",
      q: "Are my payment details secure?",
      a: "Absolutely. FreshCart uses secure SSLCommerz gateways and SSL encryptions. We do not store credit card credentials or wallet PINs on our servers. Mobile transactions are completed securely through official MFS APIs."
    },
    {
      category: "Account",
      q: "How do I add a new default delivery address?",
      a: "Log into your account, visit your Profile settings, and scroll to 'Saved Addresses'. Click 'Add New', input details, and save. You can choose default locations there or directly during checkout."
    }
  ];

  const categories = ["All", "Delivery", "Orders", "Payments", "Account"];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = activeCategory === "All" || faq.category === activeCategory;
      const matchSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col gap-10 pb-16 select-none text-left">
      
      {/* 1. Branded search hero */}
      <section className="bg-brand-primary text-white py-16 border-b relative overflow-hidden">
        {/* Background mesh */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80')"
          }}
        />
        <PageWrapper className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto gap-4">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#FAF9F6] leading-tight">
            How can we help you?
          </h1>
          <p className="text-xs text-neutral-300 leading-relaxed font-medium">
            Search our FAQ database or inspect category folders below.
          </p>

          {/* FAQ search bar */}
          <div className="w-full relative flex items-center mt-2">
            <Search className="absolute left-3.5 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setExpandedIndex(null); // Reset accordions
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-hidden text-neutral-800 shadow-md font-semibold"
            />
          </div>
        </PageWrapper>
      </section>

      {/* 2. Categorization and FAQ list */}
      <section>
        <PageWrapper className="max-w-3xl mx-auto flex flex-col gap-6">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto pb-1 border-b gap-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedIndex(null);
                }}
                className={cn(
                  "px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap",
                  activeCategory === cat
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-3 mt-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedIndex(isOpen ? null : idx)}
                      className="flex items-center justify-between w-full p-4 text-xs font-bold text-neutral-800 hover:text-brand-primary text-left cursor-pointer transition-colors"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown className={cn("w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-neutral-50/50 border-t border-neutral-100 overflow-hidden"
                        >
                          <div className="p-4 text-xs text-neutral-500 leading-relaxed font-medium">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-neutral-400 py-10 font-semibold">
                No matching FAQ topics found. Try typing another search term.
              </p>
            )}
          </div>

        </PageWrapper>
      </section>

      {/* 3. Direct contacts section */}
      <section className="border-t pt-10">
        <PageWrapper className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-display font-bold text-neutral-900 mb-2">Still need help?</h2>
          <p className="text-xs text-neutral-400 font-medium mb-8 uppercase tracking-widest">Contact our desk</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Live Chat */}
            <div className="bg-white border p-5 rounded-2xl flex flex-col items-center text-center shadow-xs">
              <MessageSquare className="w-6 h-6 text-brand-primary mb-3" />
              <strong className="text-xs font-bold text-neutral-800">24/7 Live Chat</strong>
              <p className="text-[10px] text-neutral-400 leading-normal mt-1 mb-4">
                Chat with a helper agent directly inside the application.
              </p>
              <button
                onClick={() => toast("Live chat module starting shortly...", "info")}
                className="mt-auto h-8 px-4 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-white cursor-pointer transition-all"
              >
                Start Chat
              </button>
            </div>

            {/* Phone support */}
            <div className="bg-white border p-5 rounded-2xl flex flex-col items-center text-center shadow-xs">
              <Phone className="w-6 h-6 text-brand-primary mb-3" />
              <strong className="text-xs font-bold text-neutral-800">Phone Support</strong>
              <p className="text-[10px] text-neutral-400 leading-normal mt-1 mb-4">
                Speak directly to our desk staff. Available 6 AM – 11 PM.
              </p>
              <a
                href="tel:+8809612373742"
                className="mt-auto inline-flex items-center justify-center h-8 px-4 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-white cursor-pointer transition-all"
              >
                +880 9612-373742
              </a>
            </div>

            {/* Email Support */}
            <div className="bg-white border p-5 rounded-2xl flex flex-col items-center text-center shadow-xs">
              <Mail className="w-6 h-6 text-brand-primary mb-3" />
              <strong className="text-xs font-bold text-neutral-800">Email Tickets</strong>
              <p className="text-[10px] text-neutral-400 leading-normal mt-1 mb-4">
                Send us a message and we'll reply within 2 hours.
              </p>
              <a
                href="mailto:support@freshcart.com.bd"
                className="mt-auto inline-flex items-center justify-center h-8 px-4 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-white cursor-pointer transition-all"
              >
                support@freshcart.com.bd
              </a>
            </div>

          </div>
        </PageWrapper>
      </section>

    </div>
  );
}
