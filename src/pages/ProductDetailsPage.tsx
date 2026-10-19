import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  Check,
  CheckCircle2,
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
        {/* Left Column: Gallery with Aardvark 3D Perspective */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[#e2dedb] bg-gradient-to-b from-[#faf9f8] to-[#f4f1ed] shadow-sm flex items-center justify-center p-6 sm:p-8 relative">
            {selectedImageIdx < galleryImages.length && !imgError ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={galleryImages[selectedImageIdx]}
                  alt={`${product.name} - View ${selectedImageIdx + 1}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain filter drop-shadow-md select-none transition-transform duration-500 ease-out hover:scale-105"
                />
              </div>
            ) : (
              /* Specification Label Preview Card */
              <div className="w-full h-full p-6 bg-[#fafafa] flex items-center justify-center">
                <div className="w-full max-w-sm border-2 border-[#4b423b] bg-white p-6 space-y-4 shadow-sm rounded-xl">
                  <div className="text-center border-b-2 border-[#4b423b] pb-3">
                    <p className="text-xl font-bold tracking-widest text-[#4b423b] font-heading">
                      OMEGA NOTEBOOKS
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 mt-0.5">
                      {product.category} Specification Sheet
                    </p>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 font-mono">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="font-semibold text-[#4b423b]">ITEM:</span>
                      <span className="truncate max-w-[200px]">{product.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="font-semibold text-[#4b423b]">SKU:</span>
                      <span>{product.sku}</span>
                    </div>
                    {product.specifications.slice(0, 3).map((spec) => (
                      <div
                        key={spec.label}
                        className="flex justify-between border-b border-slate-100 pb-1"
                      >
                        <span className="font-semibold text-[#4b423b] uppercase">
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
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-white p-1 ${
                  selectedImageIdx === index
                    ? 'border-[#4b423b] ring-2 ring-[#c49b7c] shadow-sm'
                    : 'border-[#e2dedb] hover:border-stone-400'
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
              className={`h-16 px-3 rounded-xl border-2 shrink-0 flex flex-col items-center justify-center bg-[#fafafa] text-[11px] font-bold transition-all ${
                selectedImageIdx === galleryImages.length
                  ? 'border-[#4b423b] text-[#4b423b] ring-2 ring-[#c49b7c]'
                  : 'border-[#e2dedb] text-stone-700 hover:border-stone-400'
              }`}
            >
              <BookOpen className="w-4 h-4 mb-0.5 text-[#4b423b]" />
              <span>Specs Sheet</span>
            </button>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Quantity & WhatsApp Order */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3 border-b border-[#e2dedb] pb-5">
            {/* Heimplanet Technical Metadata */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="heimplanet-tag">[ SPEC // 2026 OFFICIAL ]</span>
              <span className="heimplanet-tag">[ SKU // {product.sku} ]</span>
              {product.quire && (
                <span className="heimplanet-tag text-[#4b423b] font-bold">[ {product.quire} ]</span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              {/* OMEGA Assured Verified Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4b423b]/10 border border-[#4b423b]/20 text-[11px] font-bold text-[#4b423b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F]" />
                <span>OMEGA Assured</span>
              </div>
              <span className="text-xs text-[#6B7280]">·</span>
              <span className="text-xs font-semibold text-[#4b423b]">{product.category}</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#14182B] leading-tight">
              {language === 'sw' && product.nameSw ? product.nameSw : product.name}
            </h1>

            {/* Price & Stock Display */}
            <div className="pt-2 flex flex-wrap items-baseline justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold block">
                  {t.retailPrice}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#4b423b] font-mono">
                    {currency} {effectivePrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-[#6B7280] line-through font-mono">
                      {currency} {product.price.toLocaleString()}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="badge-clear-sale">
                      {Math.round(((product.price - effectivePrice) / product.price) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              {product.wholesalePrice && (
                <div className="text-right p-3 rounded-xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30">
                  <span className="text-[11px] font-bold text-[#2A9D8F] uppercase tracking-wider block">
                    {t.wholesalePrice}
                  </span>
                  <span className="text-base font-black text-[#4b423b] font-mono">
                    {currency} {product.wholesalePrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#6B7280] block mt-0.5">
                    Min Carton MOQ: {product.wholesaleMinQty ?? 10} pcs
                  </span>
                </div>
              )}
            </div>

            <div className="text-xs font-semibold pt-1 flex items-center gap-2">
              <span className="text-[#6B7280]">Stock Status:</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  product.stockStatus === 'In Stock'
                    ? 'bg-[#2A9D8F]/15 text-[#2A9D8F]'
                    : product.stockStatus === 'Low Stock'
                    ? 'bg-[#c49b7c]/20 text-[#4b423b]'
                    : 'bg-[#D64545]/15 text-[#D64545]'
                }`}
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
            <h2 className="text-xs font-bold text-[#4b423b] uppercase tracking-wider">
              {t.productDescription}
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              {language === 'sw' && product.descriptionSw ? product.descriptionSw : product.description}
            </p>
          </div>

          {/* Quantity Selector & WhatsApp Sales Desk Chooser */}
          <div className="bg-[#fafafa] border border-[#e2dedb] rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="pdp-quantity"
                  className="block text-xs font-bold text-[#4b423b] uppercase tracking-wider"
                >
                  {t.quantity}
                </label>
                <div className="inline-flex items-center border border-[#e2dedb] rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-40"
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
                    className="w-16 text-center text-sm font-bold text-[#14182B] font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                    disabled={isOutOfStock}
                    aria-label="Increase quantity"
                    className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-[#6B7280] font-medium">{t.subtotal}</p>
                <p className="text-xl font-black text-[#4b423b] font-mono">
                  {currency} {(effectivePrice * quantity).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Sales Desk Phone Chooser */}
            <div className="pt-2 border-t border-[#e2dedb]/70 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                {t.choosePhone}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { label: 'Co-Founder & MD 1', digits: '255715268391', number: '+255 715 268 391' },
                  { label: 'VIJESH K. HALAI', digits: '255624265480', number: '+255 624 265 480' },
                  { label: 'Mbeya Branch', digits: '255746268391', number: '+255 746 268 391' },
                  { label: 'Mwanza Branch', digits: '255699032777', number: '+255 699 032 777' },
                ].map((d) => (
                  <button
                    key={d.digits}
                    type="button"
                    onClick={() => setSelectedPhoneDesk(d.digits)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedPhoneDesk === d.digits
                        ? 'bg-white border-[#4b423b] ring-2 ring-[#c49b7c] text-[#4b423b] font-bold shadow-xs'
                        : 'bg-white border-[#e2dedb] text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <p className="text-[10px] text-stone-500">{d.label}</p>
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
                className={`w-full py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm aardvark-btn-spring ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : justAdded
                    ? 'bg-[#4b423b] text-white'
                    : 'btn-indra-primary'
                }`}
              >
                {isOutOfStock ? (
                  t.outOfStock
                ) : justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#2A9D8F]" />
                    <span>{t.addedToOrder}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#4b423b]" />
                    <span>{t.addToOrder}</span>
                  </>
                )}
              </button>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-[#2A9D8F] hover:bg-[#238276] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm aardvark-btn-spring"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t.buyViaWhatsApp}</span>
              </a>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-bold text-[#4b423b] uppercase tracking-wider">
                {t.specifications}
              </h2>
              <div className="border border-[#e2dedb] rounded-2xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <tbody className="divide-y divide-[#e2dedb]">
                    {product.quire && (
                      <tr className="bg-white">
                        <th className="py-2.5 px-4 font-semibold text-stone-600 bg-[#fafafa] w-2/5">
                          Quire Rating
                        </th>
                        <td className="py-2.5 px-4 text-[#4b423b] font-bold">
                          {product.quire}
                        </td>
                      </tr>
                    )}
                    {product.pageCount && (
                      <tr className="bg-white">
                        <th className="py-2.5 px-4 font-semibold text-stone-600 bg-[#fafafa] w-2/5">
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
