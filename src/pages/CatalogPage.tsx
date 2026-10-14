import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Settings, Filter } from 'lucide-react';
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
    setSearchParams({}, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedQuire !== 'All') {
        const matchesQuire =
          p.quire?.toLowerCase().includes(selectedQuire.toLowerCase()) ||
          p.name.toLowerCase().includes(selectedQuire.toLowerCase());
        if (!matchesQuire) return false;
      }
      if (inStockOnly && p.stockStatus === 'Out of Stock') {
        return false;
      }
      if (q) {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        return matchesName || matchesSku || matchesCategory || matchesDesc;
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

        {/* Quire Filter Buttons (Q2, Q3, Q4) */}
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
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {q === 'All' ? 'All Quires' : `${q} (${q === 'Q2' ? '192p' : q === 'Q3' ? '288p' : '384p'})`}
            </button>
          ))}
        </div>

        {/* Category Buttons Bar */}
        <div
          role="group"
          aria-label="Filter by product category"
          className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1"
        >
          <button
            type="button"
            onClick={() => handleCategoryChange('All')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 uppercase tracking-wider ${
              selectedCategory === 'All'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-red-400'
            }`}
          >
            {t.allProducts} ({products.length})
          </button>

          {PRODUCT_CATEGORIES.map((category) => {
            const count = products.filter((p) => p.category === category).length;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 uppercase tracking-wider ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-red-400'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
