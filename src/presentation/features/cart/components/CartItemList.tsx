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
      <div className="bg-white divide-y divide-[#FAF6F0] shadow-xs overflow-hidden">
        {detailedCart.map((item) => (
          <div key={item.product.id} className="p-4 sm:p-5 flex items-center gap-4">
            {/* Thumbnail Box */}
            <div className="w-16 h-16 bg-[#FAF6F0] p-2 shrink-0 flex items-center justify-center">
              <img
                src={item.product.image}
                alt={item.product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#26130F] truncate">
                {language === 'sw' && item.product.nameSw ? item.product.nameSw : item.product.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#7D685E] font-mono mt-0.5">
                <span>{item.product.sku}</span>
                {item.product.quire && (
                  <span className="text-[#9E3618] font-bold bg-[#FAF6F0] px-1.5 py-0.5 text-[10px]">
                    {item.product.quire}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-[#26130F] font-mono mt-1">
                {currency} {item.effectiveUnitPrice.toLocaleString()}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center bg-[#FAF6F0]">
              <button
                type="button"
                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                className="p-2 text-[#7D685E] hover:text-[#26130F] cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-[#26130F] font-mono">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                className="p-2 text-[#7D685E] hover:text-[#26130F] cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Line Total */}
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-[#26130F] font-mono">
                {currency} {item.lineTotal.toLocaleString()}
              </p>
              <button
                type="button"
                onClick={() => removeFromCart(item.product.id)}
                className="text-[#7D685E] hover:text-[#9E3618] p-1 mt-1 transition-colors cursor-pointer"
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9E3618] hover:text-[#6B140B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'sw' ? '← Endelea na Manunuzi ya Katalogi' : '← Continue Shopping Catalog'}</span>
        </Link>
      </div>
    </div>
  );
};
