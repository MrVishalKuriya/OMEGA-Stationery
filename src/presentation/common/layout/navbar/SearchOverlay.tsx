import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Clock, Tag, ChevronRight, MessageCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';
import { ProductImage } from '@/components/ProductImage';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_RECENT = 'omega_recent_searches_v1';
const DEFAULT_RECENTS = ['Counter Book Q3', 'Exercise Book 200p', 'Kraft Bahasha A4', 'Oxford Math Set'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { products, language } = useStore();
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

  // Debounce search term by 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 200);
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

  // Global keyboard shortcuts: Esc to close
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

  // Relevance Search Algorithm
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

      if (nameL.startsWith(lower) || nameSwL.startsWith(lower)) score += 60;
      else if (nameL.includes(lower) || nameSwL.includes(lower)) score += 35;

      if (skuL.startsWith(lower)) score += 50;
      else if (skuL.includes(lower)) score += 25;

      if (catL.startsWith(lower)) score += 30;
      else if (catL.includes(lower)) score += 15;

      if (p.quire && p.quire.toLowerCase().includes(lower)) score += 20;
      if (p.pageCount && p.pageCount.toLowerCase().includes(lower)) score += 15;

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
      className="fixed inset-0 z-[100] flex flex-col bg-[var(--bg)]/95 backdrop-blur-md text-[var(--text)] animate-in fade-in duration-200"
    >
      {/* Header Bar with Search Input */}
      <div className="w-full bg-[var(--surface-1)] border-b border-[var(--border)] px-4 sm:px-8 py-4 sm:py-5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
          <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-[var(--gold)] absolute left-3.5 sm:left-4 pointer-events-none stroke-[2]" />
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              autoCapitalize="none"
              autoCorrect="off"
              enterKeyHint="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'sw'
                  ? 'Tafuta madaftari, counter books, bahasha, rejesta...'
                  : 'Search counter books, exercise books, kraft envelopes, registers...'
              }
              className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 text-sm sm:text-base bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--red)] focus:ring-1 focus:ring-[var(--red)] shadow-xs transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-1)] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)] text-xs font-mono font-bold text-[var(--text)] transition-colors cursor-pointer"
          >
            <span>Close</span>
            <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">(Esc)</span>
          </button>
        </div>
      </div>

      {/* Search Content Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Matching Products */}
          {debouncedTerm ? (
            <div className="space-y-6">
              {matchingResults.categories.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--gold)] block">
                    MATCHING CATEGORIES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchingResults.categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          saveRecentSearch(cat);
                          navigate(`/catalog?category=${encodeURIComponent(cat)}`);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)] text-xs font-mono text-[var(--text)] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Tag className="w-3 h-3 text-[var(--red)]" />
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--gold)] block">
                    PRODUCTS ({matchingResults.products.length})
                  </span>
                  {matchingResults.products.length > 0 && (
                    <button
                      type="button"
                      onClick={() => executeSearch(debouncedTerm)}
                      className="text-xs font-mono font-bold text-[var(--red)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View all results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {matchingResults.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchingResults.products.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          saveRecentSearch(item.name);
                          navigate(`/product/${item.id}`);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)]/50 transition-colors flex items-center gap-3 text-left group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[var(--paper)] overflow-hidden shrink-0">
                          <ProductImage
                            image={item.image}
                            alt={item.name}
                            variant="thumb"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-[var(--text)] group-hover:text-[var(--gold)] transition-colors truncate">
                            {language === 'sw' && item.nameSw ? item.nameSw : item.name}
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                            {item.category} • {item.quire || item.pageCount || '70 GSM'}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm font-mono font-black text-[var(--text)] shrink-0 tabular-nums">
                          {formatPrice(item.discountPrice || item.price, 'TSh')}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] text-center space-y-3">
                    <p className="text-sm font-bold text-[var(--text)]">
                      {language === 'sw'
                        ? `Hakuna bidhaa iliyopatikana kwa "${debouncedTerm}"`
                        : `No stationery products found for "${debouncedTerm}"`}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                      Inquire directly with our dispatch desk on WhatsApp for custom factory orders.
                    </p>
                    <a
                      href={`https://wa.me/255746268391?text=${encodeURIComponent('Habari OMEGA, ninatafuta: ' + debouncedTerm)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#16a34a] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Ask Dispatch on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* State 2: Default Recent Searches & Quick Categories */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--gold)] block">
                    RECENT SEARCHES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => executeSearch(term)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)] text-xs text-[var(--text)] transition-colors cursor-pointer group"
                      >
                        <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                        <span>{term}</span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-[var(--text-muted)] hover:text-[var(--red)] p-0.5"
                          aria-label={`Remove ${term}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--gold)] block">
                  QUICK CATALOGUE JUMPS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Counter Books (Q2-Q4)', href: '/catalog?category=Counter+Books' },
                    { label: 'Exercise Books (200p)', href: '/catalog?category=Exercise+Books' },
                    { label: 'Kraft Bahasha (A4)', href: '/catalog?category=Bahasha+%26+Envelopes' },
                    { label: 'Wholesale Cartons', href: '/wholesale' },
                  ].map((j) => (
                    <button
                      key={j.label}
                      type="button"
                      onClick={() => {
                        navigate(j.href);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)] text-left text-xs font-mono font-bold text-[var(--text)] hover:text-[var(--gold)] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{j.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
