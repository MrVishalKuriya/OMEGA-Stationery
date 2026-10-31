import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  Grid,
  Download,
  Search,
  Package,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice, Product } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { CatalogSkeletonGrid } from '@/components/ProductCardSkeleton';

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
  const { isCatalogLoading } = useStore();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

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
    <section className="py-16 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 text-charcoal-ink">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
        <div>
          <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-[#B91C1C] block">
            OFFICIAL FACTORY PRICE SCHEDULE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-ink tracking-tight mt-1">
            Wholesale Master Catalog
          </h2>
          <p className="text-xs sm:text-[13px] text-charcoal-ink mt-1 max-w-xl">
            Transparent bulk pricing with clear carton specifications, minimum order quantities, and direct factory invoicing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Switcher (Table vs Grid) */}
          <div className="flex items-center bg-paper-base border border-[#E7E5E0] p-1 rounded-[2px]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              className={`px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 rounded-[2px] transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'text-charcoal-ink hover:text-[#DC2626]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 rounded-[2px] transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'text-charcoal-ink hover:text-[#DC2626]'
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
            className="px-3.5 py-2 bg-white hover:bg-[#111113] hover:text-white border border-[#E7E5E0] rounded-[2px] text-xs font-bold font-mono tracking-wider text-charcoal-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#DC2626]" />
            <span className="hidden min-[400px]:inline">Export CSV</span>
            <span className="min-[400px]:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 border border-[#E7E5E0] rounded-[2px] mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-[#3F3F46] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, SKU, or specs..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-paper-base border border-[#E7E5E0] rounded-[2px] text-charcoal-ink placeholder:text-[#3F3F46] font-sans focus:outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                if (selectedCategory !== cat) {
                  setIsFiltering(true);
                  setSelectedCategory(cat);
                  setTimeout(() => setIsFiltering(false), 240);
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-[2px] transition-all font-sans cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-paper-base text-charcoal-ink border border-[#E7E5E0] hover:border-[#111113]'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}

          <label className="flex items-center gap-1.5 text-xs text-charcoal-ink cursor-pointer pl-3 whitespace-nowrap font-medium">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#DC2626]"
            />
            <span>In Stock</span>
          </label>
        </div>
      </div>

      {/* Listing Display */}
      {isCatalogLoading || isFiltering ? (
        <CatalogSkeletonGrid
          viewMode={viewMode === 'grid' ? 'grid' : 'list'}
          count={viewMode === 'grid' ? 4 : 4}
          columns={4}
        />
      ) : wholesaleProducts.length === 0 ? (
        <div className="bg-white p-12 text-center text-[#3F3F46] border border-[#E7E5E0] rounded-[2px]">
          <Package className="w-10 h-10 text-[#3F3F46] mx-auto mb-3" />
          <p className="text-sm font-semibold text-charcoal-ink">No wholesale products found matching your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="mt-3 text-xs font-bold text-[#B91C1C] underline font-mono tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <>
          {/* Mobile Spec Cards */}
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
                  className="bg-white p-4 border border-[#E7E5E0] rounded-[2px] space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Link to={`/product/${p.id}`} className="shrink-0">
                      <div className="w-16 h-16 aspect-square bg-[#FFFFFF] border border-[#E7E5E0] flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full aspect-square object-cover object-center rounded-lg"
                        />
                      </div>
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="px-2 py-0.5 bg-paper-base text-charcoal-ink text-[10px] font-mono uppercase font-bold tracking-wider">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-[#3F3F46] font-mono">
                          SKU: {p.sku}
                        </span>
                      </div>

                      <Link
                        to={`/product/${p.id}`}
                        className="font-bold text-sm text-charcoal-ink hover:text-[#DC2626] transition-colors leading-snug block line-clamp-2"
                      >
                        {p.name}
                      </Link>

                      {p.packaging && (
                        <p className="text-[11px] text-[#3F3F46] font-mono mt-0.5 truncate">
                          {p.packaging}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-paper-base border border-[#E7E5E0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#3F3F46] block font-bold">
                        Wholesale Price
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-mono font-black text-base text-[#B91C1C]">
                          {formatPrice(wholesalePrice, currency)}
                        </span>
                        <span className="font-mono text-xs text-[#3F3F46] line-through">
                          {formatPrice(p.price, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-[#DC2626] text-white rounded-[2px] inline-block mb-1">
                        {savePct}% OFF
                      </span>
                      <span className="text-[11px] text-charcoal-ink font-medium block">
                        Min: <strong>{minOrderQty}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={directWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-[2px] text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>Order on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onAddToCart(p.id, 1, true)}
                      className="py-2.5 px-3.5 bg-[#111113] hover:bg-[#262524] text-white rounded-[2px] transition-colors flex items-center justify-center cursor-pointer"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Rich Table */}
          <div className="hidden md:block bg-white border border-[#E7E5E0] rounded-[2px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#111113] text-white uppercase tracking-wider text-[11px] font-mono">
                    <th className="py-4 px-5 font-bold">Product</th>
                    <th className="py-4 px-4 font-bold">Category</th>
                    <th className="py-4 px-4 font-bold text-[#E4E4E7]">Retail MSRP</th>
                    <th className="py-4 px-4 font-bold text-[#F87171]">Wholesale Price</th>
                    <th className="py-4 px-4 font-bold">Min Order</th>
                    <th className="py-4 px-4 font-bold">Savings</th>
                    <th className="py-4 px-5 font-bold text-center">Procurement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E0] text-charcoal-ink">
                  {wholesaleProducts.map((p, idx) => {
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
                      <tr key={`${p.id}-${idx}`} className="hover:bg-paper-base transition-colors group">
                        <td className="py-4 px-5 font-medium">
                          <Link
                            to={`/product/${p.id}`}
                            className="flex items-center gap-3.5 group/item"
                          >
                            <div className="w-12 h-12 aspect-square bg-[#FFFFFF] border border-[#E7E5E0] flex items-center justify-center shrink-0 overflow-hidden rounded-lg">
                              <img
                                src={p.image}
                                alt={p.name}
                                loading="lazy"
                                className="w-full h-full aspect-square object-cover object-center rounded-lg"
                              />
                            </div>
                            <div>
                              <span className="font-bold block text-sm text-charcoal-ink group-hover/item:text-[#DC2626] transition-colors line-clamp-1">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-[#3F3F46] font-mono">
                                SKU: {p.sku} {p.packaging ? `· ${p.packaging}` : ''}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-[#3F3F46] font-medium whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-paper-base border border-[#E7E5E0] text-charcoal-ink text-[11px] font-mono">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-medium text-[#3F3F46] line-through whitespace-nowrap">
                          {formatPrice(p.price, currency)}
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-sm text-[#B91C1C] whitespace-nowrap">
                          {formatPrice(wholesalePrice, currency)}
                        </td>
                        <td className="py-4 px-4 font-semibold text-charcoal-ink whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-paper-base border border-[#E7E5E0] text-[11px] font-mono">
                            {minOrderQty}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-white bg-[#DC2626] px-2.5 py-0.5 rounded-[2px] font-mono">
                            {savePct}% OFF
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={directWa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-3 bg-[#DC2626] text-white hover:bg-[#B91C1C] rounded-[2px] transition-colors text-xs font-bold font-sans uppercase tracking-wider inline-flex items-center gap-1"
                              title="Order Carton on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Order</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => onAddToCart(p.id, 1, true)}
                              className="p-1.5 bg-[#111113] hover:bg-[#262524] text-white rounded-[2px] transition-colors cursor-pointer"
                              title="Add to cart"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wholesaleProducts.map((product, idx) => (
            <ProductCard key={`${product.id}-${idx}`} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
