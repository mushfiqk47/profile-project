import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Address, PaymentCard, Order } from "@/lib/types";
import initialOrders from "@/data/orders.json";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface UserState {
  user: UserProfile | null;
  addresses: Address[];
  paymentMethods: PaymentCard[];
  favorites: string[]; // Product IDs
  orders: Order[];
  activeAddressId: string | null;
  activeCardId: string | null;

  login: (name: string, email: string, phone?: string) => void;
  signup: (name: string, email: string, phone?: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  addAddress: (address: Omit<Address, "id">) => void;
  editAddress: (id: string, updated: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setActiveAddress: (id: string) => void;

  addPaymentCard: (card: Omit<PaymentCard, "id">) => void;
  removePaymentCard: (id: string) => void;
  setActiveCard: (id: string) => void;

  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  addOrder: (order: Order) => void;
}

const defaultAddresses: Address[] = [
  {
    id: "addr-1",
    street: "Road 11, House 45",
    apartment: "Flat 4A, Gulshan-2",
    city: "Dhaka",
    state: "Dhaka",
    zip: "1212",
    instructions: "Deliver near Gulshan Lake Park. Call before arriving.",
    isDefault: true
  },
  {
    id: "addr-2",
    street: "Lalmatia Block C, House 12/A",
    apartment: "Flat 2B",
    city: "Dhaka",
    state: "Dhaka",
    zip: "1207",
    instructions: "Leave with the ground floor reception/security guard.",
    isDefault: false
  }
];

const defaultCards: PaymentCard[] = [
  {
    id: "card-cod",
    cardNumber: "Cash Payment at Door",
    expiry: "COD",
    cvv: "COD",
    nameOnCard: "Cash on Delivery",
    brand: "Cash",
    isDefault: true
  },
  {
    id: "card-bkash",
    cardNumber: "01712-***678",
    expiry: "MFS",
    cvv: "bKash",
    nameOnCard: "bKash Personal Wallet",
    brand: "bKash",
    isDefault: false
  },
  {
    id: "card-1",
    cardNumber: "•••• •••• •••• 4242",
    expiry: "12/28",
    cvv: "***",
    nameOnCard: "Mushfiq Rahman",
    brand: "Visa",
    isDefault: false
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: {
        name: "Mushfiq Rahman",
        email: "mushfiq@freshcart.com.bd",
        phone: "01712-345678",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      },
      addresses: defaultAddresses,
      paymentMethods: defaultCards,
      favorites: ["prod-1", "prod-3", "prod-8", "prod-14"],
      orders: initialOrders as Order[],
      activeAddressId: "addr-1",
      activeCardId: "card-cod",

      login: (name, email, phone) => {
        set({
          user: {
            name,
            email,
            phone: phone || "",
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
          }
        });
      },

      signup: (name, email, phone) => {
        set({
          user: {
            name,
            email,
            phone: phone || "",
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
          }
        });
      },

      logout: () => {
        set({
          user: null,
          favorites: [],
          activeAddressId: null,
          activeCardId: null
        });
      },

      updateProfile: (profile) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...profile } });
      },

      addAddress: (address) => {
        const id = `addr-${Math.random().toString(36).substring(2, 9)}`;
        const newAddress = { ...address, id, isDefault: get().addresses.length === 0 };
        const addresses = [...get().addresses, newAddress];
        
        set({ 
          addresses,
          activeAddressId: get().activeAddressId || id
        });
      },

      editAddress: (id, updated) => {
        const addresses = get().addresses.map((addr) => {
          if (addr.id === id) {
            return { ...addr, ...updated };
          }
          return addr;
        });
        set({ addresses });
      },

      removeAddress: (id) => {
        const addresses = get().addresses.filter((addr) => addr.id !== id);
        let activeId = get().activeAddressId;
        if (activeId === id) {
          activeId = addresses.length > 0 ? addresses[0].id : null;
        }
        set({ addresses, activeAddressId: activeId });
      },

      setActiveAddress: (id) => {
        set({ activeAddressId: id });
      },

      addPaymentCard: (card) => {
        const id = `card-${Math.random().toString(36).substring(2, 9)}`;
        const newCard = { ...card, id, isDefault: get().paymentMethods.length === 0 };
        const paymentMethods = [...get().paymentMethods, newCard];
        
        set({ 
          paymentMethods,
          activeCardId: get().activeCardId || id
        });
      },

      removePaymentCard: (id) => {
        const paymentMethods = get().paymentMethods.filter((card) => card.id !== id);
        let activeId = get().activeCardId;
        if (activeId === id) {
          activeId = paymentMethods.length > 0 ? paymentMethods[0].id : null;
        }
        set({ paymentMethods, activeCardId: activeId });
      },

      setActiveCard: (id) => {
        set({ activeCardId: id });
      },

      toggleFavorite: (productId) => {
        const favorites = [...get().favorites];
        const index = favorites.indexOf(productId);
        if (index > -1) {
          favorites.splice(index, 1);
        } else {
          favorites.push(productId);
        }
        set({ favorites });
      },

      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },

      addOrder: (order) => {
        set({
          orders: [order, ...get().orders]
        });
      }
    }),
    {
      name: "freshcart-user-profile",
      partialize: (state) => ({
        user: state.user,
        addresses: state.addresses,
        paymentMethods: state.paymentMethods,
        favorites: state.favorites,
        orders: state.orders,
        activeAddressId: state.activeAddressId,
        activeCardId: state.activeCardId,
      }),
    }
  )
);
