import React from 'react';
import { Filter, RotateCcw, X, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface CatalogFilterSidebarProps {
  availableCategories: string[];
  categoryCounts: Record<string, number>;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  quireOptions: FilterOption[];
  selectedQuire: string;
  onSelectQuire: (quire: string) => void;
  rulingOptions: FilterOption[];
  selectedRuling: string;
  onSelectRuling: (ruling: string) => void;
  bindingOptions: FilterOption[];
  selectedBinding: string;
  onSelectBinding: (binding: string) => void;
  priceMin: string;
  setPriceMin: (v: string) => void;
  priceMax: string;
  setPriceMax: (v: string) => void;
  onApplyPriceFilter: () => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  bestsellerOnly: boolean;
  setBestsellerOnly: (v: boolean) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  currency: string;
  language: string;
}

/**
 * CatalogFilterSidebar — Centralized per public/uploads/DESIGN.md
 * Warm Tactile Minimal architecture:
 * - Surface: #FFFFFF
 * - Charcoal Ink: #111113
 * - Hairline Border: #E7E5E0
 * - Inverted selection: #111113 with #FFFFFF
 * - Vellum hover: #F2EFEB
 */
export const CatalogFilterSidebar: React.FC<CatalogFilterSidebarProps> = ({
  availableCategories,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  quireOptions,
  selectedQuire,
  onSelectQuire,
  rulingOptions,
  selectedRuling,
  onSelectRuling,
  bindingOptions,
  selectedBinding,
  onSelectBinding,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  onApplyPriceFilter,
  inStockOnly,
  setInStockOnly,
  bestsellerOnly,
  setBestsellerOnly,
  hasActiveFilters,
  onResetFilters,
  isMobileOpen,
  onCloseMobile,
  currency,
  language,
}) => {
  const content = (
    <div className="space-y-5 text-[#111113]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E0]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8C7355]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#111113] font-heading">
            {language === 'sw' ? 'Chuja Bidhaa' : 'Filter Products'}
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] text-[#DC2626] hover:text-[#991B1B] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-[#6E6B66] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Makundi ya Bidhaa' : 'Categories'}
        </h3>
        <div className="space-y-1">
          {availableCategories.map((cat) => {
            const count = cat === 'All' ? Object.values(categoryCounts).reduce((a, b) => a + b, 0) : categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all text-left cursor-pointer border ${
                  isSelected
                    ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] shadow-2xs font-semibold'
                    : 'text-[#111113] border-transparent hover:bg-[#F2EFEB]'
                }`}
              >
                <span>{cat === 'All' ? (language === 'sw' ? 'Bidhaa Zote' : 'All Products') : cat}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-mono ${isSelected ? 'bg-[#262524] text-[#FFFFFF]' : 'bg-[#F2EFEB] text-[#6E6B66]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quire / Page Count */}
      <div className="space-y-2 pt-3.5 border-t border-[#E7E5E0]">
        <h3 className="text-xs font-semibold text-[#6E6B66] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Ukubwa & Kurasa' : 'Quire & Size'}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {quireOptions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuire(q.id)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border font-mono ${
                selectedQuire === q.id
                  ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] font-semibold shadow-2xs'
                  : 'bg-[#F9F8F6] text-[#111113] border-[#E7E5E0] hover:bg-[#F2EFEB]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ruling */}
      <div className="space-y-2 pt-3.5 border-t border-[#E7E5E0]">
        <h3 className="text-xs font-semibold text-[#6E6B66] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Mistari (Ruling)' : 'Ruling Style'}
        </h3>
        <div className="space-y-1">
          {rulingOptions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRuling(r.id)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer border ${
                selectedRuling === r.id
                  ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] font-semibold'
                  : 'text-[#111113] border-transparent hover:bg-[#F2EFEB]'
              }`}
            >
              <span>{r.label}</span>
              {selectedRuling === r.id && <Check className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Binding */}
      <div className="space-y-2 pt-3.5 border-t border-[#E7E5E0]">
        <h3 className="text-xs font-semibold text-[#6E6B66] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Aina ya Jalada' : 'Binding Type'}
        </h3>
        <div className="space-y-1">
          {bindingOptions.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBinding(b.id)}
              className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer border ${
                selectedBinding === b.id
                  ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] font-semibold'
                  : 'text-[#111113] border-transparent hover:bg-[#F2EFEB]'
              }`}
            >
              <span>{b.label}</span>
              {selectedBinding === b.id && <Check className="w-3.5 h-3.5 text-[#FFFFFF]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-3.5 border-t border-[#E7E5E0]">
        <h3 className="text-xs font-semibold text-[#6E6B66] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Kiwango cha Bei' : 'Price Range'} ({currency})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-3 py-1.5 rounded-md border border-[#E7E5E0] text-xs bg-[#F9F8F6] text-[#111113] focus:outline-none focus:border-[#111113]"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-3 py-1.5 rounded-md border border-[#E7E5E0] text-xs bg-[#F9F8F6] text-[#111113] focus:outline-none focus:border-[#111113]"
          />
        </div>
        <button
          type="button"
          onClick={onApplyPriceFilter}
          className="w-full py-2 rounded-md bg-[#111113] hover:bg-[#262524] text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer font-sans"
        >
          {language === 'sw' ? 'Weka Bei' : 'Apply Price'}
        </button>
      </div>

      {/* Checkboxes: In Stock & Bestseller */}
      <div className="space-y-2 pt-3.5 border-t border-[#E7E5E0]">
        <label className="flex items-center gap-2 text-xs text-[#111113] cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded-[3px] accent-[#111113]"
          />
          <span>{language === 'sw' ? 'Zilizopo Stoo Tu' : 'In Stock Only'}</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-[#111113] cursor-pointer">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => setBestsellerOnly(e.target.checked)}
            className="w-4 h-4 rounded-[3px] accent-[#111113]"
          />
          <span>{language === 'sw' ? 'Zinazonunuliwa Zaidi' : 'Bestsellers Only'}</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (DESIGN.md: 8px radius, white surface, hairline border) */}
      <aside className="hidden lg:block w-64 shrink-0 bg-[#FFFFFF] rounded-lg p-5 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs bg-[#FFFFFF] h-full p-6 shadow-2xl overflow-y-auto z-10 border-l border-[#E7E5E0]">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#E7E5E0]">
              <span className="font-heading font-semibold text-base text-[#111113]">Filter Catalog</span>
              <button type="button" onClick={onCloseMobile} className="p-1 rounded-md text-[#6E6B66] hover:bg-[#F9F8F6] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
