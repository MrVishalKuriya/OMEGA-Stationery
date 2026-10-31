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
    <div className="space-y-5 text-charcoal-ink">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#DC2626]" />
          <h2 className="text-xs font-black uppercase tracking-wider text-charcoal-ink font-heading">
            {language === 'sw' ? 'Chuja Bidhaa' : 'Filter Products'}
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] text-[#B91C1C] hover:text-[#991B1B] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#3F3F46] uppercase tracking-wider font-mono">
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
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-[2px] text-xs font-medium transition-all text-left cursor-pointer border ${
                  isSelected
                    ? 'bg-[#DC2626] text-[#FFFFFF] border-[#DC2626] shadow-xs font-bold'
                    : 'text-charcoal-ink border-transparent hover:bg-paper-base'
                }`}
              >
                <span>{cat === 'All' ? (language === 'sw' ? 'Bidhaa Zote' : 'All Products') : cat}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-[2px] font-mono ${isSelected ? 'bg-black/20 text-[#FFFFFF]' : 'bg-paper-base text-[#3F3F46]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quire / Page Count */}
      <div className="space-y-2 pt-3.5 border-t border-[#E5E7EB]">
        <h3 className="text-xs font-bold text-[#3F3F46] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Ukubwa & Kurasa' : 'Quire & Size'}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {quireOptions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuire(q.id)}
              className={`px-2.5 py-1.5 rounded-[2px] text-xs font-medium transition-all cursor-pointer border font-mono ${
                selectedQuire === q.id
                  ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] font-bold shadow-xs'
                  : 'bg-paper-base text-charcoal-ink border-[#E5E7EB] hover:border-[#DC2626]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ruling */}
      <div className="space-y-2 pt-3.5 border-t border-[#E5E7EB]">
        <h3 className="text-xs font-bold text-[#3F3F46] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Mistari (Ruling)' : 'Ruling Style'}
        </h3>
        <div className="space-y-1">
          {rulingOptions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRuling(r.id)}
              className={`w-full text-left px-3 py-1.5 rounded-[2px] text-xs transition-colors flex items-center justify-between cursor-pointer border ${
                selectedRuling === r.id
                  ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] font-bold'
                  : 'text-charcoal-ink border-transparent hover:bg-paper-base'
              }`}
            >
              <span>{r.label}</span>
              {selectedRuling === r.id && <Check className="w-3.5 h-3.5 text-[#DC2626]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Binding */}
      <div className="space-y-2 pt-3.5 border-t border-[#E5E7EB]">
        <h3 className="text-xs font-bold text-[#3F3F46] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Aina ya Jalada' : 'Binding Type'}
        </h3>
        <div className="space-y-1">
          {bindingOptions.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBinding(b.id)}
              className={`w-full text-left px-3 py-1.5 rounded-[2px] text-xs transition-colors flex items-center justify-between cursor-pointer border ${
                selectedBinding === b.id
                  ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] font-bold'
                  : 'text-charcoal-ink border-transparent hover:bg-paper-base'
              }`}
            >
              <span>{b.label}</span>
              {selectedBinding === b.id && <Check className="w-3.5 h-3.5 text-[#DC2626]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-3.5 border-t border-[#E5E7EB]">
        <h3 className="text-xs font-bold text-[#3F3F46] uppercase tracking-wider font-mono">
          {language === 'sw' ? 'Kiwango cha Bei' : 'Price Range'} ({currency})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-3 py-1.5 rounded-[2px] border border-[#E5E7EB] text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-3 py-1.5 rounded-[2px] border border-[#E5E7EB] text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
          />
        </div>
        <button
          type="button"
          onClick={onApplyPriceFilter}
          className="w-full py-2 rounded-[2px] bg-[#111113] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer font-sans"
        >
          {language === 'sw' ? 'Weka Bei' : 'Apply Price'}
        </button>
      </div>

      {/* Checkboxes: In Stock & Bestseller */}
      <div className="space-y-2 pt-3.5 border-t border-[#E5E7EB]">
        <label className="flex items-center gap-2 text-xs text-charcoal-ink cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded-[2px] accent-[#DC2626]"
          />
          <span>{language === 'sw' ? 'Zilizopo Stoo Tu' : 'In Stock Only'}</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-charcoal-ink cursor-pointer">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => setBestsellerOnly(e.target.checked)}
            className="w-4 h-4 rounded-[2px] accent-[#DC2626]"
          />
          <span>{language === 'sw' ? 'Zinazonunuliwa Zaidi' : 'Bestsellers Only'}</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-[#FFFFFF] rounded-[4px] p-5 shadow-[0_1px_3px_0_rgba(15,17,21,0.05)] border border-[#E5E7EB] h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs bg-[#FFFFFF] h-full p-6 shadow-2xl overflow-y-auto z-10 border-l border-[#E5E7EB]">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#E5E7EB]">
              <span className="font-heading font-semibold text-base text-charcoal-ink">Filter Catalog</span>
              <button type="button" onClick={onCloseMobile} className="p-1 rounded-[4px] text-charcoal-ink hover:bg-paper-base cursor-pointer">
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
