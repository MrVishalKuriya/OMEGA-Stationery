import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  CartItem,
  StoreConfig,
  StockStatus,
  CustomerOrderInput,
  DemoOrderRecord,
  Language,
  UserProfile,
} from '../types/store';
import { INITIAL_PRODUCTS, INITIAL_STORE_CONFIG } from '../data/products';
import { supabase } from '../lib/supabase';
import {
  createSession,
  getActiveSession,
  destroySession,
  SessionData,
} from '../utils/cookieSession';

const STORAGE_KEYS = {
  PRODUCTS: 'omega_products_v2',
  CONFIG: 'omega_config_v2',
  CART: 'omega_cart_v2',
  ORDERS: 'omega_orders_v2',
  WISHLIST: 'omega_wishlist_v2',
  CURRENT_USER: 'omega_auth_user_v2',
  USERS_DB: 'omega_registered_users_v2',
};

export interface DetailedCartItem {
  product: Product;
  quantity: number;
  effectiveUnitPrice: number;
  lineTotal: number;
}

interface StoreContextType {
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
  deleteProduct: (productId: string) => void;
  updateProductPrice: (productId: string, price: number, discountPrice?: number) => void;
  updateProductStock: (productId: string, stockStatus: StockStatus) => void;
  resetProductsToDefault: () => void;
  updateStoreConfig: (partial: Partial<StoreConfig>) => void;
  resetStoreConfigToDefault: () => void;
  recordDemoOrder: (input: CustomerOrderInput) => DemoOrderRecord;
}


const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PRODUCTS) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CONFIG) : null;
      if (saved) {
        return { ...INITIAL_STORE_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORE_CONFIG;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CART) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [
      { productId: 'prod-omega-cb-q2', quantity: 2 },
      { productId: 'prod-omega-ex-200sl', quantity: 5 },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.WISHLIST) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return ['prod-omega-cb-q3', 'prod-omega-bahasha-a4'];
  });

  const [demoOrders, setDemoOrders] = useState<DemoOrderRecord[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ORDERS) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('omega_language_v2') : null;
      if (saved === 'en' || saved === 'sw') return saved;
    } catch {
      // Fallback
    }
    return 'en';
  });

  const [activePhoneIndex, setActivePhoneIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to extract clean user initials
  const extractInitials = (nameStr: string): string => {
    const parts = (nameStr || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'OM';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // User Authentication & Session State
  const [activeSession, setActiveSession] = useState<SessionData | null>(() => {
    return getActiveSession();
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CURRENT_USER) : null;
      if (saved) return JSON.parse(saved);
      const session = getActiveSession();
      if (session) {
        return {
          id: session.userId,
          name: session.userName,
          email: session.userEmail,
          accountType: (session.accountType as any) || 'individual',
          initials: extractInitials(session.userName),
        };
      }
    } catch {
      // Fallback
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState<boolean>(false);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openCookiePreferences = () => setIsCookieBannerOpen(true);
  const closeCookiePreferences = () => setIsCookieBannerOpen(false);

  const logout = () => {
    setCurrentUser(null);
    setActiveSession(null);
    destroySession();
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch {
      // Ignore
    }
    showToast('Signed out of OMEGA Account');
  };

  const login = async ({
    email,
    password,
    rememberMe = true,
  }: {
    email: string;
    password?: string;
    rememberMe?: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your email or phone number.' };
    }


    // 1. Attempt Supabase Auth
    try {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (!error && data?.user) {
          const profile: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'OMEGA Member',
            email: data.user.email || trimmedEmail,
            initials: extractInitials(data.user.user_metadata?.name || data.user.email || 'OM'),
            accountType: data.user.user_metadata?.accountType || 'individual',
            phone: data.user.user_metadata?.phone,
          };
          const session = createSession(profile, rememberMe);
          setActiveSession(session);
          setCurrentUser(profile);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
          closeAuthModal();
          showToast(`Welcome back, ${profile.name}!`);
          return { success: true };
        }
      }
    } catch {
      // Supabase unavailable, gracefully fall back to local users DB
    }

    // 2. Local Users DB Fallback
    try {
      const usersDbRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      const usersDb: (UserProfile & { password?: string })[] = usersDbRaw ? JSON.parse(usersDbRaw) : [];

      const found = usersDb.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (found) {
        if (password && found.password && found.password !== password) {
          return { success: false, error: 'Incorrect password. Please verify and try again.' };
        }
        const profile: UserProfile = {
          id: found.id,
          name: found.name,
          email: found.email,
          phone: found.phone,
          accountType: found.accountType || 'individual',
          initials: found.initials || extractInitials(found.name),
        };
        const session = createSession(profile, rememberMe);
        setActiveSession(session);
        setCurrentUser(profile);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
        closeAuthModal();
        showToast(`Welcome back, ${profile.name}!`);
        return { success: true };
      }

      // Demo login shortcut or default seed account
      if (trimmedEmail.includes('demo') || trimmedEmail === 'mussa.juma@omega.co.tz' || !password) {
        const demoProfile: UserProfile = {
          id: 'usr-omega-demo',
          name: 'Mussa Juma',
          email: trimmedEmail,
          phone: '+255 715 268 391',
          accountType: 'wholesale',
          initials: 'MJ',
        };
        const session = createSession(demoProfile, rememberMe);
        setActiveSession(session);
        setCurrentUser(demoProfile);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(demoProfile));
        closeAuthModal();
        showToast(`Signed in as ${demoProfile.name}!`);
        return { success: true };
      }


      return {
        success: false,
        error: 'No account found with this email. Please click "Create Account" below to register.',
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    accountType?: 'individual' | 'wholesale' | 'school';
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = (userData.email || '').trim().toLowerCase();
    const trimmedName = (userData.name || '').trim();

    if (!trimmedName || !trimmedEmail) {
      return { success: false, error: 'Please enter both your name and email address.' };
    }

    // 1. Attempt Supabase Auth Sign Up
    try {
      if (userData.password) {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: userData.password,
          options: {
            data: {
              name: trimmedName,
              phone: userData.phone,
              accountType: userData.accountType || 'individual',
            },
          },
        });
        if (!error && data?.user) {
          const profile: UserProfile = {
            id: data.user.id,
            name: trimmedName,
            email: trimmedEmail,
            phone: userData.phone,
            accountType: userData.accountType || 'individual',
            initials: extractInitials(trimmedName),
          };
          const session = createSession(profile, true);
          setActiveSession(session);
          setCurrentUser(profile);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
          closeAuthModal();
          showToast(`Account created! Welcome to OMEGA, ${trimmedName}.`);
          return { success: true };
        }
      }
    } catch {
      // Supabase offline, fallback to local store
    }

    // 2. Local Users DB Registration
    try {
      const usersDbRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      const usersDb: (UserProfile & { password?: string })[] = usersDbRaw ? JSON.parse(usersDbRaw) : [];

      if (usersDb.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const newProfile: UserProfile & { password?: string } = {
        id: `usr-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        phone: userData.phone || '+255 715 000 000',
        accountType: userData.accountType || 'individual',
        initials: extractInitials(trimmedName),
        password: userData.password,
        createdAt: new Date().toISOString(),
      };

      usersDb.push(newProfile);
      localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));

      const cleanProfile: UserProfile = {
        id: newProfile.id,
        name: newProfile.name,
        email: newProfile.email,
        phone: newProfile.phone,
        accountType: newProfile.accountType,
        initials: newProfile.initials,
        createdAt: newProfile.createdAt,
      };

      const session = createSession(cleanProfile, true);
      setActiveSession(session);
      setCurrentUser(cleanProfile);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(cleanProfile));
      closeAuthModal();
      showToast(`Welcome to OMEGA Stationery, ${cleanProfile.name}!`);
      return { success: true };

    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create account.' };
    }
  };

  // Modal / Drawer UI states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);


  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('omega_language_v2', lang);
    } catch {
      // Ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // Ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(storeConfig));
    } catch {
      // Ignore
    }
  }, [storeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
    } catch {
      // Ignore
    }
  }, [demoOrders]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const clearToast = () => setToastMessage(null);

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed "${product ? product.name : 'Item'}" from wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Added "${product ? product.name : 'Item'}" to your wishlist ❤️`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared.');
  };

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

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { productId, quantity: Math.max(1, Math.min(99, quantity)) }];
    });

    showToast(`Added ${quantity} × ${product.name} to cart.`);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    if (product) {
      showToast(`Removed "${product.name}" from cart.`);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(99, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast('Shopping cart cleared.');
  };

  const addProduct = (newProd: Omit<Product, 'id'>): Product => {
    const created: Product = {
      ...newProd,
      id: `prod-custom-${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Added product "${created.name}" to demo catalog.`);
    return created;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated "${updated.name}".`);
  };

  const deleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    if (target) {
      showToast(`Removed "${target.name}" from demo catalog.`);
    }
  };

  const updateProductPrice = (productId: string, price: number, discountPrice?: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              price: Math.max(1, price),
              discountPrice:
                discountPrice && discountPrice > 0 && discountPrice < price
                  ? discountPrice
                  : undefined,
            }
          : p
      )
    );
    showToast('Updated product price in demo catalog.');
  };

  const updateProductStock = (productId: string, stockStatus: StockStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockStatus } : p))
    );
    showToast(`Stock status updated to "${stockStatus}".`);
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    showToast('Reset all 35 products to initial demo catalog.');
  };

  const updateStoreConfig = (partial: Partial<StoreConfig>) => {
    setStoreConfig((prev) => ({
      ...prev,
      ...partial,
    }));
    showToast('Store configuration updated in local browser storage.');
  };

  const resetStoreConfigToDefault = () => {
    setStoreConfig(INITIAL_STORE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    showToast('Store branding and contact placeholders reset to defaults.');
  };

  const recordDemoOrder = (input: CustomerOrderInput): DemoOrderRecord => {
    const deliveryFee =
      input.fulfillmentType === 'In-Store Pickup' ? 0 : estimatedDelivery;
    const record: DemoOrderRecord = {
      ...input,
      orderReference: `OMG-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      items: detailedCart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.effectiveUnitPrice,
        lineTotal: item.lineTotal,
      })),
      subtotal,
      deliveryFee,
      totalAmount: subtotal + deliveryFee,
    };

    setDemoOrders((prev) => [record, ...prev]);
    return record;
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
        setIsCartDrawerOpen,
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
        openCookiePreferences,
        closeCookiePreferences,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductPrice,
        updateProductStock,
        resetProductsToDefault,
        updateStoreConfig,
        resetStoreConfigToDefault,
        recordDemoOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};
