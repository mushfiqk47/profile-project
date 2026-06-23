import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  mobileFiltersOpen: boolean;
  activeCategory: string;
  addressModalOpen: boolean;
  cardModalOpen: boolean;

  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileFiltersOpen: (open: boolean) => void;
  setActiveCategory: (cat: string) => void;
  setAddressModalOpen: (open: boolean) => void;
  setCardModalOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  mobileFiltersOpen: false,
  activeCategory: "all",
  addressModalOpen: false,
  cardModalOpen: false,

  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileFiltersOpen: (open) => set({ mobileFiltersOpen: open }),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setAddressModalOpen: (open) => set({ addressModalOpen: open }),
  setCardModalOpen: (open) => set({ cardModalOpen: open }),
}));
