import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  Sparkles,
  ChevronDown,
  Globe,
  X,
  ArrowRight,
  Truck,
  Package,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AnnouncementBar } from './AnnouncementBar';
import { MegaMenu } from './MegaMenu';
import { SearchOverlay } from './SearchOverlay';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';

export const Navbar: React.FC = () => {
  const {
    products,
    cartItemCount,
    wishlistCount,
    currentUser,
    language,
    toggleLanguage,
    setIsCartDrawerOpen,
    setIsWishlistModalOpen,
    setIsTrackingModalOpen,
  } = useStore();

  const location = useLocation();
  const navigate = useNavigate();

  // Navigation & Interactive states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(null);

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

  // Compute live inline search matches
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

  // Cart bounce animation state
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const prevCountRef = useRef(cartItemCount);

  // Dynamic Header Height measurement to prevent content overlap
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(115);

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

  // Sticky navbar state
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Mega menu open delay ref
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect cart count changes and trigger bounce
  useEffect(() => {
    if (cartItemCount !== prevCountRef.current) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 400);
      prevCountRef.current = cartItemCount;
      return () => clearTimeout(timer);
    }
  }, [cartItemCount]);

  // Global shortcut "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Scroll handler: hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 120 && currentScrollY > lastScrollYRef.current + 10) {
        setIsVisible(false);
        setActiveMegaCategory(null);
        setIsAccountOpen(false);
      } else if (currentScrollY < lastScrollYRef.current - 5 || currentScrollY <= 80) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hover handlers for mega-menu
  const handleNavMouseEnter = (catId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaCategory(catId);
    }, 150);
  };

  const handleNavMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaCategory(null);
    }, 200);
  };

  // Helper to determine exact active category navigation item (accounting for URL search queries)
  const isNavActive = (href: string) => {
    const [targetPath, targetQuery] = href.split('?');
    
    // Pathnames must match exactly
    if (location.pathname !== targetPath) {
      return false;
    }

    // Special exact matching for /catalog routes with or without ?category=
    if (targetPath === '/catalog') {
      const currentParams = new URLSearchParams(location.search);
      const currentCategory = currentParams.get('category');

      if (!targetQuery) {
        // "All Products" is active only when no category is specified (or category === 'All')
        return !currentCategory || currentCategory === 'All';
      }

      const targetParams = new URLSearchParams(targetQuery);
      const targetCategory = targetParams.get('category');
      return currentCategory === targetCategory;
    }

    return true;
  };

  // Dedicated Category Navigation Items
  const CATEGORY_NAV_ITEMS = [
    { id: 'all-catalog', label: language === 'sw' ? 'Bidhaa Zote' : 'All Products', href: '/catalog' },
    { id: 'counter-books', label: 'Counter Books (Q2–Q4)', href: '/catalog?category=Counter+Books' },
    { id: 'exercise-books', label: language === 'sw' ? 'Madaftari ya Mazoezi' : 'Exercise Books', href: '/catalog?category=Exercise+Books' },
    { id: 'bahasha', label: 'Bahasha & Envelopes', href: '/catalog?category=Bahasha+%26+Envelopes' },
    { id: 'school-tenders', label: language === 'sw' ? 'Zabuni za Shule' : 'School Tenders', href: '/school-tenders', badge: 'CALCULATOR' },
    { id: 'wholesale', label: language === 'sw' ? 'Bei za Jumla' : 'Wholesale Cartons', href: '/wholesale', badge: 'UP TO 18% OFF' },
    { id: 'shipping-guide', label: language === 'sw' ? 'Usafirishaji Mikoani' : 'Shipping Guide', href: '/shipping-guide' },
    { id: 'about', label: language === 'sw' ? 'Kuhusu Sisi' : 'About OMEGA', href: '/about' },
    { id: 'contact', label: language === 'sw' ? 'Wasiliana Nasi' : 'Contact & Desks', href: '/contact' },
  ];

  return (
    <>
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#111113] focus:text-white focus:rounded-[8px] focus:font-bold focus:shadow-xl focus-ring-gold"
      >
        Skip to main content
      </a>

      {/* Main Sticky Header Container */}
      <header
        ref={headerRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-200 ease-out shadow-sm ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* ================= TIER 0: ANNOUNCEMENT BAR (34px, #111113) ================= */}
        <AnnouncementBar />

        {/* ================= TIER 1: BRAND LOGO + SEARCH + ACTIONS (64px) ================= */}
        <div className="bg-white border-b border-[#e4e4e7] text-[#18181b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[62px] sm:h-[68px] gap-3 sm:gap-6">
              
              {/* LEFT: Mobile Hamburger & OMEGA Brand Hallmark */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Mobile / Tablet Menu Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  className="lg:hidden p-2 rounded-full text-[#18181b] hover:bg-[#f4f4f5] transition-colors focus-ring-gold min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0"
                >
                  <Menu className="w-5 h-5 stroke-[1.5]" />
                </button>

                {/* Brand Logo & Name */}
                <Link
                  to="/"
                  className="flex items-center gap-2.5 group focus-ring-gold rounded-[8px] p-0.5 shrink-0"
                  aria-label="OMEGA Stationery & Books Home"
                >
                  <div className="bg-white p-1 rounded-[10px] border border-[#e4e4e7] shadow-2xs group-hover:border-[#dc2626] transition-all shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9">
                    <img
                      src="/logo-icon.png"
                      alt="OMEGA Icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col shrink-0">
                    <span className="font-heading text-sm sm:text-base font-extrabold tracking-tight text-[#111113] leading-tight group-hover:text-[#dc2626] transition-colors">
                      OMEGA
                    </span>
                    <span className="text-[9px] sm:text-[10px] tracking-wider font-semibold uppercase text-[#71717a] mt-0.5 hidden min-[340px]:block">
                      STATIONERY &amp; BOOKS
                    </span>
                  </div>
                </Link>
              </div>

              {/* CENTER: Prominent Instant Search Bar (Desktop) */}
              <div
                ref={inlineSearchRef}
                className="relative hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-2 lg:mx-6"
              >
                <form onSubmit={handleDesktopSearchSubmit} className="relative w-full flex items-center">
                  <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 pointer-events-none" />
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
                        ? 'Tafuta madaftari, counter books, bahasha, rejesta...'
                        : 'Search notebooks, counter books, bahasha, registers...'
                    }
                    className="w-full pl-10 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#fafafa] rounded-lg border border-[#e4e4e7] hover:border-[#dc2626] focus:border-[#dc2626] text-[#18181b] placeholder:text-[#71717a] transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
                  />
                  {desktopSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setDesktopSearchQuery('');
                        setIsInlineSearchFocused(false);
                      }}
                      className="absolute right-3 p-1 text-[#71717a] hover:text-[#18181b]"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Instant Live Search Dropdown */}
                {isInlineSearchFocused && inlineMatches.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-[12px] border border-[#e4e4e7] shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-2.5 bg-[#fafafa] border-b border-[#e4e4e7] flex items-center justify-between text-xs font-bold text-[#71717a]">
                      <span>{language === 'sw' ? 'Bidhaa Zinazolingana' : 'Matching Products'}</span>
                      <button
                        type="button"
                        onClick={handleDesktopSearchSubmit}
                        className="text-[#111113] hover:text-[#dc2626] flex items-center gap-1 font-semibold"
                      >
                        {language === 'sw' ? 'Tazama zote' : 'View all'} ({inlineMatches.length}) <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#e4e4e7]/60">
                      {inlineMatches.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setIsInlineSearchFocused(false);
                            setDesktopSearchQuery('');
                          }}
                          className="w-full p-3 flex items-center gap-3 hover:bg-[#fafafa] text-left transition-colors cursor-pointer group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-[#e4e4e7] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-[#18181b] group-hover:text-[#dc2626] truncate">
                              {language === 'sw' && item.nameSw ? item.nameSw : item.name}
                            </p>
                            <p className="text-[11px] text-[#71717a] truncate font-mono">
                              {item.category} · {item.quire || item.pageCount || item.size || 'Stationery'}
                            </p>
                          </div>
                          <span className="text-xs sm:text-sm font-mono font-bold text-[#dc2626] shrink-0">
                            TZS {(item.discountPrice || item.price).toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: High-Conversion B2B CTA + Tools */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
                {/* 1. B2B Wholesale Quote Pill Button */}
                <Link
                  to="/wholesale"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95 group shrink-0"
                >
                  <span>B2B Wholesale</span>
                  <ArrowRight className="w-3.5 h-3.5 ledup-arrow-icon" />
                </Link>

                {/* 2. Track Order Quick Trigger */}
                <button
                  type="button"
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e4e4e7] hover:border-[#dc2626] bg-white text-xs font-semibold text-[#18181b] transition-all hover:bg-[#fafafa] shrink-0"
                  title="Track Parcel Delivery"
                >
                  <Truck className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span>{language === 'sw' ? 'Fuatilia Oda' : 'Track Order'}</span>
                </button>

                {/* 3. Language Switcher Pill (EN ⇄ SW) */}
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#e4e4e7] hover:border-[#dc2626] bg-white hover:bg-[#fafafa] text-xs font-bold text-[#18181b] transition-all min-h-[34px] focus-ring-gold shadow-2xs shrink-0"
                  title={language === 'en' ? 'Badili lugha kuwa Kiswahili' : 'Switch to English'}
                  aria-label="Toggle language between English and Swahili"
                >
                  <Globe className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span className="font-mono uppercase text-[11px]">{language === 'en' ? 'SW' : 'EN'}</span>
                </button>

                {/* 4. Wishlist Icon (Heart) - Visible sm+ */}
                <Link
                  to="/wishlist"
                  aria-label={`Wishlist (${wishlistCount} saved items)`}
                  className="hidden sm:flex p-2 rounded-full text-[#18181b] hover:text-[#dc2626] hover:bg-[#f4f4f5] transition-colors focus-ring-gold min-w-[38px] min-h-[38px] items-center justify-center relative shrink-0"
                  title="Wishlist"
                >
                  <Heart
                    className={`w-[19px] h-[19px] stroke-[1.5] ${
                      wishlistCount > 0 ? 'fill-[#dc2626] text-[#dc2626]' : ''
                    }`}
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#dc2626] text-white text-[9px] font-bold flex items-center justify-center font-mono leading-none shadow-xs">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* 5. Account Icon (User) - Visible sm+ */}
                <div className="relative z-50 shrink-0 hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    aria-label={currentUser ? `Account: ${currentUser.name}` : 'Account and Orders'}
                    aria-expanded={isAccountOpen}
                    className="p-2 rounded-full text-[#18181b] hover:text-[#dc2626] hover:bg-[#f4f4f5] transition-colors focus-ring-gold min-w-[38px] min-h-[38px] flex items-center justify-center"
                    title={currentUser ? currentUser.name : 'Account'}
                  >
                    {currentUser ? (
                      <div className="w-7 h-7 rounded-full bg-[#111113] text-[#dc2626] font-bold text-xs flex items-center justify-center font-mono shadow-2xs">
                        {currentUser.initials}
                      </div>
                    ) : (
                      <User className="w-[19px] h-[19px] stroke-[1.5]" />
                    )}
                  </button>

                  <AccountDropdown
                    isOpen={isAccountOpen}
                    onClose={() => setIsAccountOpen(false)}
                    onOpenOrders={() => navigate('/tracking')}
                    onOpenWishlist={() => navigate('/wishlist')}
                  />
                </div>

                {/* 6. Shopping Bag Icon */}
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  aria-label={`Shopping bag (${cartItemCount} items)`}
                  className="p-2 rounded-full text-[#18181b] hover:text-[#dc2626] hover:bg-[#f4f4f5] transition-colors focus-ring-gold min-w-[38px] min-h-[38px] flex items-center justify-center relative group shrink-0"
                  title="Shopping Bag"
                >
                  <ShoppingBag className="w-[20px] h-[20px] stroke-[1.5] text-[#111113]" />
                  <span
                    className={`absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-[#dc2626] text-white text-[10px] font-black flex items-center justify-center font-mono leading-none shadow-xs ${
                      isCartBouncing ? 'animate-cart-bounce' : ''
                    }`}
                  >
                    {cartItemCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Inline Search Bar (Visible on mobile screens < md) - No popup window */}
            <div className="md:hidden pb-2.5 pt-1 relative">
              <form onSubmit={handleDesktopSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  role="searchbox"
                  autoCapitalize="none"
                  autoCorrect="off"
                  enterKeyHint="search"
                  value={desktopSearchQuery}
                  onChange={(e) => setDesktopSearchQuery(e.target.value)}
                  placeholder={
                    language === 'sw'
                      ? 'Tafuta madaftari, counter books, bahasha...'
                      : 'Search notebooks, counter books, bahasha...'
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs bg-white rounded-lg border border-[#e4e4e7] text-[#18181b] placeholder:text-[#71717a] shadow-2xs focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]"
                />
                {desktopSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDesktopSearchQuery('')}
                    className="absolute right-3 p-1 text-[#71717a]"
                    aria-label="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* ================= TIER 2: HORIZONTAL CATEGORY NAVIGATION BAR (Desktop lg+) ================= */}
        <div className="hidden lg:block bg-white border-b border-[#e4e4e7] py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              role="navigation"
              aria-label="Category Navigation"
              className="flex items-center justify-between gap-1 xl:gap-2 overflow-x-auto no-scrollbar"
              onMouseLeave={handleNavMouseLeave}
            >
              {CATEGORY_NAV_ITEMS.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`px-3 py-1.5 text-xs font-semibold tracking-tight rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      active
                        ? 'bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white shadow-xs font-bold'
                        : 'text-[#18181b] hover:text-[#dc2626] hover:bg-[#f4f4f5]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#dc2626] text-white leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mega Menu Dropdown */}
          <div
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
          >
            <MegaMenu
              activeId={activeMegaCategory}
              onClose={() => setActiveMegaCategory(null)}
            />
          </div>
        </div>
      </header>

      {/* Dynamic Header Spacer to prevent page content overlap */}
      <div style={{ height: `${headerHeight}px` }} className="w-full shrink-0" aria-hidden="true" />

      {/* Global Search Overlay for "/" shortcut */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer Menu */}
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
