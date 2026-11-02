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
      <div className="bg-[var(--surface-1)] p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between transition-colors duration-200">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'sw' ? 'Tafuta daftari, kurasa, au SKU...' : 'Search notebooks, pages, SKU...'}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full border border-[var(--border)] focus:outline-none focus:border-[var(--gold)] bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
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
            className="lg:hidden px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-1)] text-xs font-bold text-[var(--text)] inline-flex items-center gap-2 cursor-pointer shadow-2xs hover:border-[var(--gold)] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[var(--red)] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)] shadow-2xs">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[var(--surface-1)] shadow-xs text-[var(--red)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[var(--surface-1)] shadow-xs text-[var(--red)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
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
          <span className="text-xs text-[var(--text-muted)] font-medium">Active Filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Category: {selectedCategory}
              <button type="button" onClick={() => onClearFilter('category')} className="hover:text-[var(--red)]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedQuire !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Quire: {selectedQuire}
              <button type="button" onClick={() => onClearFilter('quire')} className="hover:text-[var(--red)]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedRuling !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Ruling: {selectedRuling}
              <button type="button" onClick={() => onClearFilter('ruling')} className="hover:text-[var(--red)]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedBinding !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Binding: {selectedBinding}
              <button type="button" onClick={() => onClearFilter('binding')} className="hover:text-[var(--red)]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Price: {appliedPriceRange.min || 0} - {appliedPriceRange.max || '∞'}
              <button type="button" onClick={() => onClearFilter('price')} className="hover:text-[var(--red)]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              In Stock Only
              <button type="button" onClick={() => onClearFilter('inStock')} className="hover:text-[var(--red)]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {bestsellerOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Bestsellers Only
              <button type="button" onClick={() => onClearFilter('bestseller')} className="hover:text-[var(--red)]">
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
