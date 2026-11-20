import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/store';

interface CartState {
  cart: CartItem[];
  wishlist: string[];
  compareProductIds: string[];
  isCartOpen: boolean;
  isTrackingModalOpen: boolean;
  isCompareModalOpen: boolean;
  quickViewProduct: Product | null;
  
  // Actions
  addToCart: (productId: string, quantity?: number, isWholesale?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare (up to 2 OMEGA stationery items side-by-side)
  toggleCompareProduct: (productId: string) => void;
  openCompareWithProduct: (productId: string) => void;
  setCompareProductAtSlot: (slotIndex: 0 | 1, productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompareProducts: () => void;
  isInCompare: (productId: string) => boolean;
  setIsCompareModalOpen: (isOpen: boolean) => void;
  
  // Modals
  openCart: () => void;
  closeCart: () => void;
  setIsTrackingModalOpen: (isOpen: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      compareProductIds: [],
      isCartOpen: false,
      isTrackingModalOpen: false,
      isCompareModalOpen: false,
      quickViewProduct: null,

      addToCart: (productId, quantity = 1, isWholesale = false) => {
        set((state) => {
          const existing = state.cart.find((item) => item.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isCartOpen: isWholesale ? state.isCartOpen : true,
            };
          }
          return {
            cart: [...state.cart, { productId, quantity }],
            isCartOpen: isWholesale ? state.isCartOpen : true,
          };
        });
      },

      updateCartQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              cart: state.cart.filter((item) => item.productId !== productId),
            };
          }
          return {
            cart: state.cart.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      toggleCompareProduct: (productId) => {
        set((state) => {
          const exists = state.compareProductIds.includes(productId);
          if (exists) {
            return {
              compareProductIds: state.compareProductIds.filter((id) => id !== productId),
            };
          }
          // Keep up to 2 selected products
          const next =
            state.compareProductIds.length >= 2
              ? [state.compareProductIds[1], productId]
              : [...state.compareProductIds, productId];
          return {
            compareProductIds: next,
          };
        });
      },

      openCompareWithProduct: (productId) => {
        set((state) => {
          const exists = state.compareProductIds.includes(productId);
          let next = state.compareProductIds;
          if (!exists) {
            next =
              state.compareProductIds.length >= 2
                ? [state.compareProductIds[0], productId]
                : [...state.compareProductIds, productId];
          }
          return {
            compareProductIds: next,
            isCompareModalOpen: true,
          };
        });
      },

      setCompareProductAtSlot: (slotIndex, productId) => {
        set((state) => {
          const current = [...state.compareProductIds];
          // Avoid duplicate in the other slot
          const otherSlot = slotIndex === 0 ? 1 : 0;
          if (current[otherSlot] === productId) {
            // Swap them
            const prevInTarget = current[slotIndex];
            current[slotIndex] = productId;
            if (prevInTarget) {
              current[otherSlot] = prevInTarget;
            }
          } else {
            current[slotIndex] = productId;
          }
          return {
            compareProductIds: current.filter(Boolean).slice(0, 2),
          };
        });
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          compareProductIds: state.compareProductIds.filter((id) => id !== productId),
        }));
      },

      clearCompareProducts: () => {
        set({ compareProductIds: [] });
      },

      isInCompare: (productId) => {
        return get().compareProductIds.includes(productId);
      },

      setIsCompareModalOpen: (isOpen) => set({ isCompareModalOpen: isOpen }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      setIsTrackingModalOpen: (isOpen) => set({ isTrackingModalOpen: isOpen }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
    }),
    {
      name: 'omega_cart_zustand_v1',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        compareProductIds: state.compareProductIds,
      }),
    }
  )
);
