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
    <div className="min-h-screen bg-[#FFFFFF] text-[#111113]">
      <SEOHead
        title="My Wishlist | OMEGA Stationery Tanzania"
        description="Your saved writing notebooks, counter books, and school stationery products."
      />

      {/* Top Photographic Header with Reduced Dark Filter & Warm Light Filter */}
      <section className="relative overflow-hidden w-full bg-[#1B1B1E] text-white py-14 lg:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 brightness-110 contrast-105 pointer-events-none"
          style={{ backgroundImage: `url('/hero-desk-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/65 via-[#111113]/45 to-[#111113]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-[#F9F8F6]/15 to-white/25 mix-blend-soft-light pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.22),transparent_65%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-white/70 font-semibold mb-2">
            <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.home}</span>
            </Link>
            <span>/</span>
            <span className="text-[#DC2626] font-bold">Wishlist</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-[2px] text-[11px] font-bold uppercase tracking-widest text-white bg-[#DC2626] mb-3">
                <span>SAVED SELECTIONS &amp; INSTITUTIONAL QUOTAS</span>
              </div>
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                My Saved <span className="text-[#DC2626]">Wishlist</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-2">
                Keep track of your favorite stationery editions for school terms and corporate tenders.
              </p>
            </div>

            {wishlistedProducts.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs text-white hover:bg-white hover:text-[#111113] font-bold uppercase tracking-wider px-4 py-2.5 rounded-[2px] border border-white/70 transition-all cursor-pointer"
                >
                  Clear Wishlist
                </button>
                <a
                  href={shareWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-[2px] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Crimson Red Callout Strip with Upward White Triangle Notch */}
      <section className="relative bg-[#D62828] text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            SAVED ITEMS CAN BE MOVED TO CART OR SHARED DIRECTLY WITH OUR WHATSAPP DESK
          </p>
        </div>
        <div className="absolute -bottom-[1px] left-12 sm:left-24 lg:left-36 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[16px] border-b-white">
          <span className="absolute -left-1.5 top-1 text-[10px] text-zinc-400 font-bold leading-none select-none">
            ⌄
          </span>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-[#EEEEEE] rounded-[2px] p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 my-6">
            <div className="w-16 h-16 rounded-[2px] bg-[#F7F7F7] text-[#DC2626] flex items-center justify-center mx-auto border border-[#EEEEEE]">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#111113]">Your wishlist is currently empty</h2>
            <p className="text-xs sm:text-sm text-[#77767B] max-w-sm mx-auto leading-relaxed">
              Browse our authentic factory catalog and tap the heart icon on any notebook, counter book, or envelope to save it here.
            </p>
            <div className="pt-3">
              <Link
                to="/catalog"
                className="px-6 py-3 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Browse Master Catalog</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((p) => {
              const effectivePrice =
                p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
              return (
                <div
                  key={p.id}
                  className="bg-white border border-[#E7E5E0] rounded-lg p-3.5 overflow-hidden hover:border-[#DC2626] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="bg-[#FFFFFF] aspect-square w-full shrink-0 relative rounded-lg border border-[#E7E5E0] overflow-hidden">
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-md bg-[#111113] hover:bg-[#DC2626] text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to={`/product/${p.id}`}
                      className="absolute inset-0 aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-[#FFFFFF]"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full aspect-square object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] font-mono">
                        {p.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#111113] line-clamp-2 mt-0.5">
                        <Link to={`/product/${p.id}`} className="hover:text-[#DC2626] transition-colors">
                          {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                        </Link>
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#EEEEEE] flex items-baseline justify-between">
                      <span className="text-sm sm:text-base font-extrabold text-[#111113] font-mono">
                        {formatPrice(effectivePrice, currency)}
                      </span>
                      {p.discountPrice && p.discountPrice < p.price && (
                        <span className="text-xs text-[#77767B] line-through font-mono">
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
                      className="w-full py-2.5 px-3 rounded-[2px] bg-[#111113] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
