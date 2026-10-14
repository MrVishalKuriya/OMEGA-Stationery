import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, Sparkles, ChevronDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AnnouncementBar } from './AnnouncementBar';
import { MegaMenu, MEGA_MENU_DATA } from './MegaMenu';
import { SearchOverlay } from './SearchOverlay';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';
import { MobileBottomBar } from './MobileBottomBar';

export const Navbar: React.FC = () => {
  const {
    cartItemCount,
    wishlistCount,
    setIsCartDrawerOpen,
    setIsWishlistModalOpen,
    setIsTrackingModalOpen,
  } = useStore();

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Navigation & Interactive states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(null);

  // Cart bounce animation state
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const prevCountRef = useRef(cartItemCount);

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
        role="banner"
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-200 ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* A) Announcement Bar (36px, #1E2A5E) */}
        <AnnouncementBar />

        {/* B) Main Header (72px desktop, 60px mobile) */}
        <div className={`w-full transition-colors duration-200 ease-out ${headerBgClass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[60px] lg:h-[72px] gap-2 sm:gap-6">
              {/* ================= LEFT: MOBILE HAMBURGER & LOGO ================= */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Mobile Hamburger (Under 1024px) */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  className="lg:hidden p-2 rounded-full text-[#14182B] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Menu className="w-5 h-5 stroke-[1.5]" />
                </button>

                {/* Logo linking to Home */}
                <Link
                  to="/"
                  className="flex items-center gap-2.5 sm:gap-3 group focus-ring-gold rounded-[8px] p-1"
                  aria-label="OMEGA Stationery &amp; Books Home"
                >
                  <div className="bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[8px] border border-[#E4DDCC] shadow-2xs group-hover:border-[#F5A623] transition-all">
                    <img
                      src="/omega-logo.png"
                      alt="OMEGA Logo"
                      className="h-7 sm:h-9 w-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-[#1E2A5E] leading-none group-hover:text-[#F5A623] transition-colors">
                      OMEGA
                    </span>
                    <span className="text-[9px] sm:text-[10px] tracking-widest font-semibold uppercase text-[#6B7280] mt-0.5 whitespace-nowrap">
                      Stationery &amp; Books
                    </span>
                  </div>
                </Link>
              </div>

              {/* ================= CENTER: PRIMARY NAV LINKS (Desktop) ================= */}
              <nav
                role="navigation"
                aria-label="Primary Navigation"
                className="hidden lg:flex items-center gap-1 xl:gap-2 h-full"
                onMouseLeave={handleNavMouseLeave}
              >
                {NAV_ITEMS.map((item) => {
                  const isMegaActive = activeMegaCategory === item.id;
                  return (
                    <div
                      key={item.id}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => handleNavMouseEnter(item.id)}
                    >
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `nav-link-ink px-3 py-2 text-[15px] font-medium tracking-tight text-[#14182B] hover:text-[#1E2A5E] focus-ring-gold rounded-[4px] flex items-center gap-1.5 transition-colors ${
                            isActive || isMegaActive ? 'text-[#1E2A5E] active' : ''
                          }`
                        }
                        aria-expanded={isMegaActive}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        {item.badge ? (
                          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#F5A623] text-[#1E2A5E] leading-none shadow-2xs">
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronDown
                            className={`w-3.5 h-3.5 opacity-50 transition-transform duration-150 ${
                              isMegaActive ? 'rotate-180 text-[#1E2A5E] opacity-100' : ''
                            }`}
                          />
                        )}
                      </NavLink>
                    </div>
                  );
                })}
              </nav>

              {/* ================= RIGHT: TOOLS (Search, Wishlist, Account, Cart) ================= */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* 1. Search Icon */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search catalog (Press /)"
                  className="p-2.5 rounded-full text-[#14182B] hover:text-[#1E2A5E] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[44px] min-h-[44px] flex items-center justify-center relative group"
                  title="Search catalog (/)"
                >
                  <Search className="w-[22px] h-[22px] stroke-[1.5]" />
                  <span className="hidden xl:inline-block ml-1.5 text-xs text-[#6B7280] font-mono group-hover:text-[#1E2A5E]">
                    /
                  </span>
                </button>

                {/* 2. Wishlist Icon (Heart) */}
                <button
                  type="button"
                  onClick={() => setIsWishlistModalOpen(true)}
                  aria-label={`Wishlist (${wishlistCount} saved items)`}
                  className="p-2.5 rounded-full text-[#14182B] hover:text-[#1E2A5E] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[44px] min-h-[44px] flex items-center justify-center relative"
                  title="Wishlist"
                >
                  <Heart
                    className={`w-[22px] h-[22px] stroke-[1.5] ${
                      wishlistCount > 0 ? 'fill-[#D64545] text-[#D64545]' : ''
                    }`}
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D64545] text-white text-[10px] font-bold flex items-center justify-center font-mono leading-none shadow-xs">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* 3. Account Icon (User) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    aria-label="Account and Orders"
                    aria-expanded={isAccountOpen}
                    className="p-2.5 rounded-full text-[#14182B] hover:text-[#1E2A5E] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Account"
                  >
                    <User className="w-[22px] h-[22px] stroke-[1.5]" />
                  </button>

                  <AccountDropdown
                    isOpen={isAccountOpen}
                    onClose={() => setIsAccountOpen(false)}
                    onOpenOrders={() => setIsTrackingModalOpen(true)}
                    onOpenWishlist={() => setIsWishlistModalOpen(true)}
                  />
                </div>

                {/* 4. Cart Icon (Bag) with Gold Badge (18px circle) & Bounce Animation */}
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  aria-label={`Shopping bag (${cartItemCount} items)`}
                  className="p-2.5 rounded-full text-[#14182B] hover:text-[#1E2A5E] hover:bg-[#F3EEE2] transition-colors focus-ring-gold min-w-[44px] min-h-[44px] flex items-center justify-center relative group"
                  title="Shopping Bag"
                >
                  <ShoppingBag className="w-[22px] h-[22px] stroke-[1.5] text-[#1E2A5E]" />

                  {/* Gold count badge: 18px circle, background #F5A623, dark text #1E2A5E */}
                  <span
                    className={`absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-[#F5A623] text-[#1E2A5E] text-[10px] font-black flex items-center justify-center font-mono leading-none shadow-xs ${
                      isCartBouncing ? 'animate-cart-bounce' : ''
                    }`}
                  >
                    {cartItemCount}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* C) Mega Menu (Desktop full-width panel below header) */}
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

      {/* Reserve header height to prevent content jump / layout shift (36px announcement + 72px desktop / 60px mobile) */}
      <div className="h-[96px] lg:h-[108px] w-full" aria-hidden="true" />

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

