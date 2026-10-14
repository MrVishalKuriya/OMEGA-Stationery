import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  Check,
  BookOpen,
  Layers,
  ShieldCheck,
  Truck,
  Phone,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, storeConfig, language } = useStore();
  const t = TRANSLATIONS[language];

  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [selectedPhoneDesk, setSelectedPhoneDesk] = useState<string>('255715268391');

  useEffect(() => {
    setQuantity(1);
    setSelectedImageIdx(0);
    setImgError(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
        <SEOHead
          title="Product Not Found"
          description="The requested stationery or book item could not be found in our catalog."
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {language === 'sw' ? 'Bidhaa Haikupatikana' : 'Product Not Found'}
        </h1>
        <p className="text-sm text-slate-600">
          {language === 'sw'
            ? 'Bidhaa unayoitafuta inaweza kuwa imeondolewa au kiungo kimebadilika.'
            : 'The product you are looking for may have been removed or its ID has changed.'}
        </p>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-[#0f2342] text-white text-sm font-semibold rounded-xl hover:bg-[#1e3a8a] transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.exploreCatalog}</span>
          </Link>
        </div>
      </div>
    );
  }

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;
  const hasDiscount = effectivePrice < product.price;
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const galleryImages =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const currency = storeConfig.currencySymbol || 'TSh';

  // Format WhatsApp Message with full details
  const directWhatsappText = [
    `*${storeConfig.businessName} — Order Enquiry*`,
    `----------------------------------------`,
    `Product: ${product.name}`,
    `SKU Code: ${product.sku}`,
    product.quire ? `Quire: ${product.quire}` : null,
    product.pageCount ? `Pages: ${product.pageCount}` : null,
    `Quantity Requested: ${quantity}`,
    `Unit Price: ${currency} ${effectivePrice.toLocaleString()}`,
    `Estimated Total: ${currency} ${(effectivePrice * quantity).toLocaleString()}`,
    `----------------------------------------`,
    `Please confirm stock availability and delivery timeline.`,
  ]
    .filter(Boolean)
    .join('\n');

  const directWhatsappUrl = `https://wa.me/${selectedPhoneDesk}?text=${encodeURIComponent(
    directWhatsappText
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 w-full max-w-full overflow-hidden">
      <SEOHead
        title={`${product.name} (${currency} ${effectivePrice.toLocaleString()}) — OMEGA`}
        description={product.description}
        product={product}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
        <Link to="/" className="hover:text-slate-900 font-semibold">
          {t.home}
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/catalog" className="hover:text-slate-900 font-semibold">
          {t.catalog}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`/catalog?category=${encodeURIComponent(product.category)}`}
          className="hover:text-slate-900 font-semibold"
        >
          {product.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center p-4">
            {selectedImageIdx < galleryImages.length && !imgError ? (
              <img
                src={galleryImages[selectedImageIdx]}
                alt={`${product.name} - View ${selectedImageIdx + 1}`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain"
              />
            ) : (
              /* Specification Label Preview Card */
              <div className="w-full h-full p-6 bg-slate-100 flex items-center justify-center">
                <div className="w-full max-w-sm border-2 border-[#0f2342] bg-white p-6 space-y-4 shadow-sm rounded-xl">
                  <div className="text-center border-b-2 border-[#0f2342] pb-3">
                    <p className="text-xl font-bold tracking-widest text-[#0f2342] font-serif-luxury">
                      OMEGA NOTEBOOKS
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 mt-0.5">
                      {product.category} Specification Sheet
                    </p>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 font-mono-tabular">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="font-semibold text-[#0f2342]">ITEM:</span>
                      <span className="truncate max-w-[200px]">{product.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="font-semibold text-[#0f2342]">SKU:</span>
                      <span>{product.sku}</span>
                    </div>
                    {product.specifications.slice(0, 3).map((spec) => (
                      <div
                        key={spec.label}
                        className="flex justify-between border-b border-slate-100 pb-1"
                      >
                        <span className="font-semibold text-[#0f2342] uppercase">
                          {spec.label}:
                        </span>
                        <span className="truncate max-w-[180px]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {galleryImages.map((imgUrl, index) => (
              <button
                key={`${imgUrl}-${index}`}
                type="button"
                onClick={() => {
                  setImgError(false);
                  setSelectedImageIdx(index);
                }}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-colors bg-stone-50 p-1 ${
                  selectedImageIdx === index
                    ? 'border-red-600 shadow-sm'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSelectedImageIdx(galleryImages.length)}
              className={`h-16 px-3 rounded-xl border-2 shrink-0 flex flex-col items-center justify-center bg-stone-50 text-[11px] font-bold transition-colors ${
                selectedImageIdx === galleryImages.length
                  ? 'border-red-600 text-red-700'
                  : 'border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
            >
              <BookOpen className="w-4 h-4 mb-0.5 text-red-600" />
              <span>Specs Sheet</span>
            </button>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Quantity & WhatsApp Order */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3 border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
              <span className="font-bold text-red-700 uppercase tracking-wider">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-700">SKU: {product.sku}</span>
              {product.quire && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {product.quire}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {language === 'sw' && product.nameSw ? product.nameSw : product.name}
            </h1>

            {/* Price & Stock Display */}
            <div className="pt-2 flex flex-wrap items-baseline justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  {t.retailPrice}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 font-mono-tabular">
                    {currency} {effectivePrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-slate-400 line-through font-mono-tabular">
                      {currency} {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {product.wholesalePrice && (
                <div className="text-right p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {t.wholesalePrice}
                  </span>
                  <span className="text-base font-black text-emerald-700 font-mono-tabular">
                    {currency} {product.wholesalePrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    Min Carton MOQ: {product.wholesaleMinQty ?? 10} pcs
                  </span>
                </div>
              )}
            </div>

            <div className="text-xs font-semibold pt-1">
              <span className="text-slate-600">Stock Availability: </span>
              <span
                className={
                  product.stockStatus === 'In Stock'
                    ? 'text-emerald-700 font-bold'
                    : product.stockStatus === 'Low Stock'
                    ? 'text-amber-700 font-bold'
                    : 'text-red-700 font-bold'
                }
              >
                {product.stockStatus === 'In Stock'
                  ? t.inStock
                  : product.stockStatus === 'Low Stock'
                  ? t.lowStock
                  : t.outOfStock}
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.productDescription}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'sw' && product.descriptionSw ? product.descriptionSw : product.description}
            </p>
          </div>

          {/* Quantity Selector & WhatsApp Sales Desk Chooser */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="pdp-quantity"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  {t.quantity}
                </label>
                <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    id="pdp-quantity"
                    type="number"
                    min={1}
                    max={999}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!Number.isNaN(val)) {
                        setQuantity(Math.max(1, Math.min(999, val)));
                      }
                    }}
                    disabled={isOutOfStock}
                    className="w-16 text-center text-sm font-bold text-slate-900 font-mono-tabular focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                    disabled={isOutOfStock}
                    aria-label="Increase quantity"
                    className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">{t.subtotal}</p>
                <p className="text-xl font-black text-slate-900 font-mono-tabular">
                  {currency} {(effectivePrice * quantity).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Sales Desk Phone Chooser */}
            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                {t.choosePhone}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { label: 'Desk 1 (Orders)', digits: '255715268391', number: '+255 715 268 391' },
                  { label: 'Desk 2 (Wholesale)', digits: '255624265480', number: '+255 624 265 480' },
                  { label: 'Desk 3 (Support)', digits: '255699032777', number: '+255 699 032 777' },
                ].map((d) => (
                  <button
                    key={d.digits}
                    type="button"
                    onClick={() => setSelectedPhoneDesk(d.digits)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedPhoneDesk === d.digits
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <p className="text-[10px] text-slate-500">{d.label}</p>
                    <p className="font-mono text-xs">{d.number}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Buy and WhatsApp Order Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : justAdded
                    ? 'bg-stone-900 text-white'
                    : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white active:scale-[0.98]'
                }`}
              >
                {isOutOfStock ? (
                  t.outOfStock
                ) : justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t.addedToOrder}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>{t.addToOrder}</span>
                  </>
                )}
              </button>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t.buyViaWhatsApp}</span>
              </a>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {t.specifications}
              </h2>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {product.quire && (
                      <tr className="bg-white">
                        <th className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50 w-2/5">
                          Quire Rating
                        </th>
                        <td className="py-2.5 px-4 text-slate-900 font-bold text-blue-700">
                          {product.quire}
                        </td>
                      </tr>
                    )}
                    {product.pageCount && (
                      <tr className="bg-white">
                        <th className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50 w-2/5">
                          {t.pages}
                        </th>
                        <td className="py-2.5 px-4 text-slate-900 font-medium">
                          {product.pageCount}
                        </td>
                      </tr>
                    )}
                    {product.specifications.map((spec) => (
                      <tr key={spec.label} className="bg-white">
                        <th className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50 w-2/5">
                          {spec.label}
                        </th>
                        <td className="py-2.5 px-4 text-slate-900 font-mono-tabular">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white">
                      <th className="py-2.5 px-4 font-semibold text-slate-600 bg-slate-50 w-2/5">
                        Product SKU
                      </th>
                      <td className="py-2.5 px-4 text-slate-900 font-mono">
                        {product.sku}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {language === 'sw' ? `Bidhaa Nyingine za ${product.category}` : `Related in ${product.category}`}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {language === 'sw' ? 'Madaftari na vifaa vingine vinavyoagizwa mara kwa mara.' : 'Frequently purchased together for schools and offices.'}
              </p>
            </div>
            <Link
              to={`/catalog?category=${encodeURIComponent(product.category)}`}
              className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
            >
              <span>{language === 'sw' ? `Tazama Zote →` : `View All →`}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
