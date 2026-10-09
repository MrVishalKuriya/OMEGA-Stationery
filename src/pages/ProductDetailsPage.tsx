import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  MessageSquare,
  Check,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, storeConfig } = useStore();

  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

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
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
          Product Not Found
        </h1>
        <p className="text-sm text-stone-600">
          The product you are looking for may have been removed or its ID has changed in the demo catalog.
        </p>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="px-5 py-2.5 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Product Catalog</span>
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

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const directWhatsappText = [
    `Hello ${storeConfig.businessName},`,
    `I would like to inquire / order the following item:`,
    `- Product: ${product.name}`,
    `- SKU: ${product.sku}`,
    `- Quantity: ${quantity}`,
    `- Sample Unit Price: ₹${effectivePrice}`,
    `- Estimated Subtotal: ₹${effectivePrice * quantity}`,
  ].join('\n');

  const directWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    directWhatsappText
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <SEOHead
        title={`${product.name} (₹${effectivePrice})`}
        description={product.description}
        product={product}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
        <Link to="/" className="hover:text-stone-900">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/catalog" className="hover:text-stone-900">
          Catalog
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`/catalog?category=${encodeURIComponent(product.category)}`}
          className="hover:text-stone-900"
        >
          {product.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
            {selectedImageIdx < galleryImages.length && !imgError ? (
              <img
                src={galleryImages[selectedImageIdx]}
                alt={`${product.name} - View ${selectedImageIdx + 1}`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Specification Label Preview Card */
              <div className="w-full h-full p-8 bg-stone-50 flex items-center justify-center">
                <div className="w-full max-w-sm border-4 border-red-700 bg-white p-6 space-y-4 shadow-xs">
                  <div className="text-center border-b-2 border-red-700 pb-3">
                    <p className="text-lg font-bold tracking-widest text-red-700 font-serif-display">
                      {storeConfig.logoText}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-800 mt-0.5">
                      {product.category} Specification Sheet
                    </p>
                  </div>
                  <div className="space-y-2 text-xs text-stone-700 font-mono-tabular">
                    <div className="flex justify-between border-b border-stone-200 pb-1">
                      <span className="font-semibold text-red-700">ITEM:</span>
                      <span className="truncate max-w-[200px]">{product.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-1">
                      <span className="font-semibold text-red-700">SKU CODE:</span>
                      <span>{product.sku}</span>
                    </div>
                    {product.specifications.slice(0, 3).map((spec) => (
                      <div
                        key={spec.label}
                        className="flex justify-between border-b border-stone-200 pb-1"
                      >
                        <span className="font-semibold text-red-700 uppercase">
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
                className={`w-20 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-colors ${
                  selectedImageIdx === index
                    ? 'border-red-700'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSelectedImageIdx(galleryImages.length)}
              className={`h-16 px-3 rounded-md border-2 shrink-0 flex flex-col items-center justify-center bg-stone-50 text-[11px] font-semibold transition-colors ${
                selectedImageIdx === galleryImages.length
                  ? 'border-red-700 text-red-700'
                  : 'border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
            >
              <BookOpen className="w-4 h-4 mb-0.5 text-red-700" />
              <span>Label Spec</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
              <span className="font-medium text-stone-700">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">SKU: {product.sku}</span>
              <span aria-hidden="true">·</span>
              <span>Sample Demo Data</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Price & Stock */}
            <div className="pt-2 flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono-tabular">
                  ₹{effectivePrice}
                </span>
                {hasDiscount && (
                  <span className="text-base text-stone-400 line-through font-mono-tabular">
                    ₹{product.price}
                  </span>
                )}
                <span className="text-xs text-stone-500">
                  Inclusive of all taxes (Demo INR Price)
                </span>
              </div>

              <div className="text-xs font-semibold">
                <span>Availability: </span>
                <span
                  className={
                    product.stockStatus === 'In Stock'
                      ? 'text-emerald-700'
                      : product.stockStatus === 'Low Stock'
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }
                >
                  {product.stockStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-stone-900">Product Overview</h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity & Buy Actions */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="pdp-quantity"
                  className="block text-xs font-semibold text-stone-700"
                >
                  Select Quantity
                </label>
                <div className="inline-flex items-center border border-stone-300 rounded-md bg-white">
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
                    max={99}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!Number.isNaN(val)) {
                        setQuantity(Math.max(1, Math.min(99, val)));
                      }
                    }}
                    disabled={isOutOfStock}
                    className="w-14 text-center text-sm font-semibold text-stone-900 font-mono-tabular focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    disabled={isOutOfStock || quantity >= 99}
                    aria-label="Increase quantity"
                    className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-stone-500">Item Subtotal</p>
                <p className="text-lg font-bold text-stone-900 font-mono-tabular">
                  ₹{effectivePrice * quantity}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full px-5 py-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : justAdded
                    ? 'bg-stone-900 text-white'
                    : 'bg-red-700 text-white hover:bg-red-800'
                }`}
              >
                {isOutOfStock ? (
                  'Currently Out of Stock'
                ) : justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Shopping Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isOutOfStock) {
                    addToCart(product.id, quantity);
                  }
                  navigate('/cart');
                }}
                disabled={isOutOfStock}
                className="w-full px-5 py-3 bg-white text-stone-900 border border-stone-300 rounded-md text-sm font-semibold hover:bg-stone-100 transition-colors disabled:opacity-50"
              >
                Buy Now / View Cart
              </button>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2 text-xs text-stone-600">
              <span>Need bulk school packs or have a question?</span>
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-sm font-semibold text-stone-900">
                Specifications &amp; Details
              </h2>
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <tbody className="divide-y divide-stone-200">
                    {product.specifications.map((spec) => (
                      <tr key={spec.label} className="bg-white">
                        <th className="py-2.5 px-4 font-medium text-stone-600 bg-stone-50 w-2/5">
                          {spec.label}
                        </th>
                        <td className="py-2.5 px-4 text-stone-900 font-mono-tabular">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-white">
                      <th className="py-2.5 px-4 font-medium text-stone-600 bg-stone-50 w-2/5">
                        Product SKU
                      </th>
                      <td className="py-2.5 px-4 text-stone-900 font-mono-tabular">
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                Related in {product.category}
              </h2>
              <p className="text-sm text-stone-600 mt-0.5">
                Other stationery items frequently ordered together.
              </p>
            </div>
            <Link
              to={`/catalog?category=${encodeURIComponent(product.category)}`}
              className="text-xs sm:text-sm font-semibold text-red-700 hover:text-red-800"
            >
              View All {product.category} →
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
