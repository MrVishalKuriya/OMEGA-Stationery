import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { DetailedCartItem } from '@/context/StoreContext';
import { ProductImage } from '@/components/ProductImage';

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
      <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] shadow-xs overflow-hidden">
        {detailedCart.map((item) => (
          <div key={item.product.id} className="p-4 sm:p-5 flex items-center gap-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden shrink-0">
              <ProductImage
                image={item.product.image}
                alt={item.product.name}
                variant="thumb"
                className="w-full h-full"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[var(--text)] truncate">
                {language === 'sw' && item.product.nameSw ? item.product.nameSw : item.product.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono mt-0.5">
                <span>{item.product.sku}</span>
                {item.product.quire && (
                  <span className="text-[var(--gold)] font-bold bg-[var(--surface-2)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[10px]">
                    {item.product.quire}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-[var(--text)] font-mono-tabular mt-1">
                {currency} {item.effectiveUnitPrice.toLocaleString()}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--surface-2)]">
              <button
                type="button"
                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-[var(--text)] font-mono-tabular">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Line Total */}
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-[var(--text)] font-mono-tabular">
                {currency} {item.lineTotal.toLocaleString()}
              </p>
              <button
                type="button"
                onClick={() => removeFromCart(item.product.id)}
                className="text-[var(--text-muted)] hover:text-[var(--red)] p-1 mt-1 transition-colors cursor-pointer"
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--red)] hover:opacity-85"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'sw' ? 'Endelea Kuangalia Bidhaa Zingine' : 'Continue Shopping Other Products'}</span>
        </Link>
      </div>
    </div>
  );
};
