import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';
import { Product, formatPrice } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';

interface CatalogProductListProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currency: string;
  cleanWhatsappDigits: string;
  language: string;
  onAddToCart: (id: string, qty: number, isWholesale: boolean) => void;
  onResetFilters: () => void;
}

export const CatalogProductList: React.FC<CatalogProductListProps> = ({
  products,
  viewMode,
  currentPage,
  totalPages,
  onPageChange,
  currency,
  cleanWhatsappDigits,
  language,
  onAddToCart,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-12 text-center space-y-4 shadow-xs transition-colors duration-200">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--gold)]">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[var(--text)]">
          {language === 'sw' ? 'Hakuna Bidhaa Iliyopatikana' : 'No Notebooks or Products Found'}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
          {language === 'sw'
            ? 'Jaribu kubadilisha vichujio au neno la utafutaji ili kuona bidhaa zilizopo kwenye katalogi yetu.'
            : 'Try clearing some filters or searching with a different keyword to browse our complete stationery inventory.'}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-6 py-2.5 rounded-full bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => {
            const effectivePrice =
              p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
            const hasDiscount = effectivePrice < p.price;
            const directWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
              `Hello OMEGA Tanzania, I would like to order: ${p.name} (SKU: ${p.sku}) - Price: ${currency} ${effectivePrice.toLocaleString()}. Please confirm availability and delivery.`
            )}`;

            return (
              <div
                key={p.id}
                className="bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all shadow-xs"
              >
                {/* Image Thumbnail */}
                <div className="w-full md:w-36 h-36 rounded-xl border border-[var(--border)] shrink-0 overflow-hidden relative bg-[var(--surface-2)]">
                  {p.badge && (
                    <span className="absolute top-2 left-2 z-10 bg-[var(--gold)] text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs font-mono uppercase">
                      {p.badge}
                    </span>
                  )}
                  <ProductImage
                    image={p.image}
                    alt={p.name}
                    variant="card"
                    className="w-full h-full"
                  />
                </div>

                {/* Info Column */}
                <div className="flex-1 space-y-2 w-full text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)]">
                      SKU: {p.sku} · {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{p.stockStatus || 'In Stock'}</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[var(--text)]">
                    <Link to={`/product/${p.id}`} className="hover:text-[var(--red)] transition-colors">
                      {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                    </Link>
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {language === 'sw' && p.descriptionSw ? p.descriptionSw : p.description}
                  </p>

                  {/* Technical Specs Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[var(--text)]">
                    {p.quire && (
                      <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] font-medium border border-[var(--border)]">
                        {p.quire}
                      </span>
                    )}
                    {p.pageCount && (
                      <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] font-medium border border-[var(--border)]">
                        {p.pageCount}
                      </span>
                    )}
                    {p.paperType && (
                      <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] font-medium border border-[var(--border)]">
                        {p.paperType}
                      </span>
                    )}
                    {p.packaging && (
                      <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] font-medium border border-[var(--border)]">
                        Box: {p.packaging}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Action Column */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-44 gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
                  <div className="text-left md:text-right">
                    <div className="text-lg font-bold font-mono text-[var(--text)]">
                      {formatPrice(effectivePrice, currency)}
                    </div>
                    {hasDiscount && (
                      <div className="text-[11px] text-[var(--text-muted)] line-through font-mono">
                        {formatPrice(p.price, currency)}
                      </div>
                    )}
                    {p.wholesalePrice && (
                      <div className="text-[10px] text-[var(--red)] font-bold font-mono">
                        Carton: {formatPrice(p.wholesalePrice, currency)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(p.id, 1, true)}
                      className="px-3.5 py-2 rounded-full bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                    <a
                      href={directWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-[#25D366] hover:bg-[#16a34a] text-white transition-colors cursor-pointer"
                      title="Order on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          role="navigation"
          aria-label="Pagination"
          className="flex items-center justify-center gap-2 pt-8 border-t border-[var(--border)]"
        >
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-9 h-9 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--red)] text-white shadow-xs'
                    : 'bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] text-xs font-bold text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}
    </div>
  );
};
