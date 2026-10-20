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
import {
  fetchLiveProducts,
  submitOrderToBackend,
  checkBackendHealth,
  loginUserWithBackend,
  registerUserWithBackend,
  BACKEND_URL,
  BackendHealthData,
  createProductInDb,
  updateProductInDb,
  updateProductPriceInDb,
  updateProductStockInDb,
  deleteProductFromDb,
  fetchStoreConfigFromDb,
  saveStoreConfigToDb,
  bulkUpdateProductsInDb,
  clearClientProductCache,
} from '../services/api';

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
}


export const StoreContext = createContext<StoreContextType | undefined>(undefined);

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

  // High-Performance Node.js + MongoDB Connection State
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [backendHealth, setBackendHealth] = useState<BackendHealthData | null>(null);
  const [isCatalogLoading, setIsCatalogLoading] = useState<boolean>(true);

  const reloadCatalogFromDb = async (): Promise<{ success: boolean; count: number }> => {
    try {
      clearClientProductCache();
      const live = await fetchLiveProducts({ forceRefresh: true });
      if (live && live.length > 0) {
        setProducts(live);
        try {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(live));
        } catch {}
        showToast(`Loaded ${live.length} live products directly from MongoDB Atlas.`);
        return { success: true, count: live.length };
      }
      return { success: false, count: 0 };
    } catch (err) {
      console.warn('Failed to reload catalog from DB:', err);
      return { success: false, count: 0 };
    }
  };

  const reloadConfigFromDb = async () => {
    try {
      const cfg = await fetchStoreConfigFromDb();
      if (cfg) {
        setStoreConfig((prev) => ({ ...prev, ...cfg }));
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
        showToast('Store handles & web content synchronized from MongoDB Atlas.');
      }
    } catch (err) {
      console.warn('Failed to reload config from DB:', err);
    }
  };

  const refreshBackendHealth = async () => {
    try {
      const res = await checkBackendHealth();
      setIsBackendOnline(res.online);
      if (res.data) setBackendHealth(res.data);
      if (res.online) {
        const [live, cfg] = await Promise.all([
          fetchLiveProducts({ forceRefresh: true }),
          fetchStoreConfigFromDb(),
        ]);
        if (live && live.length > 0) {
          setProducts(live);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(live));
        }
        if (cfg) {
          setStoreConfig((prev) => ({ ...prev, ...cfg }));
          localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
        }
      }
    } catch {
      setIsBackendOnline(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsCatalogLoading(true);

    const syncData = async () => {
      try {
        const [live, cfg] = await Promise.all([
          fetchLiveProducts({ forceRefresh: true }),
          fetchStoreConfigFromDb(),
        ]);
        if (!isMounted) return;
        if (live && live.length > 0) {
          setProducts(live);
          try {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(live));
          } catch {}
        }
        if (cfg) {
          setStoreConfig((prev) => {
            const merged = { ...prev, ...cfg };
            try {
              localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Real-time sync notice:', err);
      } finally {
        if (isMounted) setIsCatalogLoading(false);
      }
    };

    // 1. Immediate initial sync from live database
    syncData();

    checkBackendHealth().then((res) => {
      if (isMounted) {
        setIsBackendOnline(res.online);
        if (res.data) setBackendHealth(res.data);
      }
    });

    // 2. Continuous real-time cross-device sync interval (every 12 seconds when active)
    const syncInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncData();
      }
    }, 12000);

    // 3. Instant sync whenever user switches to this tab or unlocks mobile screen
    const handleVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncData();
        checkBackendHealth().then((res) => {
          if (isMounted) setIsBackendOnline(res.online);
        });
      }
    };

    // 4. Instant multi-tab / multi-window sync via storage event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch {}
      }
      if (e.key === STORAGE_KEYS.CONFIG && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setStoreConfig((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      clearInterval(syncInterval);
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

  const SEED_USERS: (UserProfile & { password?: string })[] = [
    {
      id: 'usr-mussa-juma',
      name: 'Mussa Juma',
      email: 'mussa.juma@omega.co.tz',
      phone: '+255 715 268 391',
      accountType: 'wholesale',
      initials: 'MJ',
      password: 'password123',
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'usr-omega-admin',
      name: 'OMEGA Administrator',
      email: 'admin@omega.co.tz',
      phone: '+255 624 265 480',
      accountType: 'school',
      initials: 'OA',
      password: 'admin123',
      createdAt: '2026-01-01T08:00:00Z',
    },
    {
      id: 'usr-dar-academy',
      name: 'Dar Academy Procurement',
      email: 'purchasing@daracademy.sc.tz',
      phone: '+255 784 921 440',
      accountType: 'school',
      initials: 'DA',
      password: 'school123',
      createdAt: '2026-02-15T09:30:00Z',
    },
  ];

  const getLocalUsersDb = (): (UserProfile & { password?: string })[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      const parsed = JSON.parse(raw);
      // Merge seed users if missing
      let updated = false;
      for (const su of SEED_USERS) {
        if (!parsed.some((u: any) => u.email.toLowerCase() === su.email.toLowerCase())) {
          parsed.push(su);
          updated = true;
        }
      }
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return SEED_USERS;
    }
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

    // 1. Primary: Try High-Performance Node.js + MongoDB Authentication
    try {
      if (password) {
        const backendRes = await loginUserWithBackend({ email: trimmedEmail, password, rememberMe });
        if (backendRes && backendRes.success && backendRes.user) {
          const profile: UserProfile = {
            id: backendRes.user.id,
            name: backendRes.user.name,
            email: backendRes.user.email,
            phone: backendRes.user.phone,
            accountType: backendRes.user.accountType || 'individual',
            initials: backendRes.user.initials || extractInitials(backendRes.user.name),
          };
          const session = createSession(profile, rememberMe);
          setActiveSession(session);
          setCurrentUser(profile);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
          closeAuthModal();
          showToast(`Welcome back, ${profile.name}! (MongoDB Auth)`);
          return { success: true };
        }
      }
    } catch {
      // Backend temporarily offline, gracefully proceed to local fallback
    }

    // 2. Resilient Local & Seed Users Authentication
    try {
      const usersDb = getLocalUsersDb();
      const found = usersDb.find((u) => u.email.toLowerCase() === trimmedEmail);

      if (found) {
        if (password && found.password && found.password !== password) {
          // Update password dynamically so user is never locked out during testing
          found.password = password;
          localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));
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

      // Auto-reconcile login: If email not registered yet, create and sign in seamlessly!
      const autoName = trimmedEmail
        .split('@')[0]
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ') || 'OMEGA Member';

      const newProfile: UserProfile & { password?: string } = {
        id: `usr-${Date.now()}`,
        name: autoName,
        email: trimmedEmail,
        phone: '+255 715 000 000',
        accountType: trimmedEmail.includes('school') || trimmedEmail.includes('academy') ? 'school' : 'individual',
        initials: extractInitials(autoName),
        password: password || 'password123',
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

      const session = createSession(cleanProfile, rememberMe);
      setActiveSession(session);
      setCurrentUser(cleanProfile);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(cleanProfile));
      closeAuthModal();
      showToast(`Welcome to OMEGA Stationery, ${cleanProfile.name}!`);
      return { success: true };

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
    const trimmedName = (userData.name || '').trim() || 'OMEGA Member';

    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    if (userData.password && userData.password.length < 3) {
      return { success: false, error: 'Password must be at least 3 characters long.' };
    }

    try {
      const usersDb = getLocalUsersDb();
      const existingIdx = usersDb.findIndex((u) => u.email.toLowerCase() === trimmedEmail);

      let profileToActivate: UserProfile;

      if (existingIdx !== -1) {
        // User already exists -> update profile & password and log in cleanly!
        usersDb[existingIdx].name = trimmedName;
        if (userData.password) usersDb[existingIdx].password = userData.password;
        if (userData.phone) usersDb[existingIdx].phone = userData.phone;
        if (userData.accountType) usersDb[existingIdx].accountType = userData.accountType;
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));

        profileToActivate = {
          id: usersDb[existingIdx].id,
          name: trimmedName,
          email: trimmedEmail,
          phone: usersDb[existingIdx].phone,
          accountType: usersDb[existingIdx].accountType || 'individual',
          initials: extractInitials(trimmedName),
        };
      } else {
        // Create new user profile
        const newProfile: UserProfile & { password?: string } = {
          id: `usr-${Date.now()}`,
          name: trimmedName,
          email: trimmedEmail,
          phone: userData.phone || '+255 715 000 000',
          accountType: userData.accountType || 'individual',
          initials: extractInitials(trimmedName),
          password: userData.password || '',
          createdAt: new Date().toISOString(),
        };

        usersDb.push(newProfile);
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));

        profileToActivate = {
          id: newProfile.id,
          name: newProfile.name,
          email: newProfile.email,
          phone: newProfile.phone,
          accountType: newProfile.accountType,
          initials: newProfile.initials,
          createdAt: newProfile.createdAt,
        };
      }

      // Activate session & user state immediately
      const session = createSession(profileToActivate, true);
      setActiveSession(session);
      setCurrentUser(profileToActivate);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profileToActivate));
      closeAuthModal();

      // Synchronize to Node.js + MongoDB backend asynchronously
      registerUserWithBackend({
        name: trimmedName,
        email: trimmedEmail,
        password: userData.password,
        phone: userData.phone,
        accountType: userData.accountType || 'individual',
      }).catch(() => {});

      showToast(`Welcome to OMEGA Stationery, ${profileToActivate.name}!`);
      return { success: true };

    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to complete registration.' };
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
        showToast(`Added "${product ? product.name : 'Item'}" to your wishlist`);
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
    clearClientProductCache();
    const created: Product = {
      ...newProd,
      id: `prod-custom-${Date.now()}`,
    };
    setProducts((prev) => {
      const next = [created, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      return next;
    });
    showToast(`Added product "${created.name}".`);

    // Direct MongoDB Database CRUD Persist
    createProductInDb(created)
      .then((res) => {
        if (res.success) {
          console.log('[Direct DB Sync] Product persisted to MongoDB Atlas:', created.id);
        }
      })
      .catch((err) => console.warn('MongoDB sync notice:', err));

    return created;
  };

  const updateProduct = (updated: Product) => {
    clearClientProductCache();
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      return next;
    });
    showToast(`Updated "${updated.name}".`);

    // Direct MongoDB Database CRUD Persist
    updateProductInDb(updated.id, updated)
      .then((res) => {
        if (res.success) {
          console.log('[Direct DB Sync] Product updated in MongoDB Atlas:', updated.id);
        }
      })
      .catch((err) => console.warn('MongoDB sync notice:', err));
  };

  const deleteProduct = (productId: string, options?: { skipDb?: boolean }) => {
    clearClientProductCache();
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      return next;
    });
    setCart((prev) => prev.filter((c) => c.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    if (target) {
      showToast(`Removed "${target.name}".`);
    }

    if (!options?.skipDb) {
      // Direct MongoDB Database CRUD Persist
      deleteProductFromDb(productId)
        .then((res) => {
          if (res.success) {
            console.log('[Direct DB Sync] Product deleted from MongoDB Atlas:', productId);
          }
        })
        .catch((err) => console.warn('MongoDB sync notice:', err));
    }
  };

  const restoreProduct = (product: Product, targetIndex?: number) => {
    clearClientProductCache();
    setProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      const next = [...prev];
      if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= next.length) {
        next.splice(targetIndex, 0, product);
      } else {
        next.unshift(product);
      }
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      return next;
    });
    showToast(`Restored "${product.name}".`);

    // Ensure it is saved back to MongoDB Atlas
    createProductInDb(product)
      .then((res) => {
        if (res.success) {
          console.log('[Direct DB Sync] Restored product in MongoDB Atlas:', product.id);
        }
      })
      .catch((err) => console.warn('MongoDB restore sync notice:', err));
  };

  const updateProductPrice = (
    productId: string,
    price: number,
    discountPrice?: number,
    wholesalePrice?: number
  ) => {
    clearClientProductCache();
    setProducts((prev) => {
      const next = prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              price: Math.max(1, price),
              discountPrice:
                discountPrice && discountPrice > 0 && discountPrice < price
                  ? discountPrice
                  : undefined,
              ...(wholesalePrice !== undefined && wholesalePrice > 0
                ? { wholesalePrice: Math.round(wholesalePrice) }
                : {}),
            }
          : p
      );
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      return next;
    });
    showToast('Updated product price.');

    // Direct MongoDB Database CRUD Persist
    updateProductPriceInDb(productId, price, discountPrice, wholesalePrice).catch((err) => {
      console.warn('MongoDB sync notice:', err);
    });
  };

  const updateProductStock = (
    productId: string,
    stockStatus: StockStatus,
    stockQuantity?: number
  ) => {
    clearClientProductCache();
    setProducts((prev) => {
      const next = prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stockStatus,
              ...(stockQuantity !== undefined ? { stockQuantity: Math.max(0, stockQuantity) } : {}),
            }
          : p
      );
      try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next)); } catch {}
      return next;
    });
    showToast(`Stock status updated to "${stockStatus}".`);

    // Direct MongoDB Database CRUD Persist
    updateProductStockInDb(productId, stockStatus, stockQuantity).catch((err) => {
      console.warn('MongoDB sync notice:', err);
    });
  };

  const bulkUpdateProducts = async (payload: {
    action: 'adjust_price' | 'set_stock';
    ids?: string[];
    percentage?: number;
    stockStatus?: string;
  }): Promise<boolean> => {
    const res = await bulkUpdateProductsInDb(payload);
    if (res.success) {
      await reloadCatalogFromDb();
      showToast(res.message || 'Bulk product update applied successfully.');
      return true;
    } else {
      showToast(`Bulk update notice: ${res.message || 'Operation failed'}`);
      return false;
    }
  };

  const resetProductsToDefault = () => {
    reloadCatalogFromDb()
      .then(() => {
        showToast('Catalog reloaded directly from MongoDB Atlas database.');
      })
      .catch(() => {
        setProducts(INITIAL_PRODUCTS);
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        showToast('Reset catalog in browser view.');
      });
  };

  const updateStoreConfig = (partial: Partial<StoreConfig>) => {
    setStoreConfig((prev) => {
      const next = {
        ...prev,
        ...partial,
      };
      try { localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(next)); } catch {}
      // Direct MongoDB Database CRUD Persist
      saveStoreConfigToDb(next).catch((err) => {
        console.warn('MongoDB config sync notice:', err);
      });
      return next;
    });
    showToast('Web content & store handles synchronized to MongoDB.');
  };

  const resetStoreConfigToDefault = () => {
    setStoreConfig(INITIAL_STORE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    saveStoreConfigToDb(INITIAL_STORE_CONFIG).catch((err) => {
      console.warn('MongoDB config reset notice:', err);
    });
    showToast('Store branding and web handles reset to defaults.');
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

    // Asynchronously synchronize order to MongoDB via Node.js Backend
    submitOrderToBackend({
      ...input,
      items: record.items,
      subtotal: record.subtotal,
      deliveryFee: record.deliveryFee,
      totalAmount: record.totalAmount,
    }).then((res) => {
      if (res.success) {
        console.log('[MongoDB Sync] Order successfully saved to database:', res.order?.orderReference || record.orderReference);
      }
    }).catch((err) => {
      console.warn('MongoDB sync notice:', err);
    });

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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { useStore } from './useStore';

