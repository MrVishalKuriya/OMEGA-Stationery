import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { DetailedCartItem } from '@/context/StoreContext';
import { Language } from '@/types/store';

interface CartItemListProps {
  detailedCart: DetailedCartItem[];
  currency: string;
  language: Language;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  detailedCart,
  currency,
  language,
  updateCartQuantity,
  removeFromCart,
}) => {
  return (
    <div className="lg:col-span-7 space-y-4">
      {detailedCart.map(({ product, quantity, effectiveUnitPrice, lineTotal }) => {
        const isWholesaleApplied =
          product.wholesaleMinQty &&
          product.wholesalePrice &&
          quantity >= product.wholesaleMinQty;

        return (
          <div
            key={product.id}
            className="bg-white p-5 border border-[#E7E5E0] hover:border-[#DC2626] rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Link
                to={`/product/${product.id}`}
                className="w-20 h-20 aspect-square bg-paper-base border border-[#E7E5E0] rounded-lg p-1.5 flex items-center justify-center shrink-0 overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full aspect-square object-cover rounded-lg"
                />
              </Link>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B91C1C]">
                    {product.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#3F3F46] font-semibold">
                    SKU: {product.sku}
                  </span>
                  {isWholesaleApplied && (
                    <span className="px-2 py-0.5 bg-[#15803D] text-white text-[9px] font-bold uppercase tracking-wider rounded-[2px]">
                      {language === 'sw' ? 'Bei ya Jumla' : 'Wholesale Tier Active'}
                    </span>
                  )}
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="text-sm sm:text-base font-bold text-charcoal-ink hover:text-[#DC2626] transition-colors line-clamp-2 block"
                >
                  {product.name}
                </Link>

                <p className="text-xs text-[#3F3F46] font-mono font-semibold">
                  {currency} {effectiveUnitPrice.toLocaleString()}{' '}
                  <span className="text-[11px] font-normal">
                    / {product.packaging || 'unit'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E7E5E0]">
              <div className="flex items-center border border-[#D4D2CD] rounded-[4px] bg-paper-base">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                  className="p-2 text-charcoal-ink hover:text-[#DC2626] hover:bg-white transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-charcoal-ink">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                  className="p-2 text-charcoal-ink hover:text-[#DC2626] hover:bg-white transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="text-sm font-mono font-extrabold text-charcoal-ink">
                  {currency} {lineTotal.toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                className="p-2 text-[#52525B] hover:text-[#DC2626] transition-colors cursor-pointer"
                aria-label={`Remove ${product.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default CartItemList;
