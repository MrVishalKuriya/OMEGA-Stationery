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
    <div className="space-y-3">
      {/* Search & Top Action Bar per DESIGN.md Warm Tactile Minimal */}
      <div className="bg-[#FFFFFF] rounded-lg p-3 sm:p-3.5 border border-[#E7E5E0] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] relative overflow-hidden flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Subtle Decorative Hairline Stitch */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#E7E5E0] border-t border-dashed border-[#8C7355]/30" />

        {/* Search Input (DESIGN.md: Background #F9F8F6, Border 1px solid #D5D2CC) */}
        <div className="relative w-full sm:w-80 group">
          <Search className="w-4 h-4 text-[#8C7355] group-focus-within:text-[#111113] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'sw'
                ? 'Tafuta daftari, kurasa, au SKU...'
                : 'Search notebooks, ruling, SKU...'
            }
            className="w-full pl-10 pr-9 py-2 text-xs bg-[#F9F8F6] text-[#111113] placeholder:text-[#6E6B66] rounded-md border border-[#E7E5E0] focus:border-[#111113] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#111113] transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6B66] hover:text-[#DC2626] p-0.5 rounded-full hover:bg-stone-200/50 transition-colors cursor-pointer"
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
            className="lg:hidden px-3.5 py-2 bg-[#111113] hover:bg-[#262524] text-[#FFFFFF] text-xs font-semibold rounded-md inline-flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-[#6E6B66]">
            <span className="hidden md:inline font-semibold uppercase tracking-wider text-[10px] text-[#111113]">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-2 bg-[#F9F8F6] rounded-md border border-[#E7E5E0] text-xs font-medium text-[#111113] focus:outline-none focus:border-[#111113] hover:border-[#8C7355]/60 cursor-pointer transition-colors"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="pages-desc">Most Pages</option>
            </select>
          </div>

          {/* View Mode Segmented Controls */}
          <div className="flex items-center bg-[#F9F8F6] p-1 rounded-md border border-[#E7E5E0] shadow-2xs">
            <Tooltip title="Grid View" arrow>
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                aria-label="Grid View"
                className={`p-1.5 rounded-[4px] transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#111113] text-[#FFFFFF] shadow-2xs'
                    : 'text-[#6E6B66] hover:text-[#111113] hover:bg-white'
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
                className={`p-1.5 rounded-[4px] transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#111113] text-[#FFFFFF] shadow-2xs'
                    : 'text-[#6E6B66] hover:text-[#111113] hover:bg-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Active Filter Chips per DESIGN.md (Vellum #F2EFEB, Text #111113) */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap items-center gap-1.5 pt-1 px-0.5"
          >
            <span className="text-xs text-[#6E6B66] font-semibold uppercase tracking-wider text-[10px]">
              Active Filters ({activeFilterCount}):
            </span>

            {selectedCategory !== 'All' && (
              <Chip
                size="small"
                icon={<Bookmark className="w-3 h-3 text-[#8C7355]" />}
                label={`Category: ${selectedCategory}`}
                onDelete={() => onClearFilter('category')}
                sx={{
                  bgcolor: '#F2EFEB',
                  border: '1px solid #E7E5E0',
                  color: '#111113',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#6E6B66',
                    '&:hover': { color: '#DC2626' },
                  },
                }}
              />
            )}

            {selectedQuire !== 'All' && (
              <Chip
                size="small"
                icon={<Layers className="w-3 h-3 text-[#8C7355]" />}
                label={`Size: ${selectedQuire}`}
                onDelete={() => onClearFilter('quire')}
                sx={{
                  bgcolor: '#F2EFEB',
                  border: '1px solid #E7E5E0',
                  color: '#111113',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#6E6B66',
                    '&:hover': { color: '#DC2626' },
                  },
                }}
              />
            )}

            {selectedRuling !== 'All' && (
              <Chip
                size="small"
                icon={<FileText className="w-3 h-3 text-[#8C7355]" />}
                label={`Ruling: ${selectedRuling}`}
                onDelete={() => onClearFilter('ruling')}
                sx={{
                  bgcolor: '#F2EFEB',
                  border: '1px solid #E7E5E0',
                  color: '#111113',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#6E6B66',
                    '&:hover': { color: '#DC2626' },
                  },
                }}
              />
            )}

            {selectedBinding !== 'All' && (
              <Chip
                size="small"
                icon={<Layers className="w-3 h-3 text-[#8C7355]" />}
                label={`Binding: ${selectedBinding}`}
                onDelete={() => onClearFilter('binding')}
                sx={{
                  bgcolor: '#F2EFEB',
                  border: '1px solid #E7E5E0',
                  color: '#111113',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#6E6B66',
                    '&:hover': { color: '#DC2626' },
                  },
                }}
              />
            )}

            {(appliedPriceRange.min !== null || appliedPriceRange.max !== null) && (
              <Chip
                size="small"
                icon={<DollarSign className="w-3 h-3 text-[#8C7355]" />}
                label={`Price: ${appliedPriceRange.min || 0} - ${appliedPriceRange.max || '∞'}`}
                onDelete={() => onClearFilter('price')}
                sx={{
                  bgcolor: '#F2EFEB',
                  border: '1px solid #E7E5E0',
                  color: '#111113',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#6E6B66',
                    '&:hover': { color: '#DC2626' },
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
                icon={<Flame className="w-3 h-3 text-[#DC2626]" />}
                label="Bestsellers Only"
                onDelete={() => onClearFilter('bestseller')}
                sx={{
                  bgcolor: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  color: '#DC2626',
                  fontWeight: 600,
                  fontSize: '0.70rem',
                  borderRadius: '4px',
                  '& .MuiChip-deleteIcon': {
                    color: '#DC2626',
                    '&:hover': { color: '#991B1B' },
                  },
                }}
              />
            )}

            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-[#DC2626] hover:text-[#991B1B] font-semibold ml-1 inline-flex items-center gap-1 cursor-pointer transition-colors hover:underline"
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
