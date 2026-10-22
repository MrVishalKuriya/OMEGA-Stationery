import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import {
  Product,
  CartItem,
  StoreConfig,
  StockStatus,
  CustomerOrderInput,
  DemoOrderRecord,
  Language,
  UserProfile,
} from '@/types/store';
import { SessionData } from '@/utils/cookieSession';
import {
  BACKEND_URL,
  BackendHealthData,
  checkBackendHealth,
  subscribeServerWaking,
  getIsServerWaking,
  submitOrderToBackend,
  bulkUpdateProductsInDb,
} from '@/services/api';
import { useCartStore } from '@/application/state/useCartStore';
import { useAuthStore } from '@/application/state/useAuthStore';
import { useConfigStore } from '@/application/state/useConfigStore';
import { useProductsQuery } from '@/application/hooks/useProductsQuery';

export interface DetailedCartItem {
  product: Product;
  quantity: number;
  effectiveUnitPrice: number;
  lineTotal: number;
}

export interface StoreContextType {
  products: Product[];
  storeConfig: StoreConfig;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  activePhoneIndex: number;
  setActivePhoneIndex: (idx: number) => void;
  cart: CartItem[];
  detailedCart: DetailedCartItem[];
  demoOrders: DemoOrderRecord[];
  cartItemCount: number;
  subtotal: number;
  estimatedDelivery: number;
  cartTotal: number;
  toastMessage: string | null;
  clearToast: () => void;
  showToast: (msg: string) => void;
  addToCart: (productId: string, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Wishlist feature
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  // Drawers & Modals
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isWishlistModalOpen: boolean;
  setIsWishlistModalOpen: (open: boolean) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  // User Authentication & Session
  currentUser: UserProfile | null;
  activeSession: SessionData | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (credentials: { email: string; password?: string; rememberMe?: boolean }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    accountType?: 'individual' | 'wholesale' | 'school';
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  // Cookie & Privacy Center
  isCookieBannerOpen: boolean;
  openCookiePreferences: () => void;
  closeCookiePreferences: () => void;
  // Catalog Management
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string, options?: { skipDb?: boolean }) => void;
  restoreProduct: (product: Product, targetIndex?: number) => void;
  updateProductPrice: (productId: string, price: number, discountPrice?: number, wholesalePrice?: number) => void;
  updateProductStock: (productId: string, stockStatus: StockStatus, stockQuantity?: number) => void;
  resetProductsToDefault: () => void;
  updateStoreConfig: (partial: Partial<StoreConfig>) => void;
  resetStoreConfigToDefault: () => void;
  recordDemoOrder: (input: CustomerOrderInput) => DemoOrderRecord;
  // High-Performance Node.js + MongoDB Backend
  backendUrl: string;
  isBackendOnline: boolean;
  backendHealth: BackendHealthData | null;
  refreshBackendHealth: () => Promise<void>;
  reloadCatalogFromDb: () => Promise<{ success: boolean; count: number }>;
  reloadConfigFromDb: () => Promise<void>;
  bulkUpdateProducts: (payload: {
    action: 'adjust_price' | 'set_stock';
    ids?: string[];
    percentage?: number;
    stockStatus?: string;
  }) => Promise<boolean>;
  isCatalogLoading: boolean;
  isServerWakingUp: boolean;
  retryConnection: () => Promise<void>;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. TanStack React Query for Products
  const {
    products,
    isLoading: isCatalogLoading,
    createProduct: createProductInQuery,
    updateProduct: updateProductInQuery,
    updateStock: updateStockInQuery,
    updatePrice: updatePriceInQuery,
    deleteProduct: deleteProductInQuery,
    refetch: refetchProducts,
  } = useProductsQuery();

  // 2. Zustand Cart & Wishlist Store
  const {
    cart,
    wishlist,
    isCartOpen: isCartDrawerOpen,
    isTrackingModalOpen,
    quickViewProduct,
    addToCart: zustandAddToCart,
    updateCartQuantity,
    removeFromCart: zustandRemoveFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
    openCart,
    closeCart,
    setIsTrackingModalOpen,
    setQuickViewProduct,
  } = useCartStore();

  // 3. Zustand Auth Store
  const {
    currentUser,
    activeSession,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
  } = useAuthStore();

  // 4. Zustand Config Store
  const {
    storeConfig,
    language,
    toastMessage,
    setLanguage,
    updateStoreConfig,
    resetStoreConfigToDefault,
    showToast,
    clearToast,
    syncConfigFromDb,
  } = useConfigStore();

  // UI state
  const [activePhoneIndex, setActivePhoneIndex] = useState(0);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState(false);
  const [demoOrders, setDemoOrders] = useState<DemoOrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('omega_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Backend Health Telemetry
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [backendHealth, setBackendHealth] = useState<BackendHealthData | null>(null);
  const [isServerWakingUp, setIsServerWakingUp] = useState<boolean>(getIsServerWaking());

  useEffect(() => {
    const unsub = subscribeServerWaking((isWaking) => {
      setIsServerWakingUp(isWaking);
    });
    return unsub;
  }, []);

  // Periodic Backend Health Check
  const refreshBackendHealth = async () => {
    try {
      const res = await checkBackendHealth();
      setIsBackendOnline(res.online);
      if (res.data) setBackendHealth(res.data);
    } catch {
      setIsBackendOnline(false);
    }
  };

  useEffect(() => {
    refreshBackendHealth();
    syncConfigFromDb();
  }, []);

  // Language toggle
  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'sw' : language === 'sw' ? 'gu' : 'en';
    setLanguage(nextLang);
    showToast(
      nextLang === 'sw'
        ? 'Lugha imebadilishwa kuwa Kiswahili'
        : nextLang === 'gu'
        ? 'ભાષા ગુજરાતીમાં બદલાઈ ગઈ (Switched to Gujarati)'
        : 'Language switched to English'
    );
  };

  // Detailed Cart Calculation with useMemo
  const detailedCart = useMemo<DetailedCartItem[]>(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const effectiveUnitPrice =
          product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
            ? product.discountPrice
            : product.price;
        return {
          product,
          quantity: item.quantity,
          effectiveUnitPrice,
          lineTotal: effectiveUnitPrice * item.quantity,
        };
      })
      .filter((x): x is DetailedCartItem => x !== null);
  }, [cart, products]);

  const cartItemCount = useMemo(
    () => detailedCart.reduce((acc, item) => acc + item.quantity, 0),
    [detailedCart]
  );

  const subtotal = useMemo(
    () => detailedCart.reduce((acc, item) => acc + item.lineTotal, 0),
    [detailedCart]
  );

  const estimatedDelivery = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal >= storeConfig.freeDeliveryThreshold) return 0;
    return storeConfig.standardDeliveryFee;
  }, [subtotal, storeConfig.freeDeliveryThreshold, storeConfig.standardDeliveryFee]);

  const cartTotal = subtotal + estimatedDelivery;

  const addToCart = (productId: string, quantity = 1, openDrawer = true) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (product.stockStatus === 'Out of Stock') {
      showToast(`"${product.name}" is currently marked Out of Stock.`);
      return;
    }
    zustandAddToCart(productId, quantity, !openDrawer);
    showToast(`Added ${quantity} × ${product.name} to cart.`);
  };

  const removeFromCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    zustandRemoveFromCart(productId);
    if (product) {
      showToast(`Removed "${product.name}" from cart.`);
    }
  };

  const clearWishlist = () => {
    showToast('Wishlist cleared.');
  };

  // Product CRUD wrappers
  const addProduct = (newProd: Omit<Product, 'id'>): Product => {
    const created: Product = {
      ...newProd,
      id: `prod-custom-${Date.now()}`,
    };
    createProductInQuery(created);
    showToast(`Added product "${created.name}".`);
    return created;
  };

  const updateProduct = (updated: Product) => {
    updateProductInQuery(updated);
    showToast(`Updated "${updated.name}".`);
  };

  const deleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    deleteProductInQuery(productId);
    zustandRemoveFromCart(productId);
    if (target) {
      showToast(`Removed "${target.name}".`);
    }
  };

  const restoreProduct = (product: Product) => {
    updateProductInQuery(product);
    showToast(`Restored "${product.name}".`);
  };

  const updateProductPrice = (productId: string, price: number, discountPrice?: number, wholesalePrice?: number) => {
    updatePriceInQuery({ id: productId, price, discountPrice, wholesalePrice });
    showToast('Price updated.');
  };

  const updateProductStock = (productId: string, stockStatus: StockStatus, stockQuantity?: number) => {
    updateStockInQuery({ id: productId, stockStatus, stockQuantity });
    showToast(`Stock status updated to "${stockStatus}".`);
  };

  const resetProductsToDefault = () => {
    refetchProducts();
    showToast('Catalog reloaded from database.');
  };

  const reloadCatalogFromDb = async () => {
    const res = await refetchProducts();
    return { success: true, count: res.data?.length || 0 };
  };

  const reloadConfigFromDb = async () => {
    await syncConfigFromDb();
  };

  const bulkUpdateProducts = async (payload: {
    action: 'adjust_price' | 'set_stock';
    ids?: string[];
    percentage?: number;
    stockStatus?: string;
  }): Promise<boolean> => {
    const res = await bulkUpdateProductsInDb(payload);
    if (res.success) {
      await refetchProducts();
      showToast(res.message || 'Bulk product update applied successfully.');
      return true;
    }
    showToast(`Bulk update notice: ${res.message || 'Operation failed'}`);
    return false;
  };

  const recordDemoOrder = (input: CustomerOrderInput): DemoOrderRecord => {
    const newRecord: DemoOrderRecord = {
      ...input,
      orderReference: `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      items: detailedCart.map((it) => ({
        productId: it.product.id,
        name: it.product.name,
        sku: it.product.sku,
        quantity: it.quantity,
        unitPrice: it.effectiveUnitPrice,
        lineTotal: it.lineTotal,
      })),
      subtotal,
      deliveryFee: estimatedDelivery,
      totalAmount: cartTotal,
    };

    setDemoOrders((prev) => {
      const next = [newRecord, ...prev];
      try {
        localStorage.setItem('omega_orders_v2', JSON.stringify(next));
      } catch {}
      return next;
    });

    submitOrderToBackend(newRecord).catch((err) => {
      console.warn('Backend order submission notice:', err);
    });

    clearCart();
    return newRecord;
  };

  const retryConnection = async () => {
    await refreshBackendHealth();
    await refetchProducts();
    await syncConfigFromDb();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        storeConfig,
        language,
        setLanguage,
        toggleLanguage,
        activePhoneIndex,
        setActivePhoneIndex,
        cart,
        detailedCart,
        demoOrders,
        cartItemCount,
        subtotal,
        estimatedDelivery,
        cartTotal,
        toastMessage,
        clearToast,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen: (open) => (open ? openCart() : closeCart()),
        isWishlistModalOpen,
        setIsWishlistModalOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        currentUser,
        activeSession,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        isCookieBannerOpen,
        openCookiePreferences: () => setIsCookieBannerOpen(true),
        closeCookiePreferences: () => setIsCookieBannerOpen(false),
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        updateProductPrice,
        updateProductStock,
        resetProductsToDefault,
        updateStoreConfig,
        resetStoreConfigToDefault,
        recordDemoOrder,
        backendUrl: BACKEND_URL,
        isBackendOnline,
        backendHealth,
        refreshBackendHealth,
        reloadCatalogFromDb,
        reloadConfigFromDb,
        bulkUpdateProducts,
        isCatalogLoading,
        isServerWakingUp,
        retryConnection,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { useStore } from './useStore';
