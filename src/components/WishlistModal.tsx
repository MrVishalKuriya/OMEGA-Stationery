import React from 'react';
import { X, Heart, Trash2, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../types/store';

export const WishlistModal: React.FC = () => {
  const {
    isWishlistModalOpen,
    setIsWishlistModalOpen,
    wishlist,
    products,
    toggleWishlist,
    clearWishlist,
    addToCart,
    storeConfig,
  } = useStore();

  if (!isWishlistModalOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
  const currency = storeConfig.currencySymbol || 'TSh';

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const shareText = encodeURIComponent(
    `Hello OMEGA Tanzania, here is my saved Wishlist from your online catalog:\n` +
      wishlistedProducts.map((p, idx) => `${idx + 1}. ${p.name} (${currency} ${p.price.toLocaleString()})`).join('\n') +
      `\nPlease advise on total availability and delivery options.`
  );
  const shareWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${shareText}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsWishlistModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fafafa] rounded-[24px] overflow-hidden shadow-2xl border border-[#e2dedb] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Deep Mocha #4b423b */}
        <div className="bg-[#4b423b] text-white px-6 py-4 flex items-center justify-between border-b border-[#e2dedb]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#c49b7c] flex items-center justify-center text-[#4b423b]">
              <Heart className="w-4 h-4 fill-[#4b423b]" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase font-heading text-white">
                My Saved Wishlist
              </h2>
              <span className="text-xs text-[#c49b7c] font-mono">
                {wishlistedProducts.length} saved {wishlistedProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistModalOpen(false)}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white border border-[#e2dedb] flex items-center justify-center mx-auto text-[#8c847e]">
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-semibold text-[#3b352f] font-heading">Your wishlist is currently empty.</p>
              <p className="text-xs text-[#8c847e] max-w-sm mx-auto">
                Click the heart icon on any notebook or stationery product to save it here for future reference or bulk inquiries.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((p) => {
              const effectivePrice =
                p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3.5 rounded-[16px] bg-white border border-[#e2dedb] shadow-xs hover:border-[#c49b7c] transition-colors"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-contain rounded-[10px] bg-[#f5f4f4] p-1 border border-[#e2dedb] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c49b7c] font-mono">
                      {p.category}
                    </span>
                    <h3 className="text-xs font-bold text-[#3b352f] truncate">{p.name}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-[#3b352f] font-mono">
                        {formatPrice(effectivePrice, currency)}
                      </span>
                      {p.discountPrice && p.discountPrice < p.price && (
                        <span className="text-xs text-[#8c847e] line-through font-mono">
                          {formatPrice(p.price, currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p.id, 1);
                        toggleWishlist(p.id);
                      }}
                      className="px-3.5 py-2 rounded-[10px] btn-ledup-copper text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 text-[#8c847e] hover:text-[#D64545] rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 bg-white border-t border-[#e2dedb] flex items-center justify-between">
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs text-[#8c847e] hover:text-[#D64545] font-semibold"
            >
              Clear All Items
            </button>
            <a
              href={shareWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-[12px] bg-[#4b423b] hover:bg-[#3b352f] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
