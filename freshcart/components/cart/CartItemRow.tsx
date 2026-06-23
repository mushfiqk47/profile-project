"use client";

import React from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/lib/types";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import QuantityInput from "@/components/ui/QuantityInput";
import { useToast } from "@/components/ui/Toast";

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { toast } = useToast();
  const { product, quantity, selectedVariant } = item;
  
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const handleQtyChange = (val: number) => {
    updateQuantity(product.id, selectedVariant, val);
  };

  const handleRemove = () => {
    updateQuantity(product.id, selectedVariant, 0); // Setting quantity to 0 removes the item
    toast(`Removed ${product.name} from your shopping bag`, "info");
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-b-0 select-none">
      
      {/* Thumbnail */}
      <Link
        href={`/product/${product.id}`}
        className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200 cursor-pointer bg-neutral-50"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Name, size, and price */}
      <div className="flex-1 min-w-0">
        <Link href={`/product/${product.id}`} className="cursor-pointer">
          <h4 className="text-xs font-bold text-neutral-800 truncate hover:text-brand-primary transition-colors">
            {product.name}
          </h4>
        </Link>
        <span className="text-[10px] text-neutral-400 block mt-0.5 leading-none">
          {product.brand} · {selectedVariant}
        </span>
        <span className="text-xs font-mono font-bold text-neutral-900 mt-1 block">
          {formatPrice(product.price * quantity)}
        </span>
      </div>

      {/* Stepper & Delete */}
      <div className="flex items-center gap-2">
        <QuantityInput
          value={quantity}
          onChange={handleQtyChange}
          size="sm"
        />
        
        <button
          onClick={handleRemove}
          className="p-1.5 text-neutral-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer focus-ring"
          aria-label={`Remove ${product.name} from bag`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
