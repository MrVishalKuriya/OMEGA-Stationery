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
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#111113]">
            <Layers className="w-4 h-4 text-[#dc2626]" />
            <span>OFFICIAL FACTORY PRICE SCHEDULE</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-[#18181b] tracking-tight mt-1">
            Wholesale Master Catalog
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Transparent bulk pricing with clear carton specifications and minimum order quantities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher (Table vs Grid) */}
          <div className="flex items-center bg-white p-1 rounded-full border border-stone-200 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              className={`p-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#111113] text-white shadow-xs'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#111113] text-white shadow-xs'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onExportCSV}
            className="px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-[#111113] inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, SKU, or specs..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-stone-200 focus:outline-none focus:border-[#111113] bg-stone-50 text-[#18181b] placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#111113] text-white'
                  : 'bg-stone-50 text-stone-600 hover:text-black border border-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}

          <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer pl-2 border-l border-stone-200 whitespace-nowrap">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-[#111113] rounded focus:ring-0"
            />
            <span>In Stock</span>
          </label>
        </div>
      </div>

      {/* Listing Display */}
      {wholesaleProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
          <Package className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <p className="text-sm font-semibold">No wholesale products found matching your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="mt-3 text-xs font-bold text-[#111113] underline"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#18181b] text-white uppercase tracking-wider text-[11px] font-heading">
                  <th className="py-3.5 px-4 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Retail MSRP</th>
                  <th className="py-3.5 px-4 font-bold text-amber-200">Wholesale Price</th>
                  <th className="py-3.5 px-4 font-bold">Min Order</th>
                  <th className="py-3.5 px-4 font-bold">Margin</th>
                  <th className="py-3.5 px-4 font-bold text-center">Procurement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[#18181b]">
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
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium">
                        <Link
                          to={`/product/${p.id}`}
                          className="flex items-center gap-3 group/item"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="w-12 h-12 object-contain rounded-lg bg-stone-50 p-1 border border-stone-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold block text-sm group-hover/item:text-[#dc2626] transition-colors line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono">
                              SKU: {p.sku} {p.packaging ? `· ${p.packaging}` : ''}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-medium whitespace-nowrap">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-400 line-through whitespace-nowrap">
                        {formatPrice(p.price, currency)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-sm text-emerald-700 whitespace-nowrap">
                        {formatPrice(wholesalePrice, currency)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#111113] whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px]">
                          {minOrderQty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {savePct}% OFF
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={directWa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 rounded-full bg-[#111113] text-white hover:bg-[#18181b] transition-colors text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                            title="Order Carton on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Order</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => onAddToCart(p.id, 1, true)}
                            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#111113] border border-stone-200 transition-colors shadow-xs"
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
