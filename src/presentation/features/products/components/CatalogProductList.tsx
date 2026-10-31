import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MessageCircle,
  Layers,
  FileText,
  ShieldCheck,
  Package,
} from 'lucide-react';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { Product, formatPrice } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';
import { CatalogSkeletonGrid } from '@/components/ProductCardSkeleton';

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
  isLoading?: boolean;
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
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <CatalogSkeletonGrid
        viewMode={viewMode}
        count={viewMode === 'grid' ? 6 : 4}
        columns={3}
      />
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#FFFFFF] rounded-lg p-10 sm:p-14 text-center space-y-4 border border-[#E7E5E0] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] relative overflow-hidden"
      >
        <div className="w-14 h-14 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] flex items-center justify-center mx-auto text-[#111113]">
          <Search className="w-6 h-6 text-[#8C7355]" />
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-semibold text-[#111113]">
          {language === 'sw' ? 'Hakuna Bidhaa Iliyopatikana' : 'No Stationery Found'}
        </h3>
        <p className="text-xs sm:text-sm text-[#6E6B66] max-w-md mx-auto leading-relaxed">
          {language === 'sw'
            ? 'Jaribu kubadilisha vichujio au neno la utafutaji ili kuona daftari na bidhaa za OMEGA zilizopo.'
            : 'Try adjusting your filters or search keywords to browse our full factory counter books and scholastic notebooks.'}
        </p>
        <div className="pt-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-md bg-[#111113] hover:bg-[#262524] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs border border-[#E7E5E0] cursor-pointer"
          >
            Clear All Filters
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  return (
    <div className="space-y-8">
      {viewMode === 'grid' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5"
        >
          {products.map((product, idx) => (
            <ProductCard key={`${product.id}-${idx}`} product={product} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3.5"
        >
          {products.map((p, idx) => {
            const effectivePrice =
              p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
            const hasDiscount = effectivePrice < p.price;
            const directWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
              `Hello OMEGA Tanzania, I would like to order: ${p.name} (SKU: ${p.sku}) - Price: ${currency} ${effectivePrice.toLocaleString()}. Please confirm availability and delivery.`
            )}`;

            return (
              <motion.div
                key={`${p.id}-${idx}`}
                whileHover={{ y: -2, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                className="bg-[#FFFFFF] rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all border border-[#E7E5E0] hover:border-[#8C7355]/60 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(35,27,18,0.08)] text-left relative overflow-hidden group"
              >
                {/* Image Stage - Consistent 1:1 Aspect Ratio & Rounded-lg Container */}
                <Link
                  to={`/product/${p.id}`}
                  className="w-full sm:w-36 md:w-36 aspect-square rounded-lg bg-[#FFFFFF] flex items-center justify-center shrink-0 overflow-hidden relative border border-[#E7E5E0] group-hover:border-[#DC2626]/40 transition-colors"
                >
                  {p.badge && (
                    <span className="absolute top-2 left-2 z-10 bg-[#111113] text-white text-[8px] font-semibold px-2 py-0.5 rounded-[4px] shadow-2xs font-mono">
                      {p.badge}
                    </span>
                  )}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full aspect-square object-cover object-center rounded-lg transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </Link>

                {/* Information Column (High Icon Density) */}
                <div className="flex-1 space-y-1.5 w-full min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-semibold text-[#6E6B66] bg-[#F2EFEB] px-2 py-0.5 rounded-[4px] border border-[#E7E5E0]">
                      SKU: {p.sku} · {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{p.stockStatus || 'In Stock'}</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-sm sm:text-base font-semibold text-[#111113]">
                    <Link
                      to={`/product/${p.id}`}
                      className="hover:text-[#DC2626] transition-colors"
                    >
                      {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#6E6B66] line-clamp-2">
                    {language === 'sw' && p.descriptionSw ? p.descriptionSw : p.description}
                  </p>

                  {/* Icon Chips Matrix (Quire, Ruling, GSM, Packaging) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {p.quire && (
                      <Chip
                        size="small"
                        icon={<Layers className="w-3 h-3 text-[#8C7355]" />}
                        label={p.quire}
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          bgcolor: '#F2EFEB',
                          border: '1px solid #E7E5E0',
                          color: '#111113',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                    {p.pageCount && (
                      <Chip
                        size="small"
                        icon={<FileText className="w-3 h-3 text-[#8C7355]" />}
                        label={p.pageCount}
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          bgcolor: '#F2EFEB',
                          border: '1px solid #E7E5E0',
                          color: '#111113',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                    {p.paperType && (
                      <Chip
                        size="small"
                        icon={<ShieldCheck className="w-3 h-3 text-[#8C7355]" />}
                        label={p.paperType}
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          bgcolor: '#F2EFEB',
                          border: '1px solid #E7E5E0',
                          color: '#111113',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                    {p.packaging && (
                      <Chip
                        size="small"
                        icon={<Package className="w-3 h-3 text-[#8C7355]" />}
                        label={`Box: ${p.packaging}`}
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          bgcolor: '#F2EFEB',
                          border: '1px solid #E7E5E0',
                          color: '#111113',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Price & Action Column */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-44 gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E7E5E0]">
                  <div className="text-left md:text-right">
                    <div className="text-lg font-bold font-mono text-[#111113] tracking-tight">
                      {formatPrice(effectivePrice, currency)}
                    </div>
                    {hasDiscount && (
                      <div className="text-[11px] text-[#6E6B66] line-through font-mono">
                        {formatPrice(p.price, currency)}
                      </div>
                    )}
                    {p.wholesalePrice && (
                      <div className="text-[10px] text-[#8C7355] font-semibold font-mono">
                        Carton: {formatPrice(p.wholesalePrice, currency)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip title="Add to Cart" arrow>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => onAddToCart(p.id, 1, true)}
                        className="px-3.5 py-2 rounded-[2px] bg-[#111113] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </motion.button>
                    </Tooltip>
                    <Tooltip title="Order on WhatsApp" arrow>
                      <motion.a
                        whileTap={{ scale: 0.95 }}
                        href={directWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-[2px] bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xs transition-all cursor-pointer flex items-center justify-center"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </motion.a>
                    </Tooltip>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          role="navigation"
          aria-label="Pagination"
          className="flex items-center justify-center gap-1.5 pt-8"
        >
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-[2px] bg-[#FFFFFF] text-xs font-bold uppercase tracking-wider text-[#111113] hover:bg-[#111113] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 border border-[#E5E7EB] shadow-2xs transition-colors cursor-pointer"
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
                className={`w-8 h-8 rounded-[2px] text-xs font-bold font-mono transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#DC2626] text-[#FFFFFF] shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#111113] hover:bg-[#111113] hover:text-white border border-[#E5E7EB]'
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
            className="px-3 py-2 rounded-[2px] bg-[#FFFFFF] text-xs font-bold uppercase tracking-wider text-[#111113] hover:bg-[#111113] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 border border-[#E5E7EB] shadow-2xs transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}
    </div>
  );
};
