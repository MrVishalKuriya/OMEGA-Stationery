import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount = effectivePrice < product.price;
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 hover:border-stone-300">
      {/* Product Image Area */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/3] w-full bg-stone-100 overflow-hidden border-b border-stone-100"
      >
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-50 text-center">
            <div className="w-24 h-32 border-2 border-red-700 bg-white p-2 flex flex-col items-center justify-between shadow-xs">
              <span className="text-[10px] font-bold tracking-widest text-red-700">OMEGA</span>
              <BookOpen className="w-6 h-6 text-red-700 stroke-[1.5]" />
              <span className="text-[9px] text-stone-500 font-mono-tabular">{product.sku}</span>
            </div>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 justify-between p-5 gap-4">
        <div className="space-y-1.5">
          {/* Metadata Line */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 truncate">
            <span className="truncate">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular shrink-0">{product.sku}</span>
            <span aria-hidden="true">·</span>
            <span
              className={`shrink-0 font-medium ${
                product.stockStatus === 'In Stock'
                  ? 'text-stone-700'
                  : product.stockStatus === 'Low Stock'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {product.stockStatus}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
            <Link to={`/product/${product.id}`} className="focus:outline-none">
              {product.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900 font-mono-tabular">
              ₹{effectivePrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through font-mono-tabular">
                ₹{product.price}
              </span>
            )}
            <span className="text-[11px] text-stone-400">Sample INR</span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : justAdded
                ? 'bg-stone-900 text-white'
                : 'bg-red-700 text-white hover:bg-red-800'
            }`}
          >
            {isOutOfStock ? (
              'Unavailable'
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
