import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Settings, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES, ProductCategory } from '../types/store';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export const CatalogPage: React.FC = () => {
  const { products, language } = useStore();
  const t = TRANSLATIONS[language];
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialQuire = searchParams.get('quire') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedQuire, setSelectedQuire] = useState<string>(initialQuire);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  // Pre-calculate category product counts once O(N) rather than iterating in render loops
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedQuire, searchQuery, sortBy, inStockOnly]);

  useEffect(() => {
    const catParam = searchParams.get('category');
    const qParam = searchParams.get('q');
    const quireParam = searchParams.get('quire');

    if (catParam && PRODUCT_CATEGORIES.includes(catParam as ProductCategory)) {
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

  const handleQuireChange = (quire: string) => {
    setSelectedQuire(quire);
    setCurrentPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (quire === 'All') {
      nextParams.delete('quire');
    } else {
      nextParams.set('quire', quire);
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

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedQuire('All');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((p) => {
      if (selectedCategory !== 'All') {
        const isCatMatch =
          p.category === selectedCategory ||
          (selectedCategory === 'Files & Folders' && p.category === 'Manila & Folders') ||
          (selectedCategory === 'Bulk & Wholesale Paper' && (p.category === 'Ruled Paper' || p.category === 'Flipcharts'));
        if (!isCatMatch) return false;
      }
      if (selectedQuire !== 'All') {
        const targetQuire = selectedQuire.toLowerCase();
        const matchesQuire =
          (p.quire && p.quire.toLowerCase().includes(targetQuire)) ||
          (p.name && p.name.toLowerCase().includes(targetQuire));
        if (!matchesQuire) return false;
      }
      if (inStockOnly && p.stockStatus === 'Out of Stock') {
        return false;
      }
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
      // Default: featured first, then bestSeller
      const scoreA = (a.featured ? 2 : 0) + (a.bestSeller ? 1 : 0);
      const scoreB = (b.featured ? 2 : 0) + (b.bestSeller ? 1 : 0);
      return scoreB - scoreA;
    });
  }, [products, selectedCategory, selectedQuire, searchQuery, sortBy, inStockOnly]);

  // E-Commerce Pagination Slicing
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full max-w-full overflow-hidden">
      <SEOHead
        title={
          selectedCategory === 'All'
            ? 'Stationery & Books Catalogue — OMEGA Tanzania'
            : `${selectedCategory} — OMEGA Catalogue`
        }
        description="Browse genuine OMEGA Counter Books (Q2, Q3, Q4), Exercise Books, Bahasha, Registers, and School Stationery with TZS pricing."
      />

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <Link to="/" className="hover:text-slate-900">
              {t.home}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-bold">{t.catalog}</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-stone-900">
            {language === 'sw' ? 'Katalogi ya Vitabu & Stationery' : 'Stationery & Notebooks Catalogue'}
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl font-normal font-outfit">
            {language === 'sw'
              ? 'Tazama madaftari asilia ya OMEGA yenye majalada magumu, madaftari ya mazoezi, na bahasha nzito kwa bei za kiwanda nchini Tanzania.'
              : 'Explore authentic OMEGA Counter Books, school exercise notebooks, heavy kraft bahasha, and registers manufactured for enduring quality.'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-600 shrink-0 font-space">
          <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            {filteredProducts.length} {language === 'sw' ? 'Bidhaa Zimepatikana' : 'Products Available'}
          </span>
        </div>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="featured">Sort: Featured &amp; Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Stock Filter & Reset */}
          <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span>{language === 'sw' ? 'Ipo Stoo Pekee' : 'In Stock Only'}</span>
            </label>

            {(selectedCategory !== 'All' || selectedQuire !== 'All' || searchQuery || inStockOnly) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quire Filter Buttons (Q2, Q3, Q4) - Only shown for Counter Books or All */}
        {(selectedCategory === 'All' || selectedCategory === 'Counter Books') && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] shrink-0">
              Quire Filter:
            </span>
            {['All', 'Q2', 'Q3', 'Q4'].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuireChange(q)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors shrink-0 ${
                  selectedQuire === q
                    ? 'bg-[#1E2A5E] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {q === 'All' ? 'All Quires' : `${q} (${q === 'Q2' ? '192p' : q === 'Q3' ? '288p' : '384p'})`}
              </button>
            ))}
          </div>
        )}

        {/* Category Buttons Bar */}
        <div
          role="group"
          aria-label="Filter by product category"
          className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none"
        >
          <button
            type="button"
            onClick={() => handleCategoryChange('All')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 uppercase tracking-wider ${
              selectedCategory === 'All'
                ? 'bg-[#1E2A5E] text-white shadow-xs border border-[#1E2A5E]'
                : 'bg-white text-stone-700 border border-[#E6E0D2] hover:border-[#1E2A5E] hover:text-[#1E2A5E]'
            }`}
          >
            {t.allProducts} ({products.length})
          </button>

          {PRODUCT_CATEGORIES.map((category) => {
            const count = categoryCounts[category] || 0;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 uppercase tracking-wider ${
                  isSelected
                    ? 'bg-[#1E2A5E] text-white shadow-xs border border-[#1E2A5E]'
                    : 'bg-white text-stone-700 border border-[#E6E0D2] hover:border-[#1E2A5E] hover:text-[#1E2A5E]'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Contextual Category Showcase Banner for School Stationery */}
      {selectedCategory === 'School Stationery' && (
        <div className="bg-[#FAF7F0] border border-[#E6E0D2] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#1E2A5E]/10 text-[#1E2A5E] text-[10px] font-black uppercase tracking-wider">
              <span>National Curriculum &amp; Educational Supplies</span>
            </div>
            <h2 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#14182B]">
              {language === 'sw' ? 'Vifaa vya Shule & Mitihani Tanzania' : 'School Stationery, Geometry Instruments & Classroom Essentials'}
            </h2>
            <p className="text-xs text-[#6B7280] max-w-2xl leading-relaxed">
              {language === 'sw'
                ? 'Vifaa vya jiometria vya Oxford, rula za 30cm zilizonyooka, vichongeo vya DOMS, na chaki zisizotoa vumbi kwa ajili ya shule za msingi, sekondari na vyuo.'
                : 'Authentic Oxford mathematical geometry sets, 30cm acrylic rulers, DOMS counter tubs of sharpeners, and dustless white chalk available in single units and wholesale carton packs.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#E6E0D2] text-[#1E2A5E]">
              {filteredProducts.length} items listed
            </span>
          </div>
        </div>
      )}

      {/* Grid or Empty State with Pagination */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs text-[#6B7280] font-mono px-1">
            <span>
              Showing <strong className="text-[#14182B]">{startIndex + 1}–{endIndex}</strong> of <strong className="text-[#14182B]">{filteredProducts.length}</strong> stationery products
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* E-Commerce Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E4DDCC]">
              <div className="text-xs text-[#6B7280]">
                Page <strong className="text-[#1E2A5E]">{currentPage}</strong> of <strong className="text-[#1E2A5E]">{totalPages}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded-[8px] bg-white border border-[#E4DDCC] text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F0] transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`min-w-9 h-9 px-3 rounded-[8px] font-bold text-xs font-mono transition-all ${
                      currentPage === page
                        ? 'btn-cta-yellow shadow-xs'
                        : 'bg-white border border-[#E4DDCC] text-stone-700 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 rounded-[8px] bg-white border border-[#E4DDCC] text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F0] transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-black text-slate-900">
            {language === 'sw' ? 'Hakuna bidhaa inayolingana' : 'No matching stationery products found'}
          </h2>
          <p className="text-sm text-slate-600">
            {language === 'sw'
              ? 'Jaribu kuondoa maneno ya utafutaji au chagua aina zote za bidhaa kuona katalogi nzima.'
              : 'Try clearing your search query or reset filters to view all products in the catalogue.'}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#0f2342] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#1e3a8a] transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
