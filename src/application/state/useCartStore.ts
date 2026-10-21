import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/store';

interface CartState {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isTrackingModalOpen: boolean;
  quickViewProduct: Product | null;
  
  // Actions
  addToCart: (productId: string, quantity?: number, isWholesale?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
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
      isCartOpen: false,
      isTrackingModalOpen: false,
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

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      setIsTrackingModalOpen: (isOpen) => set({ isTrackingModalOpen: isOpen }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
    }),
    {
      name: 'omega_cart_zustand_v1',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
