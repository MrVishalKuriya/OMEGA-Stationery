import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Clock, Flame, Tag, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_RECENT = 'omega_recent_searches_v1';
const DEFAULT_RECENTS = ['Counter Book Q3', 'Exercise Book 200p', 'Kraft Bahasha A4', 'Oxford Math Set'];
const TRENDING_SEARCHES = ['Counter Books', 'Kraft Bahasha', 'Oxford Math Set', 'PVC Spring File', 'Exercise Books'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { products, storeConfig } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENT);
      return saved ? JSON.parse(saved) : DEFAULT_RECENTS;
    } catch {
      return DEFAULT_RECENTS;
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const currency = storeConfig.currencySymbol || 'TSh';

  // Debounce search term by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
      setDebouncedTerm('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global keyboard shortcuts: "/" to open, "Esc" to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const saveRecentSearch = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    const updated = [cleaned, ...recentSearches.filter((s) => s.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllRecents = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY_RECENT);
    } catch {
      // ignore
    }
  };

  const executeSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      saveRecentSearch(trimmed);
      navigate(`/catalog?q=${encodeURIComponent(trimmed)}`);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchTerm);
  };

  // E-Commerce Weighted Relevance Search Algorithm
  const matchingResults = useMemo(() => {
    if (!debouncedTerm) return { products: [], categories: [] };
    const lower = debouncedTerm.toLowerCase();

    const scoredProducts: { product: typeof products[0]; score: number }[] = [];

    for (const p of products) {
      let score = 0;
      const nameL = p.name.toLowerCase();
      const skuL = (p.sku || '').toLowerCase();
      const catL = p.category.toLowerCase();
      const nameSwL = p.nameSw ? p.nameSw.toLowerCase() : '';

      // 1. Direct name or SKU prefix match (Top Priority)
      if (nameL.startsWith(lower) || nameSwL.startsWith(lower)) score += 60;
      else if (nameL.includes(lower) || nameSwL.includes(lower)) score += 35;

      if (skuL.startsWith(lower)) score += 50;
      else if (skuL.includes(lower)) score += 25;

      // 2. Category match
      if (catL.startsWith(lower)) score += 30;
      else if (catL.includes(lower)) score += 15;

      // 3. Technical specifications (quire, pageCount, size)
      if (p.quire && p.quire.toLowerCase().includes(lower)) score += 20;
      if (p.pageCount && p.pageCount.toLowerCase().includes(lower)) score += 15;
      if (p.size && p.size.toLowerCase().includes(lower)) score += 10;

      // 4. Secondary description match
      if (p.description && p.description.toLowerCase().includes(lower)) score += 5;

      // Merchandising boost for featured/best-seller items
      if (score > 0) {
        if (p.featured) score += 3;
        if (p.bestSeller) score += 2;
        scoredProducts.push({ product: p, score });
      }
    }

    scoredProducts.sort((a, b) => b.score - a.score);
    const matchedProducts = scoredProducts.slice(0, 6).map((item) => item.product);

    const matchedCategories = Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter((cat) => cat.toLowerCase().includes(lower))
      )
    ).slice(0, 4);

    return { products: matchedProducts, categories: matchedCategories };
  }, [debouncedTerm, products]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
      className="fixed inset-0 z-[100] flex flex-col bg-[#fafafa] lg:bg-[#fafafa]/95 lg:backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Header Bar with Search Input */}
      <div className="w-full bg-[#fafafa] border-b border-[#e2dedb] px-4 sm:px-8 py-4 sm:py-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3 sm:gap-4">
          <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#4b423b] absolute left-3 sm:left-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notebooks, pens, books, bahasha..."
              className="w-full pl-11 sm:pl-14 pr-12 py-3 sm:py-4 text-base sm:text-xl font-heading bg-white rounded-[12px] border border-[#e2dedb] text-[#14182B] placeholder:text-[#6B7280] focus-ring-gold shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 p-1 rounded-full text-[#6B7280] hover:text-[#14182B] hover:bg-[#F3EEE2]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-3 rounded-[12px] bg-white border border-[#e2dedb] hover:bg-[#F3EEE2] text-xs font-bold text-[#14182B] transition-colors focus-ring-gold"
          >
            <span className="hidden sm:inline">Close</span>
            <span className="text-[10px] text-[#6B7280] font-mono hidden sm:inline">(Esc)</span>
            <X className="w-4 h-4 sm:hidden" />
          </button>
        </div>
      </div>

      {/* Search Content Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* State 1: Active query with live suggestions */}
          {debouncedTerm ? (
            <div className="space-y-6">
              {/* Category Matches */}
              {matchingResults.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#c49b7c]" />
                    Matching Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchingResults.categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          saveRecentSearch(cat);
                          navigate(`/catalog?category=${encodeURIComponent(cat)}`);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-[#e2dedb] hover:border-[#c49b7c] hover:text-[#4b423b] text-xs font-semibold text-[#14182B] transition-all flex items-center gap-1.5"
                      >
                        <span>{cat}</span>
                        <ChevronRight className="w-3 h-3 text-[#6B7280]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#4b423b]" />
                    Products Matching &ldquo;{debouncedTerm}&rdquo; ({matchingResults.products.length})
                  </h4>
                  <button
                    onClick={() => executeSearch(debouncedTerm)}
                    className="text-xs font-bold text-[#4b423b] hover:text-[#c49b7c] flex items-center gap-1"
                  >
                    View all results <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {matchingResults.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matchingResults.products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          saveRecentSearch(p.name);
                          navigate(`/product/${p.id}`);
                          onClose();
                        }}
                        className="flex items-center gap-3.5 p-3 rounded-[12px] bg-white border border-[#e2dedb] hover:border-[#c49b7c] transition-all cursor-pointer group shadow-xs"
                      >
                        <div className="w-14 h-14 rounded-[8px] bg-[#fafafa] overflow-hidden shrink-0 border border-[#e2dedb]/50 p-1">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block truncate">
                            {p.category}
                          </span>
                          <h5 className="text-xs font-bold text-[#14182B] group-hover:text-[#4b423b] transition-colors truncate">
                            {p.name}
                          </h5>
                          <span className="text-xs font-mono font-bold text-[#4b423b] mt-0.5 block">
                            {currency} {(p.discountPrice || p.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-[12px] border border-[#e2dedb] p-8">
                    <p className="font-heading text-lg text-[#14182B]">No exact matches for &ldquo;{debouncedTerm}&rdquo;</p>
                    <p className="text-xs text-[#6B7280] mt-1 max-w-md mx-auto">
                      Try searching by category such as Counter Books, Exercise Books, Oxford Math Set, or Kraft Bahasha.
                    </p>
                    <button
                      onClick={() => executeSearch(debouncedTerm)}
                      className="mt-4 px-4 py-2 text-xs font-bold rounded-[8px] btn-indra-primary"
                    >
                      Search All Catalog
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* State 2: Empty query - Recent & Trending searches */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Searches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#4b423b]" />
                    Recent Searches
                  </h4>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllRecents}
                      className="text-[11px] font-medium text-[#6B7280] hover:text-[#D64545] transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {recentSearches.map((term, idx) => (
                    <div
                      key={idx}
                      onClick={() => executeSearch(term)}
                      className="flex items-center justify-between p-2.5 rounded-[8px] bg-white hover:bg-[#F3EEE2] border border-[#e2dedb] cursor-pointer text-xs font-medium text-[#14182B] group transition-colors"
                    >
                      <span className="group-hover:text-[#4b423b]">{term}</span>
                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(e, term)}
                        className="p-1 text-[#6B7280] hover:text-[#D64545] rounded-full"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Searches & Collections */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#c49b7c]" />
                  Trending Searches
                </h4>

                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeSearch(item)}
                      className="px-3.5 py-2 rounded-full bg-white hover:bg-[#4b423b] hover:text-white border border-[#e2dedb] text-xs font-semibold text-[#14182B] transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-[#c49b7c]" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-[12px] bg-[#F3EEE2] border border-[#e2dedb] space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#4b423b]">
                    Boutique Recommendation
                  </span>
                  <p className="text-xs text-[#14182B]">
                    Looking for institutional carton quantities? Browse our wholesale catalog or contact our wholesale desk directly.
                  </p>
                  <button
                    onClick={() => {
                      navigate('/catalog?category=Counter+Books');
                      onClose();
                    }}
                    className="text-xs font-bold text-[#4b423b] hover:text-[#c49b7c] inline-flex items-center gap-1"
                  >
                    View Wholesale Books <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
