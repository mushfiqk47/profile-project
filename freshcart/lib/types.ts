export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  weight: string;
  image: string;
  description: string;
  inStock: boolean;
  tags: string[];
  nutritionalInfo: {
    servingSize: string;
    calories: number;
    totalFat: string;
    sodium: string;
    totalCarbohydrates: string;
    sugars: string;
    protein: string;
  } | null;
  variants: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed" | "shipping";
  value: number;
  minSpend: number;
  expiryDate: string;
  terms: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

export interface Address {
  id: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  instructions?: string;
  isDefault?: boolean;
}

export interface PaymentCard {
  id: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
  brand: string; // Visa, Mastercard, Amex, Apple Pay, etc.
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "Pending" | "Being Packed" | "Out for Delivery" | "Delivered" | "Cancelled";
  deliveryMethod: "Standard" | "Express" | "Scheduled";
  deliveryAddress: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    weight: string;
    image: string;
  }[];
}
