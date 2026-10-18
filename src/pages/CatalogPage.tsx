import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  X,
  Check,
  ArrowRight,
  Eye,
  ShoppingBag,
  MessageCircle,
  Package,
  Star,
  ShieldCheck,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES, ProductCategory, Product, formatPrice } from '../types/store';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'pages-desc';
type ViewMode = 'grid' | 'list';

export const CatalogPage: React.FC = () => {
  const { products, language, storeConfig, addToCart, setQuickViewProduct } = useStore();
  const t = TRANSLATIONS[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const currency = storeConfig.currencySymbol || 'TSh';

  // URL parameters initialization
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialQuire = searchParams.get('quire') || 'All';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedQuire, setSelectedQuire] = useState<string>(initialQuire);
  const [selectedRuling, setSelectedRuling] = useState<string>('All');
  const [selectedBinding, setSelectedBinding] = useState<string>('All');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [appliedPriceRange, setAppliedPriceRange] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [bestsellerOnly, setBestsellerOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = viewMode === 'grid' ? 12 : 8;

  // Pre-calculate category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Ruling style counts
  const rulingOptions = [
    { id: 'All', label: 'All Rulings' },
    { id: 'Single Line', label: 'Single Line (SL)' },
    { id: 'Double Line', label: 'Double Line (DL)' },
    { id: 'Square Ruled', label: 'Square Ruled / Maths (SQ)' },
    { id: 'Plain', label: 'Plain / Unruled' },
    { id: 'Feint Ruled', label: 'Feint Ruled (Red Margin)' },
  ];

  // Binding options
  const bindingOptions = [
    { id: 'All', label: 'All Bindings' },
    { id: 'Thread-Sewn Hardcover', label: 'Hardcover (Double Thread-Sewn)' },
    { id: 'Center Stitched', label: 'Softcover (Center Stitched)' },
    { id: 'Kraft Bahasha', label: 'Reinforced Kraft Bahasha' },
    { id: 'Spiral', label: 'Spiral Wiro Binding' },
  ];

  // Quire & Page Count options
  const quireOptions = [
    { id: 'All', label: 'All Sizes & Quires' },
    { id: 'Q2', label: 'Quire 2 (198 Pages)' },
    { id: 'Q3', label: 'Quire 3 (288 Pages)' },
    { id: 'Q4', label: 'Quire 4 (384 Pages)' },
    { id: '200', label: '200 Pages Exercise' },
    { id: '100', label: '100 Pages Exercise' },
    { id: '80', label: '80 Pages Exercise' },
    { id: '32', label: '32 Pages Exercise' },
  ];

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedQuire,
    selectedRuling,
    selectedBinding,
    appliedPriceRange,
    searchQuery,
    sortBy,
    inStockOnly,
    bestsellerOnly,
  ]);

  // Sync state with URL Search Params
  useEffect(() => {
    const catParam = searchParams.get('category');
    const qParam = searchParams.get('q');
    const quireParam = searchParams.get('quire');

    if (catParam && (PRODUCT_CATEGORIES.includes(catParam as ProductCategory) || catParam === 'All')) {
      setSelectedCategory(catParam);
    } else if (!catParam) {
      setSelectedCategory('All');
    }
    if (qParam !== null) {
      setSearchQuery(qParam);
    }
    if (quireParam) {
      setSelectedQuire(quireParam);
    } else {
      setSelectedQuire('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (!value.trim()) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', value);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const applyPriceFilter = () => {
    const min = priceMin ? parseFloat(priceMin) : null;
    const max = priceMax ? parseFloat(priceMax) : null;
    setAppliedPriceRange({ min, max });
    setCurrentPage(1);
  };

  const resetPriceFilter = () => {
    setPriceMin('');
    setPriceMax('');
    setAppliedPriceRange({ min: null, max: null });
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedQuire('All');
    setSelectedRuling('All');
    setSelectedBinding('All');
    setPriceMin('');
    setPriceMax('');
    setAppliedPriceRange({ min: null, max: null });
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setBestsellerOnly(false);
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedQuire !== 'All') count++;
    if (selectedRuling !== 'All') count++;
    if (selectedBinding !== 'All') count++;
    if (appliedPriceRange.min !== null || appliedPriceRange.max !== null) count++;
    if (inStockOnly) count++;
    if (bestsellerOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedCategory,
    selectedQuire,
    selectedRuling,
    selectedBinding,
    appliedPriceRange,
    inStockOnly,
    bestsellerOnly,
    searchQuery,
  ]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((p) => {
      // Category Match
      if (selectedCategory !== 'All') {
        const isCatMatch =
          p.category === selectedCategory ||
          (selectedCategory === 'Files & Folders' && p.category === 'Manila & Folders') ||
          (selectedCategory === 'Bulk & Wholesale Paper' &&
            (p.category === 'Ruled Paper' || p.category === 'Flipcharts'));
        if (!isCatMatch) return false;
      }

      // Quire / Page Count Match
      if (selectedQuire !== 'All') {
        const target = selectedQuire.toLowerCase();
        const matchesQuire =
          (p.quire && p.quire.toLowerCase().includes(target)) ||
          (p.name && p.name.toLowerCase().includes(target)) ||
          (p.pageCount && p.pageCount.toLowerCase().includes(target));
        if (!matchesQuire) return false;
      }

      // Ruling Match
      if (selectedRuling !== 'All') {
        const target = selectedRuling.toLowerCase();
        const rulingField = (p.paperType || '') + ' ' + (p.description || '') + ' ' + (p.name || '');
        if (!rulingField.toLowerCase().includes(target)) return false;
      }

      // Binding Match
      if (selectedBinding !== 'All') {
        const target = selectedBinding.toLowerCase();
        const bindingField = (p.binding || '') + ' ' + (p.description || '');
        if (!bindingField.toLowerCase().includes(target)) return false;
      }

      // Price Range Filter
      const effectivePrice =
        p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
      if (appliedPriceRange.min !== null && effectivePrice < appliedPriceRange.min) {
        return false;
      }
      if (appliedPriceRange.max !== null && effectivePrice > appliedPriceRange.max) {
        return false;
      }

      // Stock Filter
      if (inStockOnly && p.stockStatus === 'Out of Stock') {
        return false;
      }

      // Bestseller Filter
      if (bestsellerOnly && !p.bestSeller) {
        return false;
      }

      // Search Query
      if (q) {
        const matchesName = p.name?.toLowerCase().includes(q) || false;
        const matchesNameSw = p.nameSw?.toLowerCase().includes(q) || false;
        const matchesSku = p.sku?.toLowerCase().includes(q) || false;
        const matchesCategory = p.category?.toLowerCase().includes(q) || false;
        const matchesDesc = p.description?.toLowerCase().includes(q) || false;
        const matchesDescSw = p.descriptionSw?.toLowerCase().includes(q) || false;
        const matchesQuire = p.quire?.toLowerCase().includes(q) || false;
        const matchesPageCount = p.pageCount?.toLowerCase().includes(q) || false;
        const matchesSize = p.size?.toLowerCase().includes(q) || false;
        const matchesPaper = p.paperType?.toLowerCase().includes(q) || false;
        const matchesBinding = p.binding?.toLowerCase().includes(q) || false;

        return (
          matchesName ||
          matchesNameSw ||
          matchesSku ||
          matchesCategory ||
          matchesDesc ||
          matchesDescSw ||
          matchesQuire ||
          matchesPageCount ||
          matchesSize ||
          matchesPaper ||
          matchesBinding
        );
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      const priceA =
        a.discountPrice && a.discountPrice < a.price ? a.discountPrice : a.price;
      const priceB =
        b.discountPrice && b.discountPrice < b.price ? b.discountPrice : b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'pages-desc') {
        const pagesA = parseInt((a.pageCount || a.quire || '0').replace(/\D/g, '')) || 0;
        const pagesB = parseInt((b.pageCount || b.quire || '0').replace(/\D/g, '')) || 0;
        return pagesB - pagesA;
      }
      // Default: featured first, then bestSeller
      const scoreA = (a.featured ? 2 : 0) + (a.bestSeller ? 1 : 0);
      const scoreB = (b.featured ? 2 : 0) + (b.bestSeller ? 1 : 0);
      return scoreB - scoreA;
    });
  }, [
    products,
    selectedCategory,
    selectedQuire,
    selectedRuling,
    selectedBinding,
    appliedPriceRange,
    searchQuery,
    sortBy,
    inStockOnly,
    bestsellerOnly,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#3b352f]">
      <SEOHead
        title={
          selectedCategory === 'All'
            ? 'Shop All Products & Stationery Catalogue | OMEGA Tanzania'
            : `${selectedCategory} — Shop OMEGA Catalogue`
        }
        description="Shop genuine OMEGA Hardcover Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha envelopes, registers, and stationery supplies. Factory-direct wholesale & retail."
      />

      {/* ==================== 1. PAGE HEADER & BREADCRUMB ==================== */}
      <div className="bg-white border-b border-[#e2dedb] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8c847e] font-medium mb-1">
                <Link to="/" className="hover:text-[#4b423b] transition-colors">
                  {t.home}
                </Link>
                <span>/</span>
                <span className="text-[#4b423b] font-semibold">{t.catalog}</span>
                {selectedCategory !== 'All' && (
                  <>
                    <span>/</span>
                    <span className="text-[#c49b7c] font-semibold">{selectedCategory}</span>
                  </>
                )}
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#3b352f] tracking-tight">
                {selectedCategory === 'All'
                  ? language === 'sw'
                    ? 'Katalogi ya Bidhaa Zote'
                    : 'Shop All Products'
                  : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-[#8c847e] mt-1 max-w-xl">
                {language === 'sw'
                  ? 'Madaftari asilia ya OMEGA, vifaa vya shule na ofisi kwa bei ya moja kwa moja kutoka kiwandani.'
                  : 'Premium notebooks, registers, exercise books, and kraft envelopes at factory-direct pricing in Tanzania.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="/sheet/Indigo_Printed_Price_List.xlsx"
                download="Indigo_Printed_Price_List_2026.xlsx"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4b423b] hover:bg-[#3b352f] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                title="Download Official 2026 Price List (Excel)"
              >
                <Download className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>Price List (.xlsx)</span>
              </a>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f5f4f4] border border-[#e2dedb] text-[#4b423b]">
                {filteredProducts.length} {language === 'sw' ? 'Bidhaa' : 'Products'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. MAIN SHOP LAYOUT ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ==================== LEFT SIDEBAR FILTERS (Indra Notebook shop-sidebar) ==================== */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#e2dedb] rounded-2xl p-5 space-y-6 shadow-xs sticky top-28">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e2dedb]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#3b352f] uppercase tracking-wider">
                  <Filter className="w-4 h-4 text-[#c49b7c]" />
                  <span>Filter Products</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-[#c49b7c] hover:underline inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* 1. Search Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3b352f] block">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8c847e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search notebooks, SKU..."
                    className="w-full pl-9 pr-7 py-2 bg-[#fafafa] border border-[#e2dedb] rounded-xl text-xs text-[#3b352f] placeholder:text-[#8c847e] focus:outline-none focus:border-[#4b423b] transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c847e] hover:text-[#3b352f]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Categories Filter */}
              <div className="space-y-2 pt-2 border-t border-[#e2dedb]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3b352f] block">
                  Categories
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  <label className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded-lg hover:bg-[#f5f4f4] transition-colors">
                    <span className="flex items-center gap-2 font-medium">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === 'All'}
                        onChange={() => handleCategoryChange('All')}
                        className="w-3.5 h-3.5 text-[#4b423b] focus:ring-[#4b423b]"
                      />
                      <span>All Categories</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#8c847e]">({products.length})</span>
                  </label>

                  {PRODUCT_CATEGORIES.map((cat) => {
                    const count = categoryCounts[cat] || 0;
                    return (
                      <label
                        key={cat}
                        className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded-lg hover:bg-[#f5f4f4] transition-colors"
                      >
                        <span className="flex items-center gap-2 font-medium truncate">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === cat}
                            onChange={() => handleCategoryChange(cat)}
                            className="w-3.5 h-3.5 text-[#4b423b] focus:ring-[#4b423b]"
                          />
                          <span className="truncate">{cat}</span>
                        </span>
                        <span className="text-[11px] font-mono text-[#8c847e]">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Range Filter (Min & Max Inputs) */}
              <div className="space-y-2.5 pt-2 border-t border-[#e2dedb]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3b352f] block">
                  Price Range ({currency})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    className="w-full px-2.5 py-1.5 bg-[#fafafa] border border-[#e2dedb] rounded-lg text-xs font-mono focus:outline-none focus:border-[#4b423b]"
                  />
                  <span className="text-[#8c847e]">—</span>
                  <input
                    type="number"
                    min="0"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    className="w-full px-2.5 py-1.5 bg-[#fafafa] border border-[#e2dedb] rounded-lg text-xs font-mono focus:outline-none focus:border-[#4b423b]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={applyPriceFilter}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#4b423b] text-white text-xs font-semibold hover:bg-[#3b352f] transition-colors"
                  >
                    Apply Price
                  </button>
                  {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
                    <button
                      type="button"
                      onClick={resetPriceFilter}
                      className="px-2.5 py-1.5 rounded-lg border border-[#e2dedb] text-[#8c847e] hover:text-[#3b352f] text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Ruling Style Filter (Indra Notebook shop feature) */}
              <div className="space-y-2 pt-2 border-t border-[#e2dedb]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3b352f] block">
                  Ruling Style
                </label>
                <div className="space-y-1">
                  {rulingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-xs cursor-pointer p-1 rounded hover:bg-[#f5f4f4] transition-colors"
                    >
                      <input
                        type="radio"
                        name="ruling"
                        checked={selectedRuling === opt.id}
                        onChange={() => setSelectedRuling(opt.id)}
                        className="w-3.5 h-3.5 text-[#4b423b] focus:ring-[#4b423b]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Quire / Page Count Filter */}
              <div className="space-y-2 pt-2 border-t border-[#e2dedb]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3b352f] block">
                  Size &amp; Quire
                </label>
                <div className="space-y-1">
                  {quireOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-xs cursor-pointer p-1 rounded hover:bg-[#f5f4f4] transition-colors"
                    >
                      <input
                        type="radio"
                        name="quire"
                        checked={selectedQuire === opt.id}
                        onChange={() => setSelectedQuire(opt.id)}
                        className="w-3.5 h-3.5 text-[#4b423b] focus:ring-[#4b423b]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Quick Checkbox Toggles */}
              <div className="space-y-2 pt-2 border-t border-[#e2dedb]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3b352f] block">
                  Preferences
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#e2dedb] text-[#4b423b] focus:ring-[#4b423b]"
                    />
                    <span>In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bestsellerOnly}
                      onChange={(e) => setBestsellerOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#e2dedb] text-[#4b423b] focus:ring-[#4b423b]"
                    />
                    <span>Bestsellers Only</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* ==================== MAIN CONTENT AREA ==================== */}
          <main className="col-span-1 lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white border border-[#e2dedb] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
              {/* Mobile Filter Button & Results Count */}
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f4f4] border border-[#e2dedb] text-xs font-bold text-[#3b352f]"
                >
                  <Filter className="w-3.5 h-3.5 text-[#c49b7c]" />
                  <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
                </button>

                <span className="text-xs text-[#8c847e] font-mono">
                  Showing <strong>{startIndex + 1}–{endIndex}</strong> of <strong>{filteredProducts.length}</strong> items
                </span>
              </div>

              {/* View Mode & Sort Dropdown */}
              <div className="flex items-center gap-3 ml-auto">
                {/* View Switcher: Grid vs List */}
                <div className="flex items-center bg-[#f5f4f4] border border-[#e2dedb] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid View"
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#4b423b] shadow-2xs font-bold'
                        : 'text-[#8c847e] hover:text-[#3b352f]'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="List View"
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-[#4b423b] shadow-2xs font-bold'
                        : 'text-[#8c847e] hover:text-[#3b352f]'
                    }`}
                    title="Detailed Tender List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8c847e] shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort products"
                    className="px-3 py-1.5 bg-[#fafafa] border border-[#e2dedb] rounded-lg text-xs font-semibold text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="pages-desc">Pages: Most to Least</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-xs text-[#8c847e] font-semibold">Active Filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f4f4] border border-[#e2dedb] text-[11px] font-bold text-[#4b423b]">
                    <span>Category: {selectedCategory}</span>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('All')}
                      className="text-[#8c847e] hover:text-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedQuire !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f4f4] border border-[#e2dedb] text-[11px] font-bold text-[#4b423b]">
                    <span>Size: {selectedQuire}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedQuire('All')}
                      className="text-[#8c847e] hover:text-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedRuling !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f4f4] border border-[#e2dedb] text-[11px] font-bold text-[#4b423b]">
                    <span>Ruling: {selectedRuling}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRuling('All')}
                      className="text-[#8c847e] hover:text-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f4f4] border border-[#e2dedb] text-[11px] font-bold text-[#4b423b]">
                    <span>
                      Price: {appliedPriceRange.min || 0}–{appliedPriceRange.max || '∞'} {currency}
                    </span>
                    <button type="button" onClick={resetPriceFilter} className="text-[#8c847e] hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f4f4] border border-[#e2dedb] text-[11px] font-bold text-[#4b423b]">
                    <span>In Stock Only</span>
                    <button type="button" onClick={() => setInStockOnly(false)} className="text-[#8c847e] hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {bestsellerOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f5f4f4] border border-[#e2dedb] text-[11px] font-bold text-[#4b423b]">
                    <span>Bestseller</span>
                    <button type="button" onClick={() => setBestsellerOnly(false)} className="text-[#8c847e] hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-[#c49b7c] hover:underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="lg:hidden bg-white border border-[#e2dedb] rounded-2xl p-4 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2dedb]">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#3b352f]">Filter Options</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 text-[#8c847e]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#3b352f] uppercase">Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#fafafa] border border-[#e2dedb] rounded-lg text-xs"
                  >
                    <option value="All">All Categories ({products.length})</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c} ({categoryCounts[c] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Quire */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#3b352f] uppercase">Quire / Size</span>
                  <select
                    value={selectedQuire}
                    onChange={(e) => setSelectedQuire(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#fafafa] border border-[#e2dedb] rounded-lg text-xs"
                  >
                    {quireOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-2 bg-[#4b423b] text-white rounded-lg text-xs font-semibold"
                  >
                    View Results ({filteredProducts.length})
                  </button>
                </div>
              </div>
            )}

            {/* Product Listing */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-8">
                {viewMode === 'grid' ? (
                  /* ================= GRID VIEW ================= */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  /* ================= DETAILED LIST / WHOLESALE TENDER VIEW ================= */
                  <div className="space-y-4">
                    {paginatedProducts.map((p) => {
                      const effectivePrice =
                        p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
                      const hasDiscount = effectivePrice < p.price;
                      const directWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                        `Hello OMEGA Tanzania, I would like to order: ${p.name} (SKU: ${p.sku}) - Price: ${currency} ${effectivePrice.toLocaleString()}. Please confirm availability and delivery.`
                      )}`;

                      return (
                        <div
                          key={p.id}
                          className="bg-white border border-[#e2dedb] hover:border-[#c49b7c] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all shadow-xs ledup-card ledup-sheen"
                        >
                          {/* Image Thumbnail */}
                          <div className="w-full md:w-36 h-36 bg-[#fafafa] rounded-xl border border-[#e2dedb] p-2 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {p.badge && (
                              <span className="absolute top-2 left-2 z-10 bg-[#c49b7c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                                {p.badge}
                              </span>
                            )}
                            <img
                              src={p.image}
                              alt={p.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>

                          {/* Info Column */}
                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono uppercase font-bold text-[#8c847e]">
                                SKU: {p.sku} · {p.category}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{p.stockStatus || 'In Stock'}</span>
                              </span>
                            </div>

                            <h3 className="font-heading text-base font-bold text-[#3b352f]">
                              <Link to={`/product/${p.id}`} className="hover:text-[#c49b7c] transition-colors">
                                {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                              </Link>
                            </h3>

                            <p className="text-xs text-[#8c847e] line-clamp-2">
                              {language === 'sw' && p.descriptionSw ? p.descriptionSw : p.description}
                            </p>

                            {/* Technical Specs Tags */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#4b423b]">
                              {p.quire && (
                                <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                                  {p.quire}
                                </span>
                              )}
                              {p.pageCount && (
                                <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                                  {p.pageCount}
                                </span>
                              )}
                              {p.paperType && (
                                <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                                  {p.paperType}
                                </span>
                              )}
                              {p.packaging && (
                                <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                                  Box: {p.packaging}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price & Action Column */}
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-44 gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#e2dedb]">
                            <div className="text-left md:text-right">
                              <div className="text-lg font-bold font-mono text-[#3b352f]">
                                {formatPrice(effectivePrice, currency)}
                              </div>
                              {hasDiscount && (
                                <div className="text-[11px] text-[#8c847e] line-through font-mono">
                                  {formatPrice(p.price, currency)}
                                </div>
                              )}
                              {p.wholesalePrice && (
                                <div className="text-[10px] text-[#c49b7c] font-bold font-mono">
                                  Carton: {formatPrice(p.wholesalePrice, currency)}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => addToCart(p.id, 1, true)}
                                className="px-3.5 py-2 rounded-full btn-ledup-copper text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                                title="Add to Bag"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </button>
                              <a
                                href={directWhatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-[#4b423b] hover:bg-[#3b352f] text-white transition-colors"
                                title="Order on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ==================== 3. NUMBERED PAGINATION ==================== */}
                {totalPages > 1 && (
                  <nav
                    role="navigation"
                    aria-label="Pagination"
                    className="flex items-center justify-center gap-2 pt-8 border-t border-[#e2dedb]"
                  >
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-[#e2dedb] bg-white text-xs font-bold text-[#4b423b] hover:bg-[#f5f4f4] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={`w-9 h-9 rounded-lg text-xs font-bold font-mono transition-all ${
                            isCurrent
                              ? 'bg-[#4b423b] text-white shadow-xs'
                              : 'bg-white border border-[#e2dedb] text-[#3b352f] hover:bg-[#f5f4f4]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-[#e2dedb] bg-white text-xs font-bold text-[#4b423b] hover:bg-[#f5f4f4] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </nav>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white border border-[#e2dedb] rounded-2xl p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#f5f4f4] border border-[#e2dedb] flex items-center justify-center mx-auto text-[#8c847e]">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#3b352f]">
                  {language === 'sw' ? 'Hakuna Bidhaa Iliyopatikana' : 'No Notebooks or Products Found'}
                </h3>
                <p className="text-xs sm:text-sm text-[#8c847e] max-w-md mx-auto">
                  {language === 'sw'
                    ? 'Jaribu kubadilisha vichujio au neno la utafutaji ili kuona bidhaa zilizopo kwenye katalogi yetu.'
                    : 'Try clearing some filters or searching with a different keyword to browse our complete stationery inventory.'}
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-full bg-[#4b423b] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3b352f] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
