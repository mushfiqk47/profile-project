"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, Check, Plus, AlertCircle, ChevronDown, Star } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import ProductCarousel from "@/components/product/ProductCarousel";
import PriceDisplay from "@/components/ui/PriceDisplay";
import RatingStars from "@/components/ui/RatingStars";
import DeliveryBadge from "@/components/ui/DeliveryBadge";
import QuantityInput from "@/components/ui/QuantityInput";
import { useCartStore } from "@/lib/store/cart";
import { useUserStore } from "@/lib/store/user";
import { useToast } from "@/components/ui/Toast";
import productsData from "@/data/products.json";
import { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const { toast } = useToast();

  const product = useMemo(() => {
    return (productsData as Product[]).find((p) => p.id === slug);
  }, [slug]);

  // Global State
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const { favorites, toggleFavorite } = useUserStore();
  const isFavorited = product ? favorites.includes(product.id) : false;

  // Find cart quantity
  const cartItem = product ? cartItems.find((item) => item.product.id === product.id) : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  // Local Component States
  const [selectedVariant, setSelectedVariant] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [nutritionOpen, setNutritionOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Set default variant and main image when product loads
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || "Standard");
      setMainImage(product.image);
    }
  }, [product]);

  // Mock supporting images for gallery
  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      "https://images.unsplash.com/photo-1596560548464-f01068e3c4eb?w=600&auto=format&fit=crop&q=80", // Organic farming / picking
      "https://images.unsplash.com/photo-1488459718432-01055e67e18a?w=600&auto=format&fit=crop&q=80", // Grocery shelf
      "https://images.unsplash.com/photo-1543083503-43f0ae86ed14?w=600&auto=format&fit=crop&q=80"  // Fresh cut kitchen prep
    ];
  }, [product]);

  // Recommendations
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return (productsData as Product[])
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);
  }, [product]);

  // Mock Frequently Bought Together
  const bundleItems = useMemo(() => {
    if (!product) return [];
    return (productsData as Product[])
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 2);
  }, [product]);

  const [bundleChecked, setBundleChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (bundleItems.length > 0) {
      setBundleChecked({
        [bundleItems[0].id]: true,
        [bundleItems[1].id]: true
      });
    }
  }, [bundleItems]);

  const handleAddAllBundle = () => {
    if (!product) return;
    addItem(product, selectedVariant);
    
    bundleItems.forEach((item) => {
      if (bundleChecked[item.id]) {
        addItem(item, item.variants[0] || "Standard");
      }
    });

    toast("Added selected bundle items to your shopping bag!", "success");
  };

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    setIsAdding(true);
    addItem(product, selectedVariant);
    toast(`Added ${product.name} to your shopping bag!`, "success");
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  if (!product) {
    return (
      <PageWrapper className="py-20 text-center select-none">
        <h1 className="text-2xl font-display font-bold text-neutral-800 mb-4">Product Not Found</h1>
        <p className="text-xs text-neutral-500 mb-6">The product you were looking for doesn't exist.</p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full hover:bg-brand-primary-hover shadow-xs"
        >
          Browse Shop
        </Link>
      </PageWrapper>
    );
  }

  const isDiscounted = product.originalPrice !== undefined && product.originalPrice > product.price;

  return (
    <div className="py-8 select-none flex flex-col gap-12">
      <PageWrapper>
        {/* Breadcrumbs */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-accent uppercase tracking-wider mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Market</span>
        </Link>

        {/* Product Details Split Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: Images */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-neutral-200 bg-white relative">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-4 py-2 bg-neutral-800 text-white font-bold rounded-full text-sm">
                    Temporarily Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Row */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer bg-white transition-all",
                    mainImage === img ? "border-brand-primary" : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <img src={img} alt={`Gallery view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Buy Actions */}
          <div className="flex flex-col gap-6 text-left">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-neutral-900 leading-tight">
                {product.name}
              </h1>
              
              {/* Ratings */}
              <div className="flex items-center gap-3 mt-3">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className="text-neutral-300">|</span>
                <span className="text-xs text-neutral-500 font-semibold cursor-pointer hover:underline">
                  Read Reviews
                </span>
              </div>
            </div>

            {/* Price display block */}
            <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="xl" />
              <div className="mt-3 flex items-center gap-2 border-t border-neutral-100 pt-3">
                <DeliveryBadge type={product.price > 800 ? "express" : "scheduled"} />
                <span className="text-[10px] text-neutral-400 font-medium leading-none">
                  Free shipping on orders above ৳1,500
                </span>
              </div>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Select Pack Size</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        "px-4 py-2 border rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        selectedVariant === v
                          ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-bold"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-white"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Bag Steppers */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              {product.inStock ? (
                <>
                  {quantity > 0 ? (
                    <div className="w-full sm:w-auto">
                      <QuantityInput
                        value={quantity}
                        onChange={(val) => updateQuantity(product.id, selectedVariant, val)}
                        size="lg"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      {isAdding ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3] animate-pulse" />
                          <span>Added to bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to bag · {formatPrice(product.price)}</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Favorite Toggle */}
                  <button
                    onClick={() => {
                      toggleFavorite(product.id);
                      toast(
                        isFavorited ? `Removed ${product.name} from favorites` : `Saved ${product.name} to favorites`,
                        "info"
                      );
                    }}
                    className={cn(
                      "w-full sm:w-auto p-3.5 border rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer",
                      isFavorited
                        ? "bg-brand-accent text-white border-brand-accent"
                        : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                    <span>{isFavorited ? "Saved" : "Save Favorite"}</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 p-4 bg-neutral-100 border border-neutral-200 rounded-xl w-full">
                  <AlertCircle className="w-5 h-5 text-neutral-400" />
                  <span className="text-xs text-neutral-500 font-semibold">
                    We are temporarily out of stock of this harvest item. Please check back later.
                  </span>
                </div>
              )}
            </div>

            {/* Description & Tags */}
            <div className="border-t border-neutral-200 pt-6 mt-2 flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Description</h4>
                <p className={cn("text-xs text-neutral-500 leading-relaxed font-medium", !descExpanded && "line-clamp-3")}>
                  {product.description}
                </p>
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-xs font-bold text-brand-primary hover:underline mt-1 cursor-pointer"
                >
                  {descExpanded ? "Read less" : "Read more"}
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-500 text-[10px] font-semibold uppercase tracking-wider rounded-sm select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Collapsible Nutrition Facts Accordion */}
            {product.nutritionalInfo && (
              <div className="border-t border-neutral-200 pt-4">
                <button
                  onClick={() => setNutritionOpen(!nutritionOpen)}
                  className="flex items-center justify-between w-full text-xs font-bold text-neutral-700 uppercase tracking-wider cursor-pointer"
                >
                  <span>Nutritional Facts</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", nutritionOpen && "rotate-180")} />
                </button>

                {nutritionOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border border-neutral-200 rounded-xl mt-3 overflow-hidden bg-neutral-50 p-4"
                  >
                    <table className="w-full text-xs text-left text-neutral-600">
                      <tbody>
                        <tr className="border-b border-neutral-200 pb-2 mb-2 font-bold text-neutral-800 text-sm">
                          <td className="py-1">Serving Size</td>
                          <td className="py-1 text-right">{product.nutritionalInfo.servingSize}</td>
                        </tr>
                        <tr className="border-b border-neutral-200">
                          <td className="py-1 font-semibold text-neutral-700">Calories</td>
                          <td className="py-1 text-right font-mono font-bold">{product.nutritionalInfo.calories}</td>
                        </tr>
                        <tr className="border-b border-neutral-200">
                          <td className="py-1 font-semibold text-neutral-700">Total Fat</td>
                          <td className="py-1 text-right font-mono">{product.nutritionalInfo.totalFat}</td>
                        </tr>
                        <tr className="border-b border-neutral-200">
                          <td className="py-1 font-semibold text-neutral-700">Sodium</td>
                          <td className="py-1 text-right font-mono">{product.nutritionalInfo.sodium}</td>
                        </tr>
                        <tr className="border-b border-neutral-200">
                          <td className="py-1 font-semibold text-neutral-700">Total Carbohydrate</td>
                          <td className="py-1 text-right font-mono">{product.nutritionalInfo.totalCarbohydrates}</td>
                        </tr>
                        <tr className="border-b border-neutral-200">
                          <td className="py-1.5 pl-3 text-neutral-500 font-medium">Sugars</td>
                          <td className="py-1.5 text-right font-mono">{product.nutritionalInfo.sugars}</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-semibold text-neutral-700">Protein</td>
                          <td className="py-1.5 text-right font-mono">{product.nutritionalInfo.protein}</td>
                        </tr>
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </div>
            )}

          </div>
        </div>
      </PageWrapper>

      {/* Reviews Below the Fold */}
      <section className="bg-neutral-100 border-y border-neutral-200/50 py-12 select-none text-left">
        <PageWrapper>
          <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 mb-6">
            Customer Reviews
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: rating summary card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-mono font-extrabold text-neutral-900">{product.rating.toFixed(1)}</span>
              <div className="flex text-amber-500 mt-2 mb-1 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4 fill-current", i < Math.floor(product.rating) ? "text-amber-500" : "text-neutral-200")} />
                ))}
              </div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1">
                Based on {product.reviewCount} Ratings
              </span>
            </div>

            {/* Right: Review posts lists */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between gap-4">
                  <strong className="text-sm text-neutral-800 font-bold">Absolutely fresh and juicy!</strong>
                  <div className="flex text-amber-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-2">
                  "Deliveries are always reliable and fast. These apples were crisp and perfectly sweet. Tastes exactly like apple picking in autumn."
                </p>
                <div className="text-[10px] text-neutral-400 font-semibold mt-3 uppercase tracking-wider">
                  Sarah K. · Verified Buyer · June 18, 2026
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between gap-4">
                  <strong className="text-sm text-neutral-800 font-bold">High quality neighborhood goods</strong>
                  <div className="flex text-amber-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("w-3.5 h-3.5 fill-current", i < 4 ? "text-amber-500" : "text-neutral-200")} />)}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-2">
                  "Great packaging. They arrive wrapped in insulated lining to stay cool. Will definitely keep ordering these weekly!"
                </p>
                <div className="text-[10px] text-neutral-400 font-semibold mt-3 uppercase tracking-wider">
                  Marcus L. · Verified Buyer · June 10, 2026
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Frequently Bought Together */}
      {bundleItems.length > 0 && (
        <section className="py-4 select-none text-left">
          <PageWrapper>
            <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 mb-6">
              Frequently Bought Together
            </h2>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4 flex-1">
                {/* Main Product */}
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover border" />
                  <div className="max-w-[150px]">
                    <p className="text-xs font-bold text-neutral-800 truncate">{product.name}</p>
                    <span className="text-xs font-mono text-neutral-600 font-bold">{formatPrice(product.price)}</span>
                  </div>
                </div>

                {bundleItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <span className="text-xl text-neutral-300 font-light">+</span>
                    <div className="flex items-center gap-3 relative">
                      <input
                        type="checkbox"
                        checked={!!bundleChecked[item.id]}
                        onChange={(e) => setBundleChecked({ ...bundleChecked, [item.id]: e.target.checked })}
                        className="w-4 h-4 rounded-md accent-brand-primary border-neutral-300 focus:ring-brand-primary flex-shrink-0 cursor-pointer"
                      />
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border" />
                      <div className="max-w-[150px]">
                        <p className="text-xs font-bold text-neutral-800 truncate">{item.name}</p>
                        <span className="text-xs font-mono text-neutral-600 font-bold">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Total & Action */}
              <div className="border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6 text-center md:text-right flex-shrink-0">
                <span className="text-xs text-neutral-400 font-semibold block uppercase tracking-wider">Bundle Total</span>
                <span className="text-2xl font-mono font-extrabold text-neutral-900 block mt-1">
                  {formatPrice(
                    product.price +
                    bundleItems.reduce((acc, curr) => acc + (bundleChecked[curr.id] ? curr.price : 0), 0)
                  )}
                </span>
                <button
                  onClick={handleAddAllBundle}
                  className="mt-3 w-full px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Bundle to Bag</span>
                </button>
              </div>
            </div>
          </PageWrapper>
        </section>
      )}

      {/* Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="py-4 select-none">
          <PageWrapper>
            <ProductCarousel products={relatedProducts} title="You May Also Like" subtitle="More fresh items in our aisles." />
          </PageWrapper>
        </section>
      )}

    </div>
  );
}
