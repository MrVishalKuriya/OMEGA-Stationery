import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import { ProductImage } from '@/components/ProductImage';
import { ProductCard } from '@/components/ProductCard';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    clearWishlist,
    storeConfig,
    language,
  } = useStore();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
  const currency = storeConfig.currencySymbol || 'TSh';

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const shareText = encodeURIComponent(
    `Hello OMEGA Tanzania, here is my saved Wishlist from your online catalog:\n` +
      wishlistedProducts
        .map((p, idx) => `${idx + 1}. ${p.name} (SKU: ${p.sku}) - ${currency} ${p.price.toLocaleString()}`)
        .join('\n') +
      `\nPlease advise on stock availability and wholesale rates.`
  );
  const shareWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${shareText}`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SEOHead
        title="My Wishlist | OMEGA Stationery Tanzania"
        description="Your saved writing notebooks, counter books, and school stationery products."
      />

      {/* Top Breadcrumb & Header */}
      <section className="relative overflow-hidden w-full bg-[var(--surface-1)] text-[var(--text)] py-12 lg:py-16 border-b border-[var(--border)]">
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-[var(--red)]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-semibold mb-2">
            <Link to="/" className="hover:text-[var(--text)] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.home}</span>
            </Link>
            <span>/</span>
            <span className="text-[var(--red)] font-bold">Wishlist</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--gold)] bg-[var(--surface-2)] border border-[var(--gold)]/30 font-mono shadow-xs mb-3">
                <span>SAVED SELECTIONS &amp; INSTITUTIONAL QUOTAS</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--text)] tracking-tight">
                My Saved Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2">
                Keep track of your favorite stationery editions for school terms and corporate tenders.
              </p>
            </div>

            {wishlistedProducts.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--red)] font-semibold px-3.5 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] transition-all cursor-pointer"
                >
                  Clear Wishlist
                </button>
                <a
                  href={shareWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {wishlistedProducts.length === 0 ? (
          <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 shadow-xl my-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] text-[var(--red)] flex items-center justify-center mx-auto border border-[var(--border)]">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text)] font-heading">Your wishlist is currently empty</h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
              Browse our authentic factory catalog and tap the heart icon on any notebook, counter book, or envelope to save it here.
            </p>
            <div className="pt-3">
              <Link
                to="/catalog"
                className="px-6 py-3 rounded-full bg-[var(--red)] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Browse Master Catalog</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {wishlistedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
