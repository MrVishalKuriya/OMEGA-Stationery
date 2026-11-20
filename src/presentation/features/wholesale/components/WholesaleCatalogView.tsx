import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  Grid,
  Download,
  Search,
  Package,
  MessageCircle,
  ShoppingBag,
  Eye,
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  ArrowUpLeft,
  ArrowLeftRight,
} from 'lucide-react';
import { formatPrice, Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';
import { isProductSubscribedForAlert } from '@/services/api';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  subscribeRecentSearches,
} from '@/utils/recentSearches';

interface WholesaleCatalogViewProps {
  products: Product[];
  currency: string;
  cleanWhatsappDigits: string;
  onAddToCart: (productId: string, quantity: number, isWholesale: boolean) => void;
  onExportCSV: () => void;
}

export const WholesaleCatalogView: React.FC<WholesaleCatalogViewProps> = ({
  products,
  currency,
  cleanWhatsappDigits,
  onAddToCart,
  onExportCSV,
}) => {
  const { setQuickViewProduct, openCompareWithProduct, isInCompare } = useStore();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [alertVersion, setAlertVersion] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAlertUpdate = () => setAlertVersion((v) => v + 1);
    window.addEventListener('omega-stock-alert-updated', handleAlertUpdate);
    return () => window.removeEventListener('omega-stock-alert-updated', handleAlertUpdate);
  }, []);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    return subscribeRecentSearches(() => setRecentSearches(getRecentSearches()));
  }, []);

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) return;
    const timer = setTimeout(() => {
      addRecentSearch(trimmed);
    }, 900);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const categories = useMemo<string[]>(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const wholesaleProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStock = !inStockOnly || p.stockStatus === 'In Stock';
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, inStockOnly]);

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--gold)]/30 text-[11px] font-bold text-[var(--gold)] font-mono uppercase tracking-widest shadow-xs">
            <span>OFFICIAL FACTORY PRICE SCHEDULE</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] tracking-tight mt-1.5">
            Wholesale Master Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-xl">
            Transparent bulk pricing with clear carton specifications, minimum order quantities, and direct factory invoicing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Switcher (Table vs Grid) */}
          <div className="flex items-center bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)] shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--gold)]/30 shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--gold)]/30 shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--gold)] text-xs font-bold font-mono tracking-wider text-[var(--text)] inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span className="hidden min-[400px]:inline">Export CSV</span>
            <span className="min-[400px]:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-[var(--surface-1)] p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div ref={searchBoxRef} className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onFocus={() => setIsSearchDropdownOpen(true)}
            onClick={() => setIsSearchDropdownOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isSearchDropdownOpen) setIsSearchDropdownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchTerm.trim().length >= 2) addRecentSearch(searchTerm.trim());
                setIsSearchDropdownOpen(false);
              } else if (e.key === 'Escape') {
                setIsSearchDropdownOpen(false);
              }
            }}
            placeholder="Search products, SKU, or specs..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--red)] bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)] transition-all font-sans"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isSearchDropdownOpen && recentSearches.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden">
              <div className="px-3.5 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                  <Clock className="w-3 h-3 text-[#D63A3A]" />
                  <span>Recent Searches ({recentSearches.length}/5)</span>
                </span>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearRecentSearches();
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-500 hover:text-[#D63A3A] cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
              <ul className="divide-y divide-zinc-100">
                {recentSearches.slice(0, 5).map((item) => (
                  <li key={item}>
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchTerm(item);
                        addRecentSearch(item);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="px-3.5 py-2 hover:bg-zinc-50 flex items-center justify-between gap-2 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#D63A3A] shrink-0" />
                        <span className="text-xs font-semibold text-zinc-800 group-hover:text-[#D63A3A] truncate">
                          {item}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <ArrowUpLeft className="w-3 h-3 text-zinc-300" />
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeRecentSearch(item);
                          }}
                          className="p-1 text-zinc-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-sans cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--surface-2)] text-[var(--gold)] border border-[var(--gold)]/30 shadow-xs'
                  : 'bg-[var(--surface-2)]/50 text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}

          <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] cursor-pointer pl-3 border-l border-[var(--border)] whitespace-nowrap font-medium">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-[var(--red)] rounded focus:ring-0 accent-[var(--red)]"
            />
            <span>In Stock</span>
          </label>
        </div>
      </div>

      {/* Listing Display */}
      {wholesaleProducts.length === 0 ? (
        <div className="bg-[var(--surface-1)] p-12 text-center rounded-2xl border border-[var(--border)] text-[var(--text-muted)] shadow-xs">
          <Package className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text)]">No wholesale products found matching your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="mt-3 text-xs font-bold text-[var(--red)] underline font-mono tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <>
          {/* ======================================================== */}
          {/* 1. MOBILE RESPONSIVE SPEC CARDS (< md: NO CUTOFFS!)     */}
          {/* ======================================================== */}
          <div className="block md:hidden space-y-3.5" data-alert-v={alertVersion}>
            {wholesaleProducts.map((p) => {
              const wholesalePrice = p.wholesalePrice || Math.round(p.price * 0.7);
              const saving = p.price - wholesalePrice;
              const savePct = Math.round((saving / p.price) * 100);
              const isOutOfStock =
                p.stockStatus === 'Out of Stock' ||
                (p.stockQuantity !== undefined && p.stockQuantity <= 0);
              const hasAlert = isOutOfStock && isProductSubscribedForAlert(p.id);
              const minOrderQty =
                p.wholesaleMinQty
                  ? `${p.wholesaleMinQty} Pcs`
                  : p.category === 'Counter Books'
                  ? '1 Carton'
                  : '50 Pcs';

              const directWa = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                `Hello OMEGA Tanzania, I want to place a wholesale order for: ${p.name} (SKU: ${p.sku}) - Wholesale Price: ${currency} ${wholesalePrice.toLocaleString()}. Please confirm availability.`
              )}`;

              return (
                <div
                  key={p.id}
                  className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-4 shadow-xs space-y-3"
                >
                  {/* Top: Image + Info */}
                  <div className="flex items-start gap-3">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setQuickViewProduct(p)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setQuickViewProduct(p);
                        }
                      }}
                      title={`Quick View: ${p.name}`}
                      className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] relative group/img cursor-pointer"
                    >
                      <ProductImage
                        image={p.image}
                        alt={p.name}
                        variant="thumb"
                        className="w-full h-full"
                      />
                      <span className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--gold)] text-[10px] font-mono uppercase font-bold tracking-wider border border-[var(--border)]">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          SKU: {p.sku}
                        </span>
                      </div>

                      <Link
                        to={`/product/${p.id}`}
                        className="font-bold text-sm text-[var(--text)] hover:text-[var(--red)] transition-colors leading-snug block line-clamp-2"
                      >
                        {p.name}
                      </Link>

                      {p.packaging && (
                        <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5 truncate">
                          {p.packaging}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Pricing & Packaging Details */}
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-bold">
                        Wholesale Price
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-mono font-black text-base text-emerald-400">
                          {formatPrice(wholesalePrice, currency)}
                        </span>
                        <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                          {formatPrice(p.price, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-block mb-1">
                        {savePct}% OFF
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] font-medium block">
                        Min: <strong className="text-[var(--text)]">{minOrderQty}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openCompareWithProduct(p.id)}
                      title="Compare specifications side-by-side"
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                        isInCompare(p.id)
                          ? 'bg-[#D63A3A]/10 text-[#D63A3A] border-[#D63A3A]/30'
                          : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--red)]'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Compare</span>
                    </button>
                    {isOutOfStock ? (
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(p)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                          hasAlert
                            ? 'bg-emerald-600/15 text-emerald-700 border border-emerald-500/30'
                            : 'bg-[#25D366] hover:bg-[#1ebe5d] text-white'
                        }`}
                      >
                        {hasAlert ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Alert Set</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5" />
                            <span>Notify Me on WhatsApp</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <>
                        <a
                          href={directWa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Order on WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onAddToCart(p.id, 1, true)}
                          className="py-2.5 px-3.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-1)] text-[var(--text)] border border-[var(--border)] transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                          title="Add to cart / bag"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 2. DESKTOP RICH DATA TABLE (>= md)                       */}
          {/* ======================================================== */}
          <div className="hidden md:block bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-xs overflow-hidden" data-alert-v={alertVersion}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-2)] text-[var(--text)] uppercase tracking-wider text-[11px] font-mono border-b border-[var(--border)]">
                    <th className="py-4 px-5 font-bold">Product</th>
                    <th className="py-4 px-4 font-bold">Category</th>
                    <th className="py-4 px-4 font-bold text-[var(--text-muted)]">Retail MSRP</th>
                    <th className="py-4 px-4 font-bold text-[var(--red)]">Wholesale Price</th>
                    <th className="py-4 px-4 font-bold">Min Order</th>
                    <th className="py-4 px-4 font-bold">Savings</th>
                    <th className="py-4 px-5 font-bold text-center">Procurement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
                  {wholesaleProducts.map((p) => {
                    const wholesalePrice = p.wholesalePrice || Math.round(p.price * 0.7);
                    const saving = p.price - wholesalePrice;
                    const savePct = Math.round((saving / p.price) * 100);
                    const isOutOfStock =
                      p.stockStatus === 'Out of Stock' ||
                      (p.stockQuantity !== undefined && p.stockQuantity <= 0);
                    const hasAlert = isOutOfStock && isProductSubscribedForAlert(p.id);
                    const minOrderQty =
                      p.wholesaleMinQty
                        ? `${p.wholesaleMinQty} Pcs`
                        : p.category === 'Counter Books'
                        ? '1 Carton'
                        : '50 Pcs';

                    const directWa = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                      `Hello OMEGA Tanzania, I want to place a wholesale order for: ${p.name} (SKU: ${p.sku}) - Wholesale Price: ${currency} ${wholesalePrice.toLocaleString()}. Please confirm availability.`
                    )}`;

                    return (
                      <tr key={p.id} className="hover:bg-[var(--surface-2)]/50 transition-colors group">
                        <td className="py-4 px-5 font-medium">
                          <div className="flex items-center gap-3.5 group/item">
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => setQuickViewProduct(p)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setQuickViewProduct(p);
                                }
                              }}
                              title={`Quick View: ${p.name}`}
                              className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border)] shrink-0 hover:border-[var(--red)] transition-colors bg-[var(--surface-2)] relative group/img cursor-pointer"
                            >
                              <ProductImage
                                image={p.image}
                                alt={p.name}
                                variant="thumb"
                                className="w-full h-full"
                              />
                              <span className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </span>
                            </div>
                            <div>
                              <Link
                                to={`/product/${p.id}`}
                                className="font-bold block text-sm hover:text-[var(--red)] transition-colors line-clamp-1 text-[var(--text)]"
                              >
                                {p.name}
                              </Link>
                              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                                SKU: {p.sku} {p.packaging ? `· ${p.packaging}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[var(--text-muted)] font-medium whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] text-[var(--gold)] border border-[var(--border)] text-[11px] font-mono">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-medium text-[var(--text-muted)] line-through whitespace-nowrap">
                          {formatPrice(p.price, currency)}
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-sm text-emerald-400 whitespace-nowrap">
                          {formatPrice(wholesalePrice, currency)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[var(--text)] whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[11px] font-mono">
                            {minOrderQty}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md font-mono">
                            {savePct}% OFF
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openCompareWithProduct(p.id)}
                              title="Compare specifications side-by-side"
                              className={`py-1.5 px-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider inline-flex items-center gap-1 border transition-colors cursor-pointer ${
                                isInCompare(p.id)
                                  ? 'bg-[#D63A3A]/10 text-[#D63A3A] border-[#D63A3A]/30'
                                  : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--red)]'
                              }`}
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                              <span>Compare</span>
                            </button>
                            {isOutOfStock ? (
                              <button
                                type="button"
                                onClick={() => setQuickViewProduct(p)}
                                className={`py-1.5 px-3 rounded-lg transition-colors text-xs font-bold font-mono uppercase tracking-wider inline-flex items-center gap-1 shadow-xs cursor-pointer ${
                                  hasAlert
                                    ? 'bg-emerald-600/15 text-emerald-700 border border-emerald-500/30'
                                    : 'bg-[#25D366] text-white hover:bg-[#1ebe5d]'
                                }`}
                                title="Get notified on WhatsApp when back in stock"
                              >
                                {hasAlert ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Alert Set</span>
                                  </>
                                ) : (
                                  <>
                                    <Bell className="w-3.5 h-3.5" />
                                    <span>Notify Me</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <>
                                <a
                                  href={directWa}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-1.5 px-3 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors text-xs font-bold font-mono uppercase tracking-wider inline-flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Order Carton on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                  <span>Order</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => onAddToCart(p.id, 1, true)}
                                  className="p-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-1)] text-[var(--text)] border border-[var(--border)] transition-colors shadow-xs cursor-pointer"
                                  title="Add to cart / bag"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {wholesaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
