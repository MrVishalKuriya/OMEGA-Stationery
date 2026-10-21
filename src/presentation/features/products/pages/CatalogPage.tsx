import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { PRODUCT_CATEGORIES, ProductCategory, Product } from '@/types/store';
import { SEOHead } from '@/components/SEOHead';
import { CatalogHero } from '../components/CatalogHero';
import { CatalogFilterSidebar } from '../components/CatalogFilterSidebar';
import { CatalogToolbar, SortOption, ViewMode } from '../components/CatalogToolbar';
import { CatalogProductList } from '../components/CatalogProductList';

export const CatalogPage: React.FC = () => {
  const { products, language, storeConfig, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currency = storeConfig.currencySymbol || 'TSh';
  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');

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

  // Dynamic categories
  const availableCategories = useMemo(() => {
    const list = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) list.add(p.category.trim());
    });
    PRODUCT_CATEGORIES.forEach((c) => list.add(c));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const rulingOptions = [
    { id: 'All', label: 'All Rulings' },
    { id: 'Single Line', label: 'Single Line (SL)' },
    { id: 'Double Line', label: 'Double Line (DL)' },
    { id: 'Square Ruled', label: 'Square Ruled / Maths (SQ)' },
    { id: 'Plain', label: 'Plain / Unruled' },
    { id: 'Feint Ruled', label: 'Feint Ruled (Red Margin)' },
  ];

  const bindingOptions = [
    { id: 'All', label: 'All Bindings' },
    { id: 'Thread-Sewn Hardcover', label: 'Hardcover (Double Thread-Sewn)' },
    { id: 'Center Stitched', label: 'Softcover (Center Stitched)' },
    { id: 'Kraft Bahasha', label: 'Reinforced Kraft Bahasha' },
    { id: 'Spiral', label: 'Spiral Wiro Binding' },
  ];

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

  // Reset page when filter changes
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

  // Sync with URL params
  useEffect(() => {
    const catParam = searchParams.get('category');
    const qParam = searchParams.get('q');
    const quireParam = searchParams.get('quire');

    if (catParam) setSelectedCategory(catParam);
    if (qParam !== null) setSearchQuery(qParam);
    if (quireParam) setSelectedQuire(quireParam);
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'All') nextParams.delete('category');
    else nextParams.set('category', category);
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (!value.trim()) nextParams.delete('q');
    else nextParams.set('q', value);
    setSearchParams(nextParams, { replace: true });
  };

  const handleApplyPrice = () => {
    const min = priceMin ? parseFloat(priceMin) : null;
    const max = priceMax ? parseFloat(priceMax) : null;
    setAppliedPriceRange({ min, max });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedQuire('All');
    setSelectedRuling('All');
    setSelectedBinding('All');
    setPriceMin('');
    setPriceMax('');
    setAppliedPriceRange({ min: null, max: null });
    setSearchQuery('');
    setInStockOnly(false);
    setBestsellerOnly(false);
    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  const handleClearFilter = (key: string) => {
    if (key === 'category') handleCategoryChange('All');
    if (key === 'quire') setSelectedQuire('All');
    if (key === 'ruling') setSelectedRuling('All');
    if (key === 'binding') setSelectedBinding('All');
    if (key === 'price') {
      setPriceMin('');
      setPriceMax('');
      setAppliedPriceRange({ min: null, max: null });
    }
    if (key === 'inStock') setInStockOnly(false);
    if (key === 'bestseller') setBestsellerOnly(false);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category Filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Quire Filter
      if (selectedQuire !== 'All') {
        const matchesQuire = p.quire && p.quire.toLowerCase().includes(selectedQuire.toLowerCase());
        const matchesSku = p.sku.toLowerCase().includes(selectedQuire.toLowerCase());
        const matchesName = p.name.toLowerCase().includes(selectedQuire.toLowerCase());
        const matchesPage = p.pageCount && p.pageCount.includes(selectedQuire);
        if (!matchesQuire && !matchesSku && !matchesName && !matchesPage) return false;
      }

      // Ruling Style Filter
      if (selectedRuling !== 'All') {
        const rulingField = `${p.paperType || ''} ${p.description || ''} ${p.name || ''}`.toLowerCase();
        if (!rulingField.includes(selectedRuling.toLowerCase())) return false;
      }

      // Binding Type Filter
      if (selectedBinding !== 'All') {
        const bindingField = `${p.description || ''} ${p.name || ''}`.toLowerCase();
        if (!bindingField.includes(selectedBinding.toLowerCase())) return false;
      }

      // Price Range Filter
      const effectivePrice = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
      if (appliedPriceRange.min !== null && effectivePrice < appliedPriceRange.min) return false;
      if (appliedPriceRange.max !== null && effectivePrice > appliedPriceRange.max) return false;

      // In Stock Filter
      if (inStockOnly && p.stockStatus !== 'In Stock') return false;

      // Bestseller Filter
      if (bestsellerOnly && !p.badge) return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'pages-desc') {
        const pagesA = parseInt(a.pageCount || '0') || 0;
        const pagesB = parseInt(b.pageCount || '0') || 0;
        return pagesB - pagesA;
      }
      return 0; // 'featured'
    });
  }, [
    products,
    selectedCategory,
    selectedQuire,
    selectedRuling,
    selectedBinding,
    appliedPriceRange,
    inStockOnly,
    bestsellerOnly,
    searchQuery,
    sortBy,
  ]);

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedQuire !== 'All') count++;
    if (selectedRuling !== 'All') count++;
    if (selectedBinding !== 'All') count++;
    if (appliedPriceRange.min !== null || appliedPriceRange.max !== null) count++;
    if (inStockOnly) count++;
    if (bestsellerOnly) count++;
    return count;
  }, [
    selectedCategory,
    selectedQuire,
    selectedRuling,
    selectedBinding,
    appliedPriceRange,
    inStockOnly,
    bestsellerOnly,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, ITEMS_PER_PAGE]);

  return (
    <div className="bg-[#faf9f8] min-h-screen text-[#2b2520] pb-20">
      <SEOHead
        title="Official Catalog — OMEGA Tanzania Counter Books & Stationery"
        description="Browse all genuine OMEGA Counter Books, Exercise Books, and heavy kraft bahasha manufactured in Soweto SIDO, Mbeya."
      />

      {/* Hero Header */}
      <CatalogHero language={language} totalProductsCount={products.length} />

      {/* Main Catalog Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <CatalogFilterSidebar
            availableCategories={availableCategories}
            categoryCounts={categoryCounts}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            quireOptions={quireOptions}
            selectedQuire={selectedQuire}
            onSelectQuire={setSelectedQuire}
            rulingOptions={rulingOptions}
            selectedRuling={selectedRuling}
            onSelectRuling={setSelectedRuling}
            bindingOptions={bindingOptions}
            selectedBinding={selectedBinding}
            onSelectBinding={setSelectedBinding}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            onApplyPriceFilter={handleApplyPrice}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            bestsellerOnly={bestsellerOnly}
            setBestsellerOnly={setBestsellerOnly}
            hasActiveFilters={activeFilterCount > 0}
            onResetFilters={handleResetFilters}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            currency={currency}
            language={language}
          />

          {/* Catalog Listing Area */}
          <main className="flex-1 w-full space-y-6">
            <CatalogToolbar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
              activeFilterCount={activeFilterCount}
              totalFilteredCount={filteredProducts.length}
              selectedCategory={selectedCategory}
              selectedQuire={selectedQuire}
              selectedRuling={selectedRuling}
              selectedBinding={selectedBinding}
              appliedPriceRange={appliedPriceRange}
              inStockOnly={inStockOnly}
              bestsellerOnly={bestsellerOnly}
              onClearFilter={handleClearFilter}
              onResetFilters={handleResetFilters}
              language={language}
            />

            <CatalogProductList
              products={paginatedProducts}
              viewMode={viewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              currency={currency}
              cleanWhatsappDigits={cleanWhatsappDigits}
              language={language}
              onAddToCart={addToCart}
              onResetFilters={handleResetFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
};
export default CatalogPage;
