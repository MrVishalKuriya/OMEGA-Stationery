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
      <div className="bg-white border border-[#e2dedb] rounded-2xl p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#f5f4f4] border border-[#e2dedb] flex items-center justify-center mx-auto text-[#8c847e]">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[#3b352f]">
          {language === 'sw' ? 'Hakuna Bidhaa Iliyopatikana' : 'No Notebooks or Products Found'}
        </h3>
        <p className="text-xs sm:text-sm text-[#8c847e] max-w-md mx-auto">
          {language === 'sw'
            ? 'Jaribu kubadilisha vichujio au neno la utafutaji ili kuona bidhaa zilizopo kwenye katalogi yetu.'
            : 'Try clearing some filters or searching with a different keyword to browse our complete stationery inventory.'}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-6 py-2.5 rounded-full bg-[#4b423b] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3b352f] transition-all"
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
                className="bg-white border border-[#e2dedb] hover:border-[#c49b7c] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all shadow-xs ledup-card ledup-sheen"
              >
                {/* Image Thumbnail */}
                <div className="w-full md:w-36 h-36 bg-[#fafafa] rounded-xl border border-[#e2dedb] p-2 flex items-center justify-center shrink-0 overflow-hidden relative">
                  {p.badge && (
                    <span className="absolute top-2 left-2 z-10 bg-[#c49b7c] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      {p.badge}
                    </span>
                  )}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Info Column */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8c847e]">
                      SKU: {p.sku} · {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{p.stockStatus || 'In Stock'}</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[#3b352f]">
                    <Link to={`/product/${p.id}`} className="hover:text-[#c49b7c] transition-colors">
                      {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#8c847e] line-clamp-2">
                    {language === 'sw' && p.descriptionSw ? p.descriptionSw : p.description}
                  </p>

                  {/* Technical Specs Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#4b423b]">
                    {p.quire && (
                      <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                        {p.quire}
                      </span>
                    )}
                    {p.pageCount && (
                      <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                        {p.pageCount}
                      </span>
                    )}
                    {p.paperType && (
                      <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                        {p.paperType}
                      </span>
                    )}
                    {p.packaging && (
                      <span className="px-2 py-0.5 rounded bg-[#f5f4f4] font-medium border border-[#e2dedb]">
                        Box: {p.packaging}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Action Column */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-44 gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#e2dedb]">
                  <div className="text-left md:text-right">
                    <div className="text-lg font-bold font-mono text-[#3b352f]">
                      {formatPrice(effectivePrice, currency)}
                    </div>
                    {hasDiscount && (
                      <div className="text-[11px] text-[#8c847e] line-through font-mono">
                        {formatPrice(p.price, currency)}
                      </div>
                    )}
                    {p.wholesalePrice && (
                      <div className="text-[10px] text-[#c49b7c] font-bold font-mono">
                        Carton: {formatPrice(p.wholesalePrice, currency)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(p.id, 1, true)}
                      className="px-3.5 py-2 rounded-full btn-ledup-copper text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                    <a
                      href={directWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-[#4b423b] hover:bg-[#3b352f] text-white transition-colors"
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
          className="flex items-center justify-center gap-2 pt-8 border-t border-[#e2dedb]"
        >
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-[#e2dedb] bg-white text-xs font-bold text-[#4b423b] hover:bg-[#f5f4f4] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
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
                className={`w-9 h-9 rounded-lg text-xs font-bold font-mono transition-all ${
                  isCurrent
                    ? 'bg-[#4b423b] text-white shadow-xs'
                    : 'bg-white border border-[#e2dedb] text-[#3b352f] hover:bg-[#f5f4f4]'
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
            className="px-3 py-2 rounded-lg border border-[#e2dedb] bg-white text-xs font-bold text-[#4b423b] hover:bg-[#f5f4f4] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}
    </div>
  );
};
