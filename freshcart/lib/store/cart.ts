import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem, Promotion } from "@/lib/types";

interface CartState {
  items: CartItem[];
  discountCode: Promotion | null;
  deliveryMethod: "Standard" | "Express" | "Scheduled";
  deliveryFee: number;
  tipAmount: number;
  scheduledSlot: { date: string; time: string } | null;
  
  addItem: (product: Product, variant?: string) => void;
  removeItem: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (promo: Promotion) => void;
  removeDiscount: () => void;
  setTip: (tip: number) => void;
  setDeliveryMethod: (method: "Standard" | "Express" | "Scheduled") => void;
  setScheduledSlot: (slot: { date: string; time: string } | null) => void;

  // Calculators
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryFee: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      deliveryMethod: "Standard",
      deliveryFee: 60,
      tipAmount: 50,
      scheduledSlot: null,

      addItem: (product, variant) => {
        const selectedVariant = variant || product.variants[0] || "Standard";
        const items = [...get().items];
        const existingItemIndex = items.findIndex(
          (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
        );

        if (existingItemIndex > -1) {
          items[existingItemIndex].quantity += 1;
        } else {
          items.push({ product, quantity: 1, selectedVariant });
        }

        set({ items });
      },

      removeItem: (productId, variant) => {
        const items = [...get().items];
        const existingItemIndex = items.findIndex(
          (item) => item.product.id === productId && item.selectedVariant === variant
        );

        if (existingItemIndex > -1) {
          const item = items[existingItemIndex];
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            items.splice(existingItemIndex, 1);
          }
        }

        set({ items });
      },

      updateQuantity: (productId, variant, quantity) => {
        if (quantity <= 0) {
          const items = get().items.filter(
            (item) => !(item.product.id === productId && item.selectedVariant === variant)
          );
          set({ items });
          return;
        }

        const items = get().items.map((item) => {
          if (item.product.id === productId && item.selectedVariant === variant) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ items });
      },

      clearCart: () => {
        set({
          items: [],
          discountCode: null,
          deliveryMethod: "Standard",
          deliveryFee: 60,
          tipAmount: 50,
          scheduledSlot: null,
        });
      },

      applyDiscount: (promo) => {
        set({ discountCode: promo });
      },

      removeDiscount: () => {
        set({ discountCode: null });
      },

      setTip: (tip) => {
        set({ tipAmount: Math.max(0, tip) });
      },

      setDeliveryMethod: (method) => {
        let fee = 60;
        if (method === "Express") {
          fee = 120;
        }
        set({ deliveryMethod: method, deliveryFee: fee });
      },

      setScheduledSlot: (slot) => {
        set({ scheduledSlot: slot });
      },

      // Calculators
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().discountCode;
        if (!promo) return 0;

        if (subtotal < promo.minSpend) return 0;

        if (promo.discountType === "percentage") {
          return parseFloat((subtotal * (promo.value / 100)).toFixed(2));
        } else if (promo.discountType === "fixed") {
          return Math.min(subtotal, promo.value);
        }
        return 0; // for shipping discounts, handled in delivery fee
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        
        // Free shipping for orders over BDT 1500
        if (subtotal >= 1500) return 0;

        const promo = get().discountCode;
        if (promo && promo.discountType === "shipping" && subtotal >= promo.minSpend) {
          return 0;
        }

        return get().deliveryFee;
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const taxable = Math.max(0, subtotal - discount);
        return Math.round(taxable * 0.05); // 5% local VAT
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;

        const discount = get().getDiscountAmount();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTaxAmount();
        const tip = get().tipAmount;

        return Math.round(subtotal - discount + deliveryFee + tax + tip);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "freshcart-shopping-bag",
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        deliveryMethod: state.deliveryMethod,
        deliveryFee: state.deliveryFee,
        tipAmount: state.tipAmount,
        scheduledSlot: state.scheduledSlot,
      }),
    }
  )
);
