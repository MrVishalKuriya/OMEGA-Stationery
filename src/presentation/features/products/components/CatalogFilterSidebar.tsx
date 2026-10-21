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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4b423b]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#2b2520]">
            {language === 'sw' ? 'Chuja Bidhaa' : 'Filter Products'}
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] text-amber-800 hover:text-amber-950 font-bold inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-[#4b423b] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{cat === 'All' ? (language === 'sw' ? 'Bidhaa Zote' : 'All Products') : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quire / Page Count */}
      <div className="space-y-2 pt-4 border-t border-stone-200">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          {language === 'sw' ? 'Ukubwa & Kurasa' : 'Quire & Size'}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {quireOptions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuire(q.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedQuire === q.id
                  ? 'bg-[#c49b7c] text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ruling */}
      <div className="space-y-2 pt-4 border-t border-stone-200">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          {language === 'sw' ? 'Mistari (Ruling)' : 'Ruling Style'}
        </h3>
        <div className="space-y-1">
          {rulingOptions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRuling(r.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedRuling === r.id
                  ? 'bg-[#4b423b] text-white font-bold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{r.label}</span>
              {selectedRuling === r.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Binding */}
      <div className="space-y-2 pt-4 border-t border-stone-200">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          {language === 'sw' ? 'Aina ya Jalada' : 'Binding Type'}
        </h3>
        <div className="space-y-1">
          {bindingOptions.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBinding(b.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedBinding === b.id
                  ? 'bg-[#4b423b] text-white font-bold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{b.label}</span>
              {selectedBinding === b.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-4 border-t border-stone-200">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          {language === 'sw' ? 'Kiwango cha Bei' : 'Price Range'} ({currency})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:outline-none focus:border-[#4b423b]"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:outline-none focus:border-[#4b423b]"
          />
        </div>
        <button
          type="button"
          onClick={onApplyPriceFilter}
          className="w-full py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
        >
          {language === 'sw' ? 'Weka Bei' : 'Apply Price'}
        </button>
      </div>

      {/* Checkboxes: In Stock & Bestseller */}
      <div className="space-y-2 pt-4 border-t border-stone-200">
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 text-[#4b423b] rounded focus:ring-0"
          />
          <span>{language === 'sw' ? 'Zilizopo Stoo Tu' : 'In Stock Only'}</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => setBestsellerOnly(e.target.checked)}
            className="w-4 h-4 text-[#4b423b] rounded focus:ring-0"
          />
          <span>{language === 'sw' ? 'Zinazonunuliwa Zaidi' : 'Bestsellers Only'}</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 shadow-2xl overflow-y-auto z-10">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-stone-200">
              <span className="font-heading font-bold text-base text-[#2b2520]">Filter Catalog</span>
              <button type="button" onClick={onCloseMobile} className="p-1 rounded-lg text-stone-500 hover:bg-stone-100">
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
