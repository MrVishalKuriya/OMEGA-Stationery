import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  SearchX,
  MessageCircle,
  Heart,
  ShoppingBag,
  Menu,
  Globe,
  X,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchOverlay } from './SearchOverlay';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';
import { ProductImage } from '@/components/ProductImage';
import { BrandLogo } from '@/components/BrandLogo';

export const Navbar: React.FC = () => {
  const {
    products,
    cartItemCount,
    wishlistCount,
    currentUser,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    setIsCartDrawerOpen,
  } = useStore();

  const location = useLocation();
  const navigate = useNavigate();

  // Navigation & Interactive states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop Inline Search State
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('');
  const [isInlineSearchFocused, setIsInlineSearchFocused] = useState(false);
  const inlineSearchRef = useRef<HTMLDivElement>(null);

  // Close inline search dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (inlineSearchRef.current && !inlineSearchRef.current.contains(e.target as Node)) {
        setIsInlineSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Compute live inline search matches (limited to 5 high-relevance items)
  const inlineMatches = useMemo(() => {
    const q = desktopSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.nameSw && p.nameSw.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.quire && p.quire.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
        );
      })
      .slice(0, 5);
  }, [desktopSearchQuery, products]);

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(desktopSearchQuery.trim())}`);
      setIsInlineSearchFocused(false);
    }
  };

  // Cart bounce animation
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const prevCountRef = useRef(cartItemCount);

  useEffect(() => {
    if (cartItemCount !== prevCountRef.current) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 500);
      prevCountRef.current = cartItemCount;
      return () => clearTimeout(timer);
    }
  }, [cartItemCount]);

  // Global shortcut "⌘K" or "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !isSearchOpen) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Dynamic Header Height measurement to prevent content overlap
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(102);

  useEffect(() => {
    if (!headerRef.current) return;
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Sticky navbar state: smooth hide on down-scroll, reveal on up-scroll
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 150 && currentScrollY > lastScrollYRef.current + 8) {
        setIsVisible(false);
        setIsAccountOpen(false);
      } else if (currentScrollY < lastScrollYRef.current - 4 || currentScrollY <= 80) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to determine active category navigation item
  const isNavActive = (href: string) => {
    const [targetPath, targetQuery] = href.split('?');
    if (location.pathname !== targetPath) {
      return false;
    }
    if (targetPath === '/catalog') {
      const currentParams = new URLSearchParams(location.search);
      const currentCategory = currentParams.get('category');
      if (!targetQuery) {
        return !currentCategory || currentCategory === 'All';
      }
      const targetParams = new URLSearchParams(targetQuery);
      const targetCategory = targetParams.get('category');
      return currentCategory === targetCategory;
    }
    return true;
  };

  // Modern Watermelon UI Category Navigation Items
  const CATEGORY_NAV_ITEMS = [
    { id: 'all-catalog', label: language === 'sw' ? 'Bidhaa Zote' : 'All Products', href: '/catalog' },
    { id: 'counter-books', label: 'Counter Books (Q1-Q6)', href: '/catalog?category=Counter+Books' },
    { id: 'exercise-books', label: language === 'sw' ? 'Madaftari ya Mazoezi' : 'Exercise Books', href: '/catalog?category=Exercise+Books' },
    { id: 'bahasha', label: 'Kraft Bahasha', href: '/catalog?category=Bahasha+%26+Envelopes' },
    { id: 'registers', label: 'Office Registers', href: '/catalog?category=Registers' },
    { id: 'wholesale', label: language === 'sw' ? 'Bei za Jumla' : 'Wholesale Cartons', href: '/wholesale', badge: 'UP TO 20% OFF' },
    { id: 'school-tenders', label: language === 'sw' ? 'Zabuni za Shule' : 'School Tenders', href: '/school-tenders', badge: 'RFQ' },
    { id: 'shipping-guide', label: language === 'sw' ? 'Usafirishaji Mikoani' : 'Shipping Guide', href: '/shipping-guide' },
    { id: 'about', label: language === 'sw' ? 'Kuhusu Sisi' : 'About OMEGA', href: '/about' },
    { id: 'contact', label: language === 'sw' ? 'Wasiliana Nasi' : 'Contact Desk', href: '/contact' },
  ];

  return (
    <>
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--surface-1)] focus:text-[var(--text)] focus:rounded-lg focus:font-bold focus:shadow-xl focus:border focus:border-[var(--gold)]"
      >
        Skip to main content
      </a>

      {/* Main Sticky Header Container with Glassmorphism */}
      <header
        ref={headerRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ease-out shadow-xs backdrop-blur-md bg-[var(--surface-1)]/95 border-b border-[var(--border)] ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* ================= TIER 0: ANNOUNCEMENT BAR ================= */}
        <AnnouncementBar />

        {/* ================= TIER 1: BRAND LOGO + INSTANT SEARCH + ESSENTIAL ACTIONS ================= */}
        <div className="text-[var(--text)] transition-colors duration-200">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[58px] sm:h-[64px] gap-2 sm:gap-6">
              
              {/* LEFT: Mobile Hamburger & OMEGA Brand Hallmark */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  className="lg:hidden p-2 rounded-xl text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Menu className="w-5 h-5 stroke-[2]" />
                </button>

                {/* High-Contrast Brand Logo */}
                <BrandLogo size="md" />
              </div>

              {/* CENTER: Watermelon UI Instant Search Command Bar (Desktop) */}
              <div
                ref={inlineSearchRef}
                className="relative hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2 lg:mx-4"
              >
                <form onSubmit={handleDesktopSearchSubmit} className="relative w-full flex items-center">
                  <Search className="w-4 h-4 text-[var(--gold)] absolute left-3.5 pointer-events-none stroke-[2]" />
                  <input
                    type="text"
                    role="searchbox"
                    autoCapitalize="none"
                    autoCorrect="off"
                    enterKeyHint="search"
                    value={desktopSearchQuery}
                    onChange={(e) => {
                      setDesktopSearchQuery(e.target.value);
                      setIsInlineSearchFocused(true);
                    }}
                    onFocus={() => setIsInlineSearchFocused(true)}
                    placeholder={
                      language === 'sw'
                        ? 'Tafuta madaftari, counter books, bahasha...'
                        : 'Search notebooks, counter books, bahasha...'
                    }
                    className="w-full pl-9 pr-12 py-2 text-xs sm:text-sm bg-[var(--surface-2)] rounded-full border border-[var(--border)] hover:border-[var(--gold)]/60 focus:border-[var(--red)] text-[var(--text)] placeholder:text-[var(--text-muted)] transition-all shadow-xs focus:outline-none focus:ring-1 focus:ring-[var(--red)]"
                  />
                  <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
                    {desktopSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDesktopSearchQuery('');
                          setIsInlineSearchFocused(false);
                        }}
                        className="pointer-events-auto p-1 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9.5px] font-mono text-[var(--text-muted)] bg-[var(--surface-1)] border border-[var(--border)] rounded">
                        /
                      </kbd>
                    )}
                  </div>
                </form>

                {/* Instant Live Search Results Popover */}
                {isInlineSearchFocused && inlineMatches.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--text-muted)] font-mono">
                      <span>MATCHING STATIONERY</span>
                      <button
                        type="button"
                        onClick={handleDesktopSearchSubmit}
                        className="text-[var(--red)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        View all ({inlineMatches.length}) <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)]">
                      {inlineMatches.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setIsInlineSearchFocused(false);
                            setDesktopSearchQuery('');
                          }}
                          className="w-full p-2.5 flex items-center gap-3 hover:bg-[var(--surface-2)] text-left transition-colors cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[var(--paper)] overflow-hidden shrink-0">
                            <ProductImage
                              image={item.image}
                              alt={item.name}
                              variant="thumb"
                              className="w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-[var(--text)] group-hover:text-[var(--gold)] truncate">
                              {language === 'sw' && item.nameSw ? item.nameSw : item.name}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)] truncate font-mono">
                              {item.category} • {item.quire || item.pageCount || '70 GSM'}
                            </p>
                          </div>
                          <span className="text-xs sm:text-sm font-mono font-black text-[var(--text)] shrink-0 tabular-nums">
                            TZS {(item.discountPrice || item.price).toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Matches Found Popover */}
                {isInlineSearchFocused && desktopSearchQuery.trim() && inlineMatches.length === 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-2xl p-4 text-center space-y-2 z-50">
                    <p className="text-xs font-bold text-[var(--text)]">
                      {language === 'sw' ? 'Hakuna bidhaa iliyopatikana' : `No stationery found for "${desktopSearchQuery}"`}
                    </p>
                    <a
                      href={`https://wa.me/255746268391?text=${encodeURIComponent('Habari OMEGA, ninatafuta: ' + desktopSearchQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#16a34a] text-white text-[11px] font-mono font-bold"
                    >
                      <MessageCircle size={13} />
                      <span>Ask Dispatch on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              {/* RIGHT: Pixel-Perfect Standalone Luxury Controls */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
                
                {/* Mobile Search Icon Trigger */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search dialog"
                  className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--gold)] border border-[var(--border)] transition-colors cursor-pointer shadow-2xs"
                >
                  <Search className="w-4 h-4 stroke-[2]" />
                </motion.button>

                {/* 2. Theme Toggle (Sun / Moon) in Clean Circular Pill (w-9 h-9) */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={toggleTheme}
                  className="hidden sm:flex w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)] items-center justify-center text-[var(--text)] hover:text-[var(--gold)] transition-colors cursor-pointer shadow-2xs shrink-0"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-[var(--gold)] stroke-[2]" />
                  ) : (
                    <Moon className="w-4 h-4 text-[var(--text)] stroke-[2]" />
                  )}
                </motion.button>

                {/* 3. Language Switcher (SW / EN) with Red Globe (h-9 height) */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={toggleLanguage}
                  className="h-9 hidden sm:inline-flex items-center gap-1.5 px-3 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--red)] text-xs font-mono font-black text-[var(--text)] transition-colors cursor-pointer shadow-2xs shrink-0"
                  title={language === 'en' ? 'Badili kuwa Kiswahili' : 'Switch to English'}
                  aria-label="Toggle language"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--red)] stroke-[2.2]" />
                  <span>{language === 'en' ? 'SW' : 'EN'}</span>
                </motion.button>

                {/* 4. Wishlist Heart in Circular Pill (w-9 h-9) */}
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} className="hidden sm:block shrink-0">
                  <Link
                    to="/wishlist"
                    aria-label={`Wishlist (${wishlistCount})`}
                    className="w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--red)] text-[var(--text)] hover:text-[var(--red)] transition-colors flex items-center justify-center relative cursor-pointer shadow-2xs"
                    title="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 stroke-[2] ${
                        wishlistCount > 0 ? 'fill-[var(--red)] text-[var(--red)]' : ''
                      }`}
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--red)] text-white text-[9px] font-black flex items-center justify-center font-mono leading-none shadow-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </motion.div>

                {/* 5. User Account Avatar with Concentric Halo Ring */}
                <div className="relative hidden sm:block shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    aria-label={currentUser ? `Account: ${currentUser.name}` : 'Account'}
                    aria-expanded={isAccountOpen}
                    className="p-0.5 rounded-full border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-colors cursor-pointer"
                    title={currentUser ? currentUser.name : 'Account'}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--surface-1)] text-[var(--gold)] font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                      {currentUser?.initials || 'OA'}
                    </div>
                  </motion.button>

                  <AccountDropdown
                    isOpen={isAccountOpen}
                    onClose={() => setIsAccountOpen(false)}
                    onOpenOrders={() => navigate('/tracking')}
                    onOpenWishlist={() => navigate('/wishlist')}
                  />
                </div>

                {/* 5. Primary Action Filled Red Cart Pill Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  aria-label={`Shopping Cart (${cartItemCount} items)`}
                  className={`h-9 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full bg-[#D63A3A] hover:bg-[#b91c1c] active:bg-[#a81616] text-white transition-all shadow-md shadow-red-950/35 shrink-0 cursor-pointer select-none ${
                    isCartBouncing ? 'animate-bounce' : ''
                  }`}
                  style={{ backgroundColor: '#D63A3A', color: '#FFFFFF' }}
                  title="Shopping Cart"
                >
                  <ShoppingBag className="w-4 h-4 text-white stroke-[2]" />
                  <span className="font-sans text-xs font-bold whitespace-nowrap text-white leading-none pt-[0.5px]">
                    <span className="hidden min-[380px]:inline">Cart </span>({cartItemCount})
                  </span>
                </motion.button>

              </div>
            </div>
          </div>
        </div>

        {/* ================= TIER 2: WATERMELON UI CATEGORY PILL NAVIGATION BAR ================= */}
        <div className="hidden lg:block border-t border-[var(--border)] py-1.5 bg-[var(--surface-1)]/90">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              role="navigation"
              aria-label="Category Navigation"
              className="flex items-center justify-start xl:justify-between gap-1 overflow-x-auto no-scrollbar py-0.5 px-1"
            >
              {CATEGORY_NAV_ITEMS.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`px-3 py-1.5 text-xs font-mono font-bold tracking-tight rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      active
                        ? 'bg-[var(--red)] text-white shadow-xs'
                        : 'text-[var(--text)] hover:text-[var(--gold)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--gold)] text-black leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Dynamic Header Spacer to prevent page content overlap */}
      <div style={{ height: `${headerHeight}px` }} className="w-full shrink-0" aria-hidden="true" />

      {/* Global Search Overlay for "/" or "⌘K" shortcut and mobile */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Modern Watermelon Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => navigate('/wishlist')}
        onOpenTracking={() => navigate('/tracking')}
      />
    </>
  );
};

export default Navbar;
