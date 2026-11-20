import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Clock,
  Trash2,
  ArrowUpLeft,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  subscribeRecentSearches,
} from '@/utils/recentSearches';
import { useStore } from '@/context/StoreContext';

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

const QUICK_SUGGESTED_SEARCHES = [
  'Counter Book Q3',
  'Counter Book Q4',
  '200 Pages Exercise',
  'Kraft Bahasha A4',
  'Single Line',
];

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  activeFilterCount,
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
  const { compareProductIds, setIsCompareModalOpen } = useStore();
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync recent searches from localStorage / custom events
  useEffect(() => {
    setRecentSearches(getRecentSearches());
    return subscribeRecentSearches(() => {
      setRecentSearches(getRecentSearches());
    });
  }, []);

  // Automatically save non-empty search query after user pauses typing (900ms debounce)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return;
    const timer = setTimeout(() => {
      addRecentSearch(trimmed);
    }, 900);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearch = (query: string) => {
    onSearchChange(query);
    addRecentSearch(query);
    setIsDropdownOpen(false);
  };

  const handleRemoveSingleSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    e.preventDefault();
    removeRecentSearch(query);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    clearRecentSearches();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = searchQuery.trim();
      if (trimmed.length >= 2) {
        addRecentSearch(trimmed);
      }
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search & Top Action Bar */}
      <div className="bg-[var(--surface-1)] p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between transition-colors duration-200">
        {/* Search Input with Recent Searches Dropdown */}
        <div ref={searchContainerRef} className="relative w-full sm:w-88 lg:w-96">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onClick={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'sw'
                ? 'Tafuta daftari, kurasa, au SKU...'
                : 'Search notebooks, pages, SKU...'
            }
            aria-label="Search catalog products"
            aria-expanded={isDropdownOpen}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full border border-[var(--border)] focus:outline-none focus:border-[var(--red)] bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Recent Searches Dropdown (Displays Last 5 Search Queries on Input Click) */}
          {isDropdownOpen && (
            <div
              role="listbox"
              aria-label="Recent Searches"
              className="absolute left-0 right-0 top-full mt-2 z-40 bg-white rounded-2xl border border-zinc-200/90 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {/* Header */}
              <div className="px-3.5 py-2.5 bg-zinc-50/90 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                  <Clock className="w-3.5 h-3.5 text-[#D63A3A]" />
                  <span>
                    {language === 'sw' ? 'Utafutaji wa Hivi Karibuni' : 'Recent Searches'}
                  </span>
                  {recentSearches.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-zinc-200/70 text-zinc-700 text-[9.5px]">
                      {recentSearches.length}/5
                    </span>
                  )}
                </div>

                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onMouseDown={handleClearAllRecent}
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-500 hover:text-[#D63A3A] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{language === 'sw' ? 'Futa Zote' : 'Clear'}</span>
                  </button>
                )}
              </div>

              {/* Recent Searches List (Up to 5 items) */}
              {recentSearches.length > 0 ? (
                <ul className="divide-y divide-zinc-100/80 max-h-60 overflow-y-auto">
                  {recentSearches.slice(0, 5).map((queryItem) => (
                    <li key={queryItem}>
                      <div
                        role="option"
                        aria-selected={searchQuery.toLowerCase() === queryItem.toLowerCase()}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSearch(queryItem);
                        }}
                        className="px-3.5 py-2.5 hover:bg-zinc-50 flex items-center justify-between gap-2 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#D63A3A] shrink-0 transition-colors" />
                          <span className="text-xs font-sans font-semibold text-[#161518] group-hover:text-[#D63A3A] truncate transition-colors">
                            {queryItem}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <ArrowUpLeft className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                          <button
                            type="button"
                            onMouseDown={(e) => handleRemoveSingleSearch(e, queryItem)}
                            title={language === 'sw' ? 'Ondoa' : 'Remove from recent searches'}
                            aria-label={`Remove ${queryItem} from recent searches`}
                            className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3.5 space-y-2.5">
                  <p className="text-[11px] text-zinc-500 font-sans">
                    {language === 'sw'
                      ? 'Hakuna utafutaji wa hivi karibuni. Chagua au andika hapa chini:'
                      : 'No recent searches yet. Your last 5 searches will appear here:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_SUGGESTED_SEARCHES.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSearch(suggestion);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-[#D63A3A]/10 text-zinc-700 hover:text-[#D63A3A] text-[10.5px] font-mono font-semibold transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#D63A3A]" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

          {/* Compare Modal Trigger Button */}
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            title="Open side-by-side specification comparison modal"
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              compareProductIds.length > 0
                ? 'bg-[#D63A3A]/10 text-[#D63A3A] border-[#D63A3A]/30'
                : 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)] hover:border-[var(--red)]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#D63A3A]" />
            <span>{language === 'sw' ? 'Linganisha' : 'Compare'}</span>
            {compareProductIds.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D63A3A] text-white text-[10px] font-mono">
                {compareProductIds.length}/2
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
                viewMode === 'grid'
                  ? 'bg-[var(--surface-1)] shadow-xs text-[var(--red)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[var(--surface-1)] shadow-xs text-[var(--red)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
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
              <button
                type="button"
                onClick={() => onClearFilter('category')}
                className="hover:text-[var(--red)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedQuire !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Quire: {selectedQuire}
              <button
                type="button"
                onClick={() => onClearFilter('quire')}
                className="hover:text-[var(--red)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedRuling !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Ruling: {selectedRuling}
              <button
                type="button"
                onClick={() => onClearFilter('ruling')}
                className="hover:text-[var(--red)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedBinding !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Binding: {selectedBinding}
              <button
                type="button"
                onClick={() => onClearFilter('binding')}
                className="hover:text-[var(--red)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Price: {appliedPriceRange.min || 0} - {appliedPriceRange.max || '∞'}
              <button
                type="button"
                onClick={() => onClearFilter('price')}
                className="hover:text-[var(--red)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              In Stock Only
              <button
                type="button"
                onClick={() => onClearFilter('inStock')}
                className="hover:text-[var(--red)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {bestsellerOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold shadow-2xs">
              Bestsellers Only
              <button
                type="button"
                onClick={() => onClearFilter('bestseller')}
                className="hover:text-[var(--red)]"
              >
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
