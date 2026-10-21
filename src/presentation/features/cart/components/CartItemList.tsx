import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { DetailedCartItem } from '@/context/StoreContext';

interface CartItemListProps {
  detailedCart: DetailedCartItem[];
  currency: string;
  language: string;
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
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {detailedCart.map((item) => (
          <div key={item.product.id} className="p-4 sm:p-5 flex items-center gap-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
              <img
                src={item.product.image}
                alt={item.product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {language === 'sw' && item.product.nameSw ? item.product.nameSw : item.product.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>{item.product.sku}</span>
                {item.product.quire && (
                  <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                    {item.product.quire}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-800 font-mono-tabular mt-1">
                {currency} {item.effectiveUnitPrice.toLocaleString()}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
              <button
                type="button"
                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                className="p-1.5 text-slate-600 hover:text-slate-900"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-900 font-mono-tabular">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                className="p-1.5 text-slate-600 hover:text-slate-900"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Line Total */}
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-slate-900 font-mono-tabular">
                {currency} {item.lineTotal.toLocaleString()}
              </p>
              <button
                type="button"
                onClick={() => removeFromCart(item.product.id)}
                className="text-slate-400 hover:text-rose-600 p-1 mt-1 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'sw' ? 'Endelea Kuangalia Bidhaa Zingine' : 'Continue Shopping Other Products'}</span>
        </Link>
      </div>
    </div>
  );
};
