import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../types/store';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

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

  const t = TRANSLATIONS[language];
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="My Wishlist | OMEGA Stationery Tanzania"
        description="Your saved writing notebooks, counter books, and school stationery products."
      />

      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold mb-2">
            <Link to="/" className="hover:text-stone-900">
              {t.home}
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-bold">Wishlist</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-black text-stone-900 flex items-center gap-3">
            <span>My Saved Wishlist</span>
            <Heart className="w-7 h-7 text-red-600 fill-red-600" />
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Keep track of your favorite stationery editions for school terms and corporate tenders.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs text-stone-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-stone-200 hover:border-red-300 transition-colors"
            >
              Clear Wishlist
            </button>
            <a
              href={shareWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* Content */}
      {wishlistedProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-12">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Your wishlist is currently empty</h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Browse our authentic catalog and click the heart icon on any notebook or folder to save it.
          </p>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="px-6 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProducts.map((p) => {
            const effectivePrice =
              p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
            return (
              <div
                key={p.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-red-500/50 transition-all flex flex-col justify-between"
              >
                <div className="p-4 bg-stone-50 aspect-square flex items-center justify-center relative">
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain p-2"
                  />
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                      {p.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-2">
                      <Link to={`/product/${p.id}`} className="hover:text-red-700">
                        {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                      </Link>
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                    <span className="text-base font-black text-stone-900 font-mono">
                      {formatPrice(effectivePrice, currency)}
                    </span>
                    {p.discountPrice && (
                      <span className="text-xs text-stone-400 line-through font-mono">
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
                    className="w-full py-2.5 px-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
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
  );
};
