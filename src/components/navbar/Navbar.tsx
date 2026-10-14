import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, Sparkles, ChevronDown, Globe, X, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AnnouncementBar } from './AnnouncementBar';
import { MegaMenu, MEGA_MENU_DATA } from './MegaMenu';
import { SearchOverlay } from './SearchOverlay';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';
import { MobileBottomBar } from './MobileBottomBar';

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
  const isHomePage = location.pathname === '/';

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
          p.name.toLowerCase().includes(q) ||
          (p.nameSw && p.nameSw.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
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

  // Dynamic Header Height measurement to prevent content overlap or jumps
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(148);

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

  // Scroll states for sticky hide on scroll down / reveal on scroll up
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  // Mega menu open delay ref (150ms delay)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect count changes and trigger bounce
  useEffect(() => {
    if (cartItemCount !== prevCountRef.current) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 400);
      prevCountRef.current = cartItemCount;
      return () => clearTimeout(timer);
    }
  }, [cartItemCount]);

  // Global shortcut "/" to open search overlay
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

  // Scroll handler: hide on scroll down, reappear on scroll up, transition transparent to solid
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Solid background threshold
      setIsScrolled(currentScrollY > 40);

      // Scroll direction behavior
      if (currentScrollY > 120 && currentScrollY > lastScrollYRef.current + 10) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
        setActiveMegaCategory(null);
        setIsAccountOpen(false);
      } else if (currentScrollY < lastScrollYRef.current - 5 || currentScrollY <= 80) {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hover handlers with 150ms delay
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

  // Nav Items definition
  const NAV_ITEMS = [
    { id: 'notebooks', label: 'Notebooks', href: '/catalog?category=Counter+Books' },
    { id: 'pens-pencils', label: 'Pens & Pencils', href: '/catalog?category=School+Stationery' },
    { id: 'art-craft', label: 'Art & Craft', href: '/catalog?category=Art+%26+Craft' },
    { id: 'office', label: 'Office', href: '/catalog?category=Files+%26+Folders' },
    { id: 'school-kits', label: 'School Kits', href: '/catalog?category=School+Stationery' },
    { id: 'books', label: 'Books', href: '/catalog?category=Exercise+Books' },
    { id: 'offers', label: 'Offers', href: '/catalog', badge: 'SALE' },
  ];

  // Header dynamic classes:
  // If at top of home page -> transparent; else -> solid boutique paper background
  const isSolid = !isHomePage || isScrolled;
  const headerBgClass = isSolid
    ? 'bg-[#FAF7F0] border-b border-[#E4DDCC] shadow-boutique-soft text-[#14182B]'
    : 'bg-[#FAF7F0]/90 backdrop-blur-md border-b border-[#E4DDCC]/50 text-[#14182B]';

  return (
    <>
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1E2A5E] focus:text-[#FAF7F0] focus:rounded-[8px] focus:font-bold focus:shadow-xl focus-ring-gold"
      >
        Skip to main content
      </a>

      {/* Main Sticky Header Container */}
      <header
        ref={headerRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-40 w-full max-w-full overflow-x-clip transition-transform duration-200 ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* A) Announcement Bar (36px, #1E2A5E) */}
        <AnnouncementBar />

        {/* B) Main Header (60px mobile, 68px desktop) */}
        <div className={`w-full max-w-full overflow-x-clip transition-colors duration-200 ease-out ${headerBgClass}`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between h-[56px] sm:h-[60px] lg:h-[68px] gap-2 sm:gap-4 lg:gap-6 w-full">
              {/* ================= LEFT: MOBILE HAMBURGER & LOGO ================= */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
                {/* Mobile / Tablet Hamburger (Visible under 1280px to prevent center nav collision) */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  className="xl:hidden p-2 rounded-full text-[#14182B] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
                >
                  <Menu className="w-5 h-5 stroke-[1.5]" />
                </button>

                {/* Logo linking to Home */}
                <Link
                  to="/"
                  className="flex items-center gap-2 sm:gap-2.5 group focus-ring-gold rounded-[8px] p-0.5 min-w-0"
                  aria-label="OMEGA Stationery &amp; Books Home"
                >
                  <div className="bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-[8px] border border-[#E4DDCC] shadow-2xs group-hover:border-[#F5A623] transition-all shrink-0">
                    <img
                      src="/omega-logo.png"
                      alt="OMEGA Logo"
                      className="h-6 sm:h-8 w-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-xs sm:text-base font-bold tracking-tight text-[#1E2A5E] leading-none group-hover:text-[#F5A623] transition-colors truncate">
                      OMEGA
                    </span>
                    <span className="text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest font-semibold uppercase text-[#6B7280] mt-0.5 truncate hidden min-[360px]:block">
                      Stationery &amp; Books
                    </span>
                  </div>
                </Link>
              </div>

              {/* ================= CENTER: PRIMARY NAV LINKS (Desktop XL only, compact and responsive) ================= */}
              <nav
                role="navigation"
                aria-label="Primary Navigation"
                className="hidden xl:flex items-center justify-center gap-0.5 2xl:gap-1.5 h-full flex-1 min-w-0 px-2"
                onMouseLeave={handleNavMouseLeave}
              >
                {NAV_ITEMS.map((item) => {
                  const isMegaActive = activeMegaCategory === item.id;
                  return (
                    <div
                      key={item.id}
                      className="relative h-full flex items-center shrink-0"
                      onMouseEnter={() => handleNavMouseEnter(item.id)}
                    >
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `nav-link-ink px-2 2xl:px-2.5 py-1.5 text-[13px] 2xl:text-[14px] font-medium tracking-tight text-[#14182B] hover:text-[#1E2A5E] focus-ring-gold rounded-[4px] flex items-center gap-1 transition-colors whitespace-nowrap ${
                            isActive || isMegaActive ? 'text-[#1E2A5E] active' : ''
                          }`
                        }
                        aria-expanded={isMegaActive}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        {item.badge ? (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#F5A623] text-[#1E2A5E] leading-none shadow-2xs">
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronDown
                            className={`w-3 h-3 opacity-50 hidden 2xl:inline-block transition-transform duration-150 ${
                              isMegaActive ? 'rotate-180 text-[#1E2A5E] opacity-100' : ''
                            }`}
                          />
                        )}
                      </NavLink>
                    </div>
                  );
                })}
              </nav>

              {/* ================= RIGHT: TOOLS (Always Anchored Inside Viewport) ================= */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
                {/* 1. Visible Language Switcher Pill (EN ⇄ SW) */}
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border border-[#E4DDCC] hover:border-[#1E2A5E] bg-[#FAF7F0] hover:bg-white text-[10px] sm:text-xs font-bold text-[#1E2A5E] transition-all min-h-[30px] sm:min-h-[34px] focus-ring-gold shadow-2xs shrink-0"
                  title={language === 'en' ? 'Badili lugha kuwa Kiswahili' : 'Switch to English'}
                  aria-label="Toggle language between English and Swahili"
                >
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F5A623]" />
                  <span className="font-mono uppercase text-[10px] sm:text-[11px]">{language === 'en' ? 'SW' : 'EN'}</span>
                </button>

                {/* 2. Wishlist Icon (Heart) - Visible on sm+ screens */}
                <button
                  type="button"
                  onClick={() => setIsWishlistModalOpen(true)}
                  aria-label={`Wishlist (${wishlistCount} saved items)`}
                  className="hidden sm:flex p-2 rounded-full text-[#14182B] hover:text-[#1E2A5E] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] items-center justify-center relative shrink-0"
                  title="Wishlist"
                >
                  <Heart
                    className={`w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] stroke-[1.5] ${
                      wishlistCount > 0 ? 'fill-[#D64545] text-[#D64545]' : ''
                    }`}
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#D64545] text-white text-[9px] font-bold flex items-center justify-center font-mono leading-none shadow-xs">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* 3. Account Icon (User) - Visible on sm+ screens */}
                <div className="relative hidden sm:block shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    aria-label={currentUser ? `Account: ${currentUser.name}` : 'Account and Orders'}
                    aria-expanded={isAccountOpen}
                    className="p-1.5 sm:p-2 rounded-full text-[#14182B] hover:text-[#1E2A5E] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
                    title={currentUser ? currentUser.name : 'Account'}
                  >
                    {currentUser ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1E2A5E] text-[#F5A623] font-bold text-[10px] sm:text-xs flex items-center justify-center font-mono shadow-2xs">
                        {currentUser.initials}
                      </div>
                    ) : (
                      <User className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px] stroke-[1.5]" />
                    )}
                  </button>

                  <AccountDropdown
                    isOpen={isAccountOpen}
                    onClose={() => setIsAccountOpen(false)}
                    onOpenOrders={() => setIsTrackingModalOpen(true)}
                    onOpenWishlist={() => setIsWishlistModalOpen(true)}
                  />
                </div>

                {/* 4. Cart Icon (Bag) - Always Visible with Gold Badge */}
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  aria-label={`Shopping bag (${cartItemCount} items)`}
                  className="p-1.5 sm:p-2 rounded-full text-[#14182B] hover:text-[#1E2A5E] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center relative group shrink-0"
                  title="Shopping Bag"
                >
                  <ShoppingBag className="w-[20px] h-[20px] stroke-[1.5] text-[#1E2A5E]" />

                  {/* Gold count badge: 18px circle, background #F5A623, dark text #1E2A5E */}
                  <span
                    className={`absolute top-0.5 right-0.5 w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] rounded-full bg-[#F5A623] text-[#1E2A5E] text-[9px] sm:text-[10px] font-black flex items-center justify-center font-mono leading-none shadow-xs ${
                      isCartBouncing ? 'animate-cart-bounce' : ''
                    }`}
                  >
                    {cartItemCount}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= C) NAVBAR BOTTOM: Dedicated Search Bar Row ================= */}
          <div className="w-full max-w-full overflow-x-clip bg-[#FAF7F0] border-t border-[#E4DDCC]/70 px-3 sm:px-6 lg:px-8 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 w-full">
              {/* Prominent Search Bar */}
              <div ref={inlineSearchRef} className="relative flex-1 min-w-0 max-w-2xl lg:max-w-3xl">
                <form onSubmit={handleDesktopSearchSubmit} className="relative flex items-center">
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1E2A5E] absolute left-3.5 pointer-events-none" />
                  <input
                    type="search"
                    value={desktopSearchQuery}
                    onChange={(e) => {
                      setDesktopSearchQuery(e.target.value);
                      setIsInlineSearchFocused(true);
                    }}
                    onFocus={() => setIsInlineSearchFocused(true)}
                    placeholder={
                      language === 'sw'
                        ? 'Tafuta madaftari ya OMEGA, counter books, bahasha, kalamu...'
                        : 'Search OMEGA notebooks, counter books, bahasha, stationery...'
                    }
                    className="w-full pl-10 sm:pl-11 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-white hover:bg-white focus:bg-white rounded-[10px] border border-[#E4DDCC] focus:border-[#1E2A5E] text-[#14182B] placeholder:text-[#6B7280] transition-all shadow-xs focus:outline-none focus:ring-1 focus:ring-[#1E2A5E]"
                  />
                  {desktopSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setDesktopSearchQuery('');
                        setIsInlineSearchFocused(false);
                      }}
                      className="absolute right-3 p-1 text-[#6B7280] hover:text-[#14182B]"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Suggestions Dropdown */}
                {isInlineSearchFocused && inlineMatches.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-[12px] border border-[#E4DDCC] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-2 bg-[#FAF7F0] border-b border-[#E4DDCC]/60 flex items-center justify-between text-xs font-bold text-[#6B7280]">
                      <span>{language === 'sw' ? 'Bidhaa Zinazolingana' : 'Matching Products'}</span>
                      <button
                        type="button"
                        onClick={handleDesktopSearchSubmit}
                        className="text-[#1E2A5E] hover:text-[#F5A623] cursor-pointer flex items-center gap-1 font-semibold"
                      >
                        {language === 'sw' ? 'Tazama zote' : 'View all'} ({inlineMatches.length}) <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#E4DDCC]/40">
                      {inlineMatches.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setIsInlineSearchFocused(false);
                            setDesktopSearchQuery('');
                          }}
                          className="w-full p-2.5 sm:p-3 flex items-center gap-3 hover:bg-[#FAF7F0] text-left transition-colors cursor-pointer group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-[#E4DDCC]/60 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-[#14182B] group-hover:text-[#1E2A5E] truncate">
                              {language === 'sw' && item.nameSw ? item.nameSw : item.name}
                            </p>
                            <p className="text-[11px] text-[#6B7280] truncate font-mono">
                              {item.category} · {item.quire || item.pageCount || item.size || 'Stationery'}
                            </p>
                          </div>
                          <span className="text-xs sm:text-sm font-mono font-bold text-[#1E2A5E] shrink-0">
                            TZS {(item.discountPrice || item.price).toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Popular Categories / Tags */}
              <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-xs text-[#6B7280]">
                <span className="font-semibold text-[#1E2A5E] whitespace-nowrap">
                  {language === 'sw' ? 'Maarufu:' : 'Popular:'}
                </span>
                {['Counter Books', 'Bahasha A4', 'Exercise 200p', 'Math Set'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      navigate(`/catalog?q=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-[#F3EEE2] border border-[#E4DDCC] text-xs font-medium text-[#14182B] hover:text-[#1E2A5E] transition-colors whitespace-nowrap shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* D) Mega Menu (Desktop full-width panel below header) */}
          <div onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}>
            <MegaMenu
              activeId={activeMegaCategory}
              onClose={() => setActiveMegaCategory(null)}
            />
          </div>
        </div>
      </header>

      {/* Reserve exact header height dynamically to prevent content jump or overlap */}
      <div style={{ height: `${headerHeight}px` }} className="w-full shrink-0" aria-hidden="true" />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => {
          setIsMobileMenuOpen(false);
          setIsSearchOpen(true);
        }}
        onOpenWishlist={() => {
          setIsMobileMenuOpen(false);
          setIsWishlistModalOpen(true);
        }}
        onOpenTracking={() => {
          setIsMobileMenuOpen(false);
          setIsTrackingModalOpen(true);
        }}
      />

      {/* Sticky Mobile Bottom Bar (Under 1024px) */}
      <MobileBottomBar
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistModalOpen(true)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
      />
    </>
  );
};

