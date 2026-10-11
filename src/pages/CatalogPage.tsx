import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Settings } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES, ProductCategory } from '../types/store';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export const CatalogPage: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  useEffect(() => {
    const catParam = searchParams.get('category');
    const qParam = searchParams.get('q');
    if (catParam && PRODUCT_CATEGORIES.includes(catParam as ProductCategory)) {
      setSelectedCategory(catParam);
    } else if (!catParam) {
      setSelectedCategory('All');
    }
    if (qParam !== null) {
      setSearchQuery(qParam);
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
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title={
          selectedCategory === 'All'
            ? 'Product Catalog (35+ Books & Stationery Items)'
            : `${selectedCategory} – Stationery Catalog`
        }
        description="Browse exercise books, hardcover notebooks, school stationery, pens, pencils, art supplies, and office essentials with INR pricing."
      />

      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link to="/" className="hover:text-stone-900">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-stone-900 font-medium">Product Catalog</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2d0910]">
            Stationery &amp; Books Catalog
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl font-normal">
            Explore authentic OMEGA Counter Books, Indigo exercise books, kraft bahasha envelopes, and school stationery manufactured for enduring quality.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-600 shrink-0">
          <span className="font-mono-tabular font-semibold text-stone-900">
            Showing {filteredProducts.length} of {products.length} items
          </span>
          <span aria-hidden="true">·</span>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-[#7c293a] hover:text-[#4a121c] font-semibold"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Manage Inventory</span>
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#fcfaf7] border border-[#ebdcd0] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by product name, ruling type, or SKU (e.g., OMG-CB-Q2)..."
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ebdcd0] rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#4a121c]"
            />
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
            <label htmlFor="sort-select" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2.5 bg-white border border-[#ebdcd0] rounded-lg text-sm text-stone-900 focus:outline-none focus:border-[#4a121c]"
            >
              <option value="featured">Sort: Featured &amp; Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Stock Filter & Reset */}
          <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
            <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-red-700 focus:ring-red-700"
              />
              <span>In Stock Only</span>
            </label>

            {(selectedCategory !== 'All' || searchQuery || sortBy !== 'featured' || inStockOnly) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Buttons */}
        <div
          role="group"
          aria-label="Filter by product category"
          className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1"
        >
          <button
            type="button"
            onClick={() => handleCategoryChange('All')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 uppercase tracking-wider ${
              selectedCategory === 'All'
                ? 'bg-[#4a121c] text-white shadow-xs'
                : 'bg-white text-stone-700 border border-[#ebdcd0] hover:border-stone-400'
            }`}
          >
            All Categories ({products.length})
          </button>

          {PRODUCT_CATEGORIES.map((category) => {
            const count = products.filter((p) => p.category === category).length;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 uppercase tracking-wider ${
                  isSelected
                    ? 'bg-[#4a121c] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-[#ebdcd0] hover:border-stone-400'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-12 text-center max-w-lg mx-auto my-8 space-y-4">
          <h2 className="text-xl font-bold text-stone-900">
            No matching stationery products found
          </h2>
          <p className="text-sm text-stone-600">
            We could not find any items matching your current search or category filters. Try clearing your search query or viewing all categories.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-red-800 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
