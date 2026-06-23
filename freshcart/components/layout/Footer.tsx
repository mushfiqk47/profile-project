import React from "react";
import Link from "next/link";
import { Sparkles, MessageCircle } from "lucide-react";
import categories from "@/data/categories.json";

export default function Footer() {
  return (
    <footer className="bg-[#1C1E1B] text-[#FAF9F6] border-t border-neutral-800 pt-16 pb-8 mt-auto select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-2 cursor-pointer focus-ring rounded-md">
              <span className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 fill-brand-accent text-brand-accent" aria-hidden="true" />
                FreshCart
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-[28ch]">
              Premium neighborhood market, delivering fresh local organic produce and grocery essentials to your door in 30 minutes.
            </p>
            <div className="flex items-center gap-4 text-neutral-400 mt-2">
              <a href="#" className="hover:text-brand-accent transition-colors focus-ring rounded-md" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="#" className="hover:text-brand-accent transition-colors focus-ring rounded-md" aria-label="Instagram">
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="hover:text-brand-accent transition-colors focus-ring rounded-md" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="hover:text-brand-accent transition-colors focus-ring rounded-md" aria-label="Support chat">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Shop Categories</h4>
            <ul className="flex flex-col gap-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-neutral-300 hover:text-brand-accent cursor-pointer transition-colors focus-ring rounded-md px-1"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-brand-accent hover:underline cursor-pointer focus-ring rounded-md px-1"
                >
                  Browse All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Services */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">My Account</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/account"
                  className="text-sm text-neutral-300 hover:text-brand-accent cursor-pointer transition-colors focus-ring rounded-md px-1"
                >
                  Profile & Details
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-neutral-300 hover:text-brand-accent cursor-pointer transition-colors focus-ring rounded-md px-1"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/account/favorites"
                  className="text-sm text-neutral-300 hover:text-brand-accent cursor-pointer transition-colors focus-ring rounded-md px-1"
                >
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="text-sm text-neutral-300 hover:text-brand-accent cursor-pointer transition-colors focus-ring rounded-md px-1"
                >
                  Coupons & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Help */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Support & FAQ</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-neutral-300 hover:text-brand-accent cursor-pointer transition-colors focus-ring rounded-md px-1"
                >
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <span className="text-sm text-neutral-400 block">
                  Support Line: <strong className="text-neutral-200 font-mono">1-800-FRESH-NOW</strong>
                </span>
              </li>
              <li>
                <span className="text-sm text-neutral-400 block">
                  Delivery hours: <strong className="text-neutral-200">6:00 AM – 11:00 PM</strong>
                </span>
              </li>
              <li>
                <span className="text-xs text-brand-accent bg-brand-primary/20 border border-brand-primary/30 rounded-md px-2 py-1 inline-block mt-2">
                  🚀 Delivering 30-min in SF Bay
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Panel */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} FreshCart Delivery Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <Link href="/help" className="hover:text-neutral-300 focus-ring rounded-sm px-1">Privacy Policy</Link>
            <Link href="/help" className="hover:text-neutral-300 focus-ring rounded-sm px-1">Terms of Use</Link>
            <Link href="/help" className="hover:text-neutral-300 focus-ring rounded-sm px-1">Coverage Map</Link>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 select-none opacity-55">
            <span className="px-1.5 py-0.5 border border-neutral-800 rounded font-mono font-bold text-[9px] uppercase">bKash</span>
            <span className="px-1.5 py-0.5 border border-neutral-800 rounded font-mono font-bold text-[9px] uppercase">Nagad</span>
            <span className="px-1.5 py-0.5 border border-neutral-800 rounded font-mono font-bold text-[9px] uppercase">Rocket</span>
            <span className="px-1.5 py-0.5 border border-neutral-800 rounded font-mono font-bold text-[9px] uppercase">COD</span>
            <span className="px-1.5 py-0.5 border border-neutral-800 rounded font-mono font-bold text-[9px] uppercase">Visa</span>
            <span className="px-1.5 py-0.5 border border-neutral-800 rounded font-mono font-bold text-[9px] uppercase">MC</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
