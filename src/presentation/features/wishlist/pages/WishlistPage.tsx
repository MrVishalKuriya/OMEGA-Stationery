import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    clearWishlist,
    addToCart,
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
    <div className="min-h-screen bg-[#fafafa] text-[#18181b]">
      <SEOHead
        title="My Wishlist | OMEGA Stationery Tanzania"
        description="Your saved writing notebooks, counter books, and school stationery products."
      />

      {/* Top Breadcrumb & Header */}
      <section className="relative overflow-hidden w-full bg-[#111113] text-white py-12 lg:py-16 border-b border-[#18181b]">
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-[#dc2626]/18 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold mb-2">
            <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.home}</span>
            </Link>
            <span>/</span>
            <span className="text-[#ef4444] font-bold">Wishlist</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 font-mono shadow-xs mb-3">
                <span>SAVED SELECTIONS &amp; INSTITUTIONAL QUOTAS</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
                My Saved Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-2">
                Keep track of your favorite stationery editions for school terms and corporate tenders.
              </p>
            </div>

            {wishlistedProducts.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs text-zinc-300 hover:text-white font-semibold px-3.5 py-2 rounded-lg border border-white/15 hover:border-white/30 bg-white/5 transition-all"
                >
                  Clear Wishlist
                </button>
                <a
                  href={shareWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all hover:scale-105"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-[#e4e4e7] rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 shadow-xl my-6">
            <div className="w-16 h-16 rounded-2xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mx-auto border border-[#dc2626]/20">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold text-[#18181b] font-heading">Your wishlist is currently empty</h2>
            <p className="text-xs sm:text-sm text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Browse our authentic factory catalog and tap the heart icon on any notebook, counter book, or envelope to save it here.
            </p>
            <div className="pt-3">
              <Link
                to="/catalog"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Browse Master Catalog</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {wishlistedProducts.map((p) => {
              const effectivePrice =
                p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
              return (
                <div
                  key={p.id}
                  className="bg-white border border-[#e4e4e7] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#dc2626] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="p-4 bg-[#fafafa] aspect-square flex items-center justify-center relative border-b border-[#e4e4e7]">
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#111113]/80 hover:bg-[#dc2626] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#dc2626] font-mono">
                        {p.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#18181b] line-clamp-2 mt-0.5">
                        <Link to={`/product/${p.id}`} className="hover:text-[#dc2626] transition-colors">
                          {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                        </Link>
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#e4e4e7] flex items-baseline justify-between">
                      <span className="text-sm sm:text-base font-black text-[#18181b] font-mono">
                        {formatPrice(effectivePrice, currency)}
                      </span>
                      {p.discountPrice && p.discountPrice < p.price && (
                        <span className="text-xs text-[#71717a] line-through font-mono">
                          {formatPrice(p.price, currency)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p.id, 1, true);
                        toggleWishlist(p.id);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer font-mono"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
