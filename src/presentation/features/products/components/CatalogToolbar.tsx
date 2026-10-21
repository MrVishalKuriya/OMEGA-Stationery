import React from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  RotateCcw,
} from 'lucide-react';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'pages-desc';
export type ViewMode = 'grid' | 'list';

interface CatalogToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  selectedCategory: string;
  selectedQuire: string;
  selectedRuling: string;
  selectedBinding: string;
  appliedPriceRange: { min: number | null; max: number | null };
  inStockOnly: boolean;
  bestsellerOnly: boolean;
  onClearFilter: (key: string) => void;
  onResetFilters: () => void;
  language: string;
}

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  activeFilterCount,
  totalFilteredCount,
  selectedCategory,
  selectedQuire,
  selectedRuling,
  selectedBinding,
  appliedPriceRange,
  inStockOnly,
  bestsellerOnly,
  onClearFilter,
  onResetFilters,
  language,
}) => {
  return (
    <div className="space-y-3">
      {/* Search & Top Action Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'sw' ? 'Tafuta daftari, kurasa, au SKU...' : 'Search notebooks, pages, SKU...'}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full border border-stone-200 focus:outline-none focus:border-[#4b423b] bg-stone-50 text-[#2b2520] placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-[#4b423b] inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#c49b7c] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="hidden md:inline font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="pages-desc">Most Pages</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-[#2b2520]' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-[#2b2520]' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-500 font-medium">Active Filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              Category: {selectedCategory}
              <button type="button" onClick={() => onClearFilter('category')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedQuire !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              Quire: {selectedQuire}
              <button type="button" onClick={() => onClearFilter('quire')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedRuling !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              Ruling: {selectedRuling}
              <button type="button" onClick={() => onClearFilter('ruling')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedBinding !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              Binding: {selectedBinding}
              <button type="button" onClick={() => onClearFilter('binding')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              Price: {appliedPriceRange.min || 0} - {appliedPriceRange.max || '∞'}
              <button type="button" onClick={() => onClearFilter('price')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              In Stock Only
              <button type="button" onClick={() => onClearFilter('inStock')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {bestsellerOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              Bestsellers Only
              <button type="button" onClick={() => onClearFilter('bestseller')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-amber-800 hover:text-amber-950 font-bold ml-1 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
};
