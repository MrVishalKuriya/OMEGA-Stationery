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
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--gold)]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
            {language === 'sw' ? 'Chuja Bidhaa' : 'Filter Products'}
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] text-[var(--red)] hover:text-[var(--red-hover)] font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--red)] text-white shadow-xs font-bold'
                    : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <span>{cat === 'All' ? (language === 'sw' ? 'Bidhaa Zote' : 'All Products') : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quire / Page Count */}
      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          {language === 'sw' ? 'Ukubwa & Kurasa' : 'Quire & Size'}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {quireOptions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuire(q.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedQuire === q.id
                  ? 'bg-[var(--red)] text-white font-bold shadow-xs'
                  : 'bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--gold)] border border-[var(--border)]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ruling */}
      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          {language === 'sw' ? 'Mistari (Ruling)' : 'Ruling Style'}
        </h3>
        <div className="space-y-1">
          {rulingOptions.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRuling(r.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                selectedRuling === r.id
                  ? 'bg-[var(--red)] text-white font-bold'
                  : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <span>{r.label}</span>
              {selectedRuling === r.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Binding */}
      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          {language === 'sw' ? 'Aina ya Jalada' : 'Binding Type'}
        </h3>
        <div className="space-y-1">
          {bindingOptions.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBinding(b.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                selectedBinding === b.id
                  ? 'bg-[var(--red)] text-white font-bold'
                  : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <span>{b.label}</span>
              {selectedBinding === b.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          {language === 'sw' ? 'Kiwango cha Bei' : 'Price Range'} ({currency})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
          />
        </div>
        <button
          type="button"
          onClick={onApplyPriceFilter}
          className="w-full py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] text-xs font-bold transition-colors cursor-pointer"
        >
          {language === 'sw' ? 'Weka Bei' : 'Apply Price'}
        </button>
      </div>

      {/* Checkboxes: In Stock & Bestseller */}
      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <label className="flex items-center gap-2 text-xs text-[var(--text)] cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 text-[var(--red)] rounded focus:ring-0"
          />
          <span>{language === 'sw' ? 'Zilizopo Stoo Tu' : 'In Stock Only'}</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-[var(--text)] cursor-pointer">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => setBestsellerOnly(e.target.checked)}
            className="w-4 h-4 text-[var(--red)] rounded focus:ring-0"
          />
          <span>{language === 'sw' ? 'Zinazonunuliwa Zaidi' : 'Bestsellers Only'}</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-[var(--surface-1)] p-5 rounded-2xl border border-[var(--border)] shadow-xs h-fit sticky top-24 transition-colors duration-200">
        {content}
      </aside>

      {/* Mobile Drawer Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative ml-auto w-full max-w-xs bg-[var(--surface-1)] text-[var(--text)] h-full p-5 shadow-2xl overflow-y-auto z-10 border-l border-[var(--border)]">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-[var(--border)]">
              <span className="font-heading font-bold text-base text-[var(--text)]">Filter Catalog</span>
              <button type="button" onClick={onCloseMobile} className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)]">
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
