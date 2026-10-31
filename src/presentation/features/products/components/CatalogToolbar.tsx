import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Layers,
  FileText,
  Bookmark,
  DollarSign,
  PackageCheck,
  Flame,
} from 'lucide-react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

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
    <div className="space-y-3 text-charcoal-ink">
      {/* Search & Top Action Bar */}
      <div className="bg-[#FFFFFF] rounded-[4px] p-3 sm:p-3.5 border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(15,17,21,0.05)] relative overflow-hidden flex flex-col sm:flex-row gap-3 items-center justify-between">

        {/* Search Input */}
        <div className="relative w-full sm:w-80 group">
          <Search className="w-4 h-4 text-[#3F3F46] group-focus-within:text-[#DC2626] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'sw'
                ? 'Tafuta daftari, kurasa, au SKU...'
                : 'Search notebooks, ruling, SKU...'
            }
            className="w-full pl-10 pr-9 py-2 text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] rounded-[2px] border border-[#E5E7EB] focus:border-[#DC2626] focus:bg-[#FFFFFF] focus:outline-none transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3F3F46] hover:text-[#DC2626] p-0.5 rounded-[2px] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden px-3.5 py-2 bg-[#111113] hover:bg-[#DC2626] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider rounded-[2px] inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-[2px] bg-[#DC2626] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-ink">
            <span className="hidden md:inline font-bold uppercase tracking-wider text-[10px] text-charcoal-ink">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-2 bg-paper-base rounded-[2px] border border-[#E5E7EB] text-xs font-medium text-charcoal-ink focus:outline-none focus:border-[#DC2626] hover:border-[#D1D5DB] cursor-pointer transition-colors"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="pages-desc">Most Pages</option>
            </select>
          </div>

          {/* View Mode Segmented Controls */}
          <div className="flex items-center bg-paper-base p-1 rounded-[2px] border border-[#E5E7EB] shadow-xs">
            <Tooltip title="Grid View" arrow>
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                aria-label="Grid View"
                className={`p-1.5 rounded-[2px] transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#DC2626] text-[#FFFFFF] shadow-xs'
                    : 'text-[#3F3F46] hover:text-charcoal-ink hover:bg-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            <Tooltip title="List View" arrow>
              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                aria-label="List View"
                className={`p-1.5 rounded-[2px] transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#DC2626] text-[#FFFFFF] shadow-xs'
                    : 'text-[#3F3F46] hover:text-charcoal-ink hover:bg-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Active Filter Chips per Swiss Editorial */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap items-center gap-1.5 pt-1 px-0.5"
          >
            <span className="text-xs text-charcoal-ink font-semibold uppercase tracking-wider text-[10px]">
              Active Filters ({activeFilterCount}):
            </span>

            {selectedCategory !== 'All' && (
              <Chip
                size="small"
                icon={<Bookmark className="w-3 h-3 text-[#B91C1C]" />}
                label={`Category: ${selectedCategory}`}
                onDelete={() => onClearFilter('category')}
                sx={{
                  bgcolor: '#F8F9FA',
                  border: '1px solid #E5E7EB',
                  color: '#0F1115',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#64748B',
                    '&:hover': { color: '#B91C1C' },
                  },
                }}
              />
            )}

            {selectedQuire !== 'All' && (
              <Chip
                size="small"
                icon={<Layers className="w-3 h-3 text-[#B91C1C]" />}
                label={`Size: ${selectedQuire}`}
                onDelete={() => onClearFilter('quire')}
                sx={{
                  bgcolor: '#F8F9FA',
                  border: '1px solid #E5E7EB',
                  color: '#0F1115',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#64748B',
                    '&:hover': { color: '#B91C1C' },
                  },
                }}
              />
            )}

            {selectedRuling !== 'All' && (
              <Chip
                size="small"
                icon={<FileText className="w-3 h-3 text-[#B91C1C]" />}
                label={`Ruling: ${selectedRuling}`}
                onDelete={() => onClearFilter('ruling')}
                sx={{
                  bgcolor: '#F8F9FA',
                  border: '1px solid #E5E7EB',
                  color: '#0F1115',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#64748B',
                    '&:hover': { color: '#B91C1C' },
                  },
                }}
              />
            )}

            {selectedBinding !== 'All' && (
              <Chip
                size="small"
                icon={<Layers className="w-3 h-3 text-[#B91C1C]" />}
                label={`Binding: ${selectedBinding}`}
                onDelete={() => onClearFilter('binding')}
                sx={{
                  bgcolor: '#F8F9FA',
                  border: '1px solid #E5E7EB',
                  color: '#0F1115',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#64748B',
                    '&:hover': { color: '#B91C1C' },
                  },
                }}
              />
            )}

            {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
              <Chip
                size="small"
                icon={<DollarSign className="w-3 h-3 text-[#B91C1C]" />}
                label={`Price: ${appliedPriceRange.min || 0} - ${appliedPriceRange.max || '∞'}`}
                onDelete={() => onClearFilter('price')}
                sx={{
                  bgcolor: '#F8F9FA',
                  border: '1px solid #E5E7EB',
                  color: '#0F1115',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#64748B',
                    '&:hover': { color: '#B91C1C' },
                  },
                }}
              />
            )}

            {inStockOnly && (
              <Chip
                size="small"
                icon={<PackageCheck className="w-3 h-3 text-emerald-600" />}
                label="In Stock Only"
                onDelete={() => onClearFilter('inStock')}
                sx={{
                  bgcolor: 'rgba(22, 163, 74, 0.08)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  color: '#166534',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#166534',
                    '&:hover': { color: '#14532d' },
                  },
                }}
              />
            )}

            {bestsellerOnly && (
              <Chip
                size="small"
                icon={<Flame className="w-3 h-3 text-[#B91C1C]" />}
                label="Bestsellers Only"
                onDelete={() => onClearFilter('bestseller')}
                sx={{
                  bgcolor: 'rgba(185, 28, 28, 0.08)',
                  border: '1px solid rgba(185, 28, 28, 0.25)',
                  color: '#B91C1C',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#B91C1C',
                    '&:hover': { color: '#991B1B' },
                  },
                }}
              />
            )}

            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-[#B91C1C] hover:text-[#991B1B] font-semibold ml-1 inline-flex items-center gap-1 cursor-pointer transition-colors hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
