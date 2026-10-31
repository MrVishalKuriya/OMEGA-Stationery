import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  List,
  Grid,
  Download,
  Search,
  Package,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice, Product } from '@/types/store';
import { ProductCard } from '@/components/ProductCard';

interface WholesaleCatalogViewProps {
  products: Product[];
  currency: string;
  cleanWhatsappDigits: string;
  onAddToCart: (productId: string, quantity: number, isWholesale: boolean) => void;
  onExportCSV: () => void;
}

export const WholesaleCatalogView: React.FC<WholesaleCatalogViewProps> = ({
  products,
  currency,
  cleanWhatsappDigits,
  onAddToCart,
  onExportCSV,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = useMemo<string[]>(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const wholesaleProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStock = !inStockOnly || p.stockStatus === 'In Stock';
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, inStockOnly]);

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-[#dc2626]/10 border border-[#dc2626]/30 text-[11px] font-bold text-[#dc2626] font-mono uppercase tracking-widest shadow-xs">
            <span>OFFICIAL FACTORY PRICE SCHEDULE</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18181b] tracking-tight mt-1.5">
            Wholesale Master Catalog
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
            Transparent bulk pricing with clear carton specifications, minimum order quantities, and direct factory invoicing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Switcher (Table vs Grid) */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-[#111113] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-[#111113]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#111113] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-[#111113]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold font-mono tracking-wider text-[#18181b] inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#dc2626]" />
            <span className="hidden min-[400px]:inline">Export CSV</span>
            <span className="min-[400px]:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-zinc-200 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, SKU, or specs..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] bg-zinc-50 text-[#18181b] placeholder:text-zinc-400 transition-all font-sans"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-sans ${
                selectedCategory === cat
                  ? 'bg-[#111113] text-white shadow-xs'
                  : 'bg-zinc-50 text-zinc-600 hover:text-[#111113] hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}

          <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer pl-3 border-l border-zinc-200 whitespace-nowrap font-medium">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-[#dc2626] rounded focus:ring-0 accent-[#dc2626]"
            />
            <span>In Stock</span>
          </label>
        </div>
      </div>

      {/* Listing Display */}
      {wholesaleProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200 text-zinc-500 shadow-xs">
          <Package className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#18181b]">No wholesale products found matching your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="mt-3 text-xs font-bold text-[#dc2626] underline font-mono tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <>
          {/* ======================================================== */}
          {/* 1. MOBILE RESPONSIVE SPEC CARDS (< md: NO CUTOFFS!)     */}
          {/* ======================================================== */}
          <div className="block md:hidden space-y-3.5">
            {wholesaleProducts.map((p) => {
              const wholesalePrice = p.wholesalePrice || Math.round(p.price * 0.7);
              const saving = p.price - wholesalePrice;
              const savePct = Math.round((saving / p.price) * 100);
              const minOrderQty =
                p.wholesaleMinQty
                  ? `${p.wholesaleMinQty} Pcs`
                  : p.category === 'Counter Books'
                  ? '1 Carton'
                  : '50 Pcs';

              const directWa = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                `Hello OMEGA Tanzania, I want to place a wholesale order for: ${p.name} (SKU: ${p.sku}) - Wholesale Price: ${currency} ${wholesalePrice.toLocaleString()}. Please confirm availability.`
              )}`;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-xs space-y-3"
                >
                  {/* Top: Image + Info */}
                  <div className="flex items-start gap-3">
                    <Link to={`/product/${p.id}`} className="shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-16 h-16 object-contain rounded-xl bg-zinc-50 p-1 border border-zinc-200"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-mono uppercase font-bold tracking-wider">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          SKU: {p.sku}
                        </span>
                      </div>

                      <Link
                        to={`/product/${p.id}`}
                        className="font-bold text-sm text-[#18181b] hover:text-[#dc2626] transition-colors leading-snug block line-clamp-2"
                      >
                        {p.name}
                      </Link>

                      {p.packaging && (
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate">
                          {p.packaging}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Pricing & Packaging Details */}
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                        Wholesale Price
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-mono font-black text-base text-emerald-700">
                          {formatPrice(wholesalePrice, currency)}
                        </span>
                        <span className="font-mono text-xs text-zinc-400 line-through">
                          {formatPrice(p.price, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block mb-1">
                        {savePct}% OFF
                      </span>
                      <span className="text-[11px] text-zinc-600 font-medium block">
                        Min: <strong className="text-[#18181b]">{minOrderQty}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={directWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#111113] hover:bg-[#18181b] text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Order on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onAddToCart(p.id, 1, true)}
                      className="py-2.5 px-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[#111113] border border-zinc-200 transition-colors flex items-center justify-center shadow-xs"
                      title="Add to cart / bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 2. DESKTOP RICH DATA TABLE (>= md)                       */}
          {/* ======================================================== */}
          <div className="hidden md:block bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#111113] text-white uppercase tracking-wider text-[11px] font-mono border-b border-zinc-800">
                    <th className="py-4 px-5 font-bold">Product</th>
                    <th className="py-4 px-4 font-bold">Category</th>
                    <th className="py-4 px-4 font-bold text-zinc-400">Retail MSRP</th>
                    <th className="py-4 px-4 font-bold text-[#ef4444]">Wholesale Price</th>
                    <th className="py-4 px-4 font-bold">Min Order</th>
                    <th className="py-4 px-4 font-bold">Savings</th>
                    <th className="py-4 px-5 font-bold text-center">Procurement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[#18181b]">
                  {wholesaleProducts.map((p) => {
                    const wholesalePrice = p.wholesalePrice || Math.round(p.price * 0.7);
                    const saving = p.price - wholesalePrice;
                    const savePct = Math.round((saving / p.price) * 100);
                    const minOrderQty =
                      p.wholesaleMinQty
                        ? `${p.wholesaleMinQty} Pcs`
                        : p.category === 'Counter Books'
                        ? '1 Carton'
                        : '50 Pcs';

                    const directWa = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                      `Hello OMEGA Tanzania, I want to place a wholesale order for: ${p.name} (SKU: ${p.sku}) - Wholesale Price: ${currency} ${wholesalePrice.toLocaleString()}. Please confirm availability.`
                    )}`;

                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors group">
                        <td className="py-4 px-5 font-medium">
                          <Link
                            to={`/product/${p.id}`}
                            className="flex items-center gap-3.5 group/item"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              loading="lazy"
                              className="w-12 h-12 object-contain rounded-xl bg-zinc-50 p-1 border border-zinc-200 shrink-0 group-hover/item:border-[#dc2626] transition-colors"
                            />
                            <div>
                              <span className="font-bold block text-sm group-hover/item:text-[#dc2626] transition-colors line-clamp-1">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-zinc-500 font-mono">
                                SKU: {p.sku} {p.packaging ? `· ${p.packaging}` : ''}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-zinc-600 font-medium whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-mono">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-medium text-zinc-400 line-through whitespace-nowrap">
                          {formatPrice(p.price, currency)}
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-sm text-emerald-700 whitespace-nowrap">
                          {formatPrice(wholesalePrice, currency)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#111113] whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-[11px] font-mono">
                            {minOrderQty}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-md font-mono">
                            {savePct}% OFF
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={directWa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-3 rounded-lg bg-[#111113] text-white hover:bg-[#dc2626] transition-colors text-xs font-bold font-mono uppercase tracking-wider inline-flex items-center gap-1 shadow-xs"
                              title="Order Carton on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Order</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => onAddToCart(p.id, 1, true)}
                              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#111113] border border-zinc-200 transition-colors shadow-xs"
                              title="Add to cart / bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {wholesaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
