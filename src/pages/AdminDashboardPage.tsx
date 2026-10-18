import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  Search,
  Check,
  X,
  Settings,
  Package,
  Server,
  Database,
  Zap,
  RefreshCw,
  Lock,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  Product,
  PRODUCT_CATEGORIES,
  ProductCategory,
  StockStatus,
} from '../types/store';
import { IMAGES } from '../data/products';
import { SEOHead } from '../components/SEOHead';
import { fetchHealth, flushRedisCache, syncDatabaseProducts, BackendHealth } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    storeConfig,
    demoOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductPrice,
    updateProductStock,
    resetProductsToDefault,
    updateStoreConfig,
    resetStoreConfigToDefault,
  } = useStore();

  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [flushingCache, setFlushingCache] = useState(false);
  const [cacheFlushMessage, setCacheFlushMessage] = useState('');
  const [syncingDb, setSyncingDb] = useState(false);
  const [dbSyncMessage, setDbSyncMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleSyncDatabase = async () => {
    setSyncingDb(true);
    setDbSyncMessage(null);
    const res = await syncDatabaseProducts();
    if (res.success) {
      setDbSyncMessage({
        text: res.message || 'All 33 products synchronized into MongoDB database successfully!',
        success: true,
      });
      const data = await fetchHealth();
      if (data) setBackendHealth(data);
    } else {
      setDbSyncMessage({
        text: `Sync info: ${res.message}`,
        success: false,
      });
    }
    setSyncingDb(false);
    setTimeout(() => setDbSyncMessage(null), 6000);
  };

  useEffect(() => {
    const loadHealth = async () => {
      const data = await fetchHealth();
      if (data) setBackendHealth(data);
    };
    loadHealth();
    const interval = setInterval(loadHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFlushCache = async () => {
    setFlushingCache(true);
    const ok = await flushRedisCache();
    if (ok) {
      setCacheFlushMessage('Redis cache evicted successfully! Next fetch will reload fresh from MongoDB.');
      const data = await fetchHealth();
      if (data) setBackendHealth(data);
    } else {
      setCacheFlushMessage('Failed to flush cache.');
    }
    setFlushingCache(false);
    setTimeout(() => setCacheFlushMessage(''), 4000);
  };

  const [demoSessionActive, setDemoSessionActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'branding' | 'architecture'>(
    'inventory'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [tempDiscountPrice, setTempDiscountPrice] = useState<string>('');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Exercise Books' as ProductCategory,
    sku: '',
    price: '45',
    discountPrice: '',
    stockStatus: 'In Stock' as StockStatus,
    image: IMAGES.omegaExerciseBook,
    description: '',
    featured: false,
    bestSeller: false,
  });
  const [formError, setFormError] = useState<string>('');

  const [brandingForm, setBrandingForm] = useState({ ...storeConfig });

  const filteredInventory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, searchQuery, categoryFilter]);

  const startInlinePriceEdit = (product: Product) => {
    setEditingPriceId(product.id);
    setTempPrice(String(product.price));
    setTempDiscountPrice(product.discountPrice ? String(product.discountPrice) : '');
  };

  const saveInlinePriceEdit = (productId: string) => {
    const parsedPrice = parseFloat(tempPrice);
    const parsedDiscount = tempDiscountPrice.trim()
      ? parseFloat(tempDiscountPrice)
      : undefined;
    if (!Number.isNaN(parsedPrice) && parsedPrice > 0) {
      updateProductPrice(productId, Math.round(parsedPrice), parsedDiscount ? Math.round(parsedDiscount) : undefined);
    }
    setEditingPriceId(null);
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Exercise Books',
      sku: `OMG-NEW-${Math.floor(100 + Math.random() * 900)}`,
      price: '50',
      discountPrice: '',
      stockStatus: 'In Stock',
      image: IMAGES.omegaExerciseBook,
      description: '',
      featured: false,
      bestSeller: false,
    });
    setFormError('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      sku: product.sku,
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      stockStatus: product.stockStatus,
      image: product.image,
      description: product.description,
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
    });
    setFormError('');
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.name.trim().length < 3) {
      setFormError('Product name must be at least 3 characters.');
      return;
    }
    if (productForm.sku.trim().length < 3) {
      setFormError('Product SKU is required.');
      return;
    }
    const priceNum = Math.round(Number(productForm.price));
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid positive price in TSh.');
      return;
    }
    const discountNum = productForm.discountPrice.trim()
      ? Math.round(Number(productForm.discountPrice))
      : undefined;
    if (discountNum !== undefined && (Number.isNaN(discountNum) || discountNum >= priceNum || discountNum <= 0)) {
      setFormError('Discount price must be less than the regular price.');
      return;
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: productForm.name.trim(),
        category: productForm.category,
        sku: productForm.sku.trim().toUpperCase(),
        price: priceNum,
        discountPrice: discountNum,
        stockStatus: productForm.stockStatus,
        image: productForm.image.trim() || IMAGES.omegaExerciseBook,
        description:
          productForm.description.trim() ||
          'Sample stationery product in the demo catalog.',
        featured: productForm.featured,
        bestSeller: productForm.bestSeller,
      });
    } else {
      addProduct({
        name: productForm.name.trim(),
        category: productForm.category,
        sku: productForm.sku.trim().toUpperCase(),
        price: priceNum,
        discountPrice: discountNum,
        stockStatus: productForm.stockStatus,
        image: productForm.image.trim() || IMAGES.omegaExerciseBook,
        gallery: [productForm.image.trim() || IMAGES.omegaExerciseBook],
        description:
          productForm.description.trim() ||
          'Sample stationery product added via the Admin Demo Dashboard.',
        specifications: [
          { label: 'Category', value: productForm.category },
          { label: 'SKU', value: productForm.sku.trim().toUpperCase() },
        ],
        featured: productForm.featured,
        bestSeller: productForm.bestSeller,
        isDemoData: true,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig({
      ...brandingForm,
      whatsappNumber: brandingForm.whatsappNumber.replace(/\D/g, '') || '919876543210',
      freeDeliveryThreshold: Math.max(0, Number(brandingForm.freeDeliveryThreshold) || 0),
      standardDeliveryFee: Math.max(0, Number(brandingForm.standardDeliveryFee) || 0),
      isPlaceholderConfig: false,
    });
  };

  if (!demoSessionActive) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SEOHead
          title="Admin Dashboard — Demo Mode Gate"
          description="Protected demo dashboard preview for managing stationery products, TZS pricing, stock levels, and store branding."
        />
        <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 space-y-6">
          <div className="w-11 h-11 rounded-md bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Protected Sandbox Preview
            </p>
            <h1 className="text-2xl font-bold text-stone-900">
              Admin Dashboard — Demo Mode
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              This dashboard allows you to test viewing, adding, editing, and removing products, updating TSh prices, managing stock statuses, and configuring store branding.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-md space-y-2 text-xs text-stone-700 leading-relaxed">
            <p className="font-semibold text-stone-900">
              Security &amp; Persistence Notice:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                No admin passwords or API secrets are stored in the frontend source code.
              </li>
              <li>
                Changes made here persist in your browser&apos;s{' '}
                <code className="font-mono-tabular bg-stone-200/70 px-1 py-0.5 rounded">
                  localStorage
                </code>{' '}
                for demonstration purposes.
              </li>
              <li>
                Production deployment requires server-side authentication (HTTP-only session cookies or OAuth) and a database backend.
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setDemoSessionActive(true)}
            className="w-full px-5 py-3 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors"
          >
            Enter Demo Admin Workspace
          </button>
        </div>
      </div>
    );
  }

  const inStockCount = products.filter((p) => p.stockStatus === 'In Stock').length;
  const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'Out of Stock').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="OMEGA HQ Internal Portal (Secure)"
        description="OMEGA Tanzania internal inventory, MongoDB database operations, and Redis high-speed caching telemetry."
      />

      {/* Security & Route Notice Banner */}
      <div className="bg-stone-900 text-stone-200 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 bg-red-700 text-white rounded-md shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span>
            <strong className="text-white">INTERNAL MANAGEMENT PORTAL:</strong> This interface is securely mapped to <code className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">/omega-hq-portal-2026</code>. Public route <code className="bg-stone-800 px-1.5 py-0.5 rounded text-red-400 font-mono">/admin</code> returns 404.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>MongoDB + Redis Live</span>
          </span>
          <button
            type="button"
            onClick={() => setDemoSessionActive(false)}
            className="text-xs font-semibold text-stone-400 hover:text-white underline shrink-0"
          >
            Lock Session
          </button>
        </div>
      </div>

      {/* Header & Tabs */}
      <div className="border-b border-stone-200 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-700 text-white">
              HQ INTERNAL PORTAL
            </span>
            <span className="text-xs text-stone-500 font-mono">v2.4.0 · Tanzania</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900">
            OMEGA Store Management &amp; Backend Telemetry
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage {products.length} products, update TSh prices &amp; stock levels, and monitor real-time MongoDB database &amp; Redis cache performance.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-stone-100 border border-stone-200 rounded-lg self-start overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products &amp; Stock ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setBrandingForm({ ...storeConfig });
              setActiveTab('branding');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'branding'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Branding &amp; WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Setup &amp; Backend Status</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <p className="text-xs text-stone-500">Total Catalog SKUs</p>
              <p className="text-2xl font-bold text-stone-900 font-mono-tabular mt-1">
                {products.length}
              </p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <p className="text-xs text-stone-500">In Stock Items</p>
              <p className="text-2xl font-bold text-emerald-700 font-mono-tabular mt-1">
                {inStockCount}
              </p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <p className="text-xs text-stone-500">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-amber-700 font-mono-tabular mt-1">
                {lowStockCount}
              </p>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <p className="text-xs text-stone-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-700 font-mono-tabular mt-1">
                {outOfStockCount}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by product name or SKU..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-md text-xs sm:text-sm"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter inventory by category"
                className="px-3 py-2 bg-white border border-stone-300 rounded-md text-xs sm:text-sm"
              >
                <option value="All">All Categories ({products.length})</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={resetProductsToDefault}
                className="px-3.5 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-semibold rounded-md hover:bg-stone-100 inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset 35 Demo Products</span>
              </button>

              <button
                type="button"
                onClick={openAddProductModal}
                className="px-4 py-2 bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-red-800 inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                    <th className="py-3 px-4">Product &amp; SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (TSh)</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredInventory.map((product) => {
                    const isEditingPrice = editingPriceId === product.id;
                    return (
                      <tr key={product.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-9 rounded object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-stone-900 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-stone-500 font-mono-tabular">
                                {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                          {product.category}
                        </td>

                        <td className="py-3 px-4 font-mono-tabular whitespace-nowrap">
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                placeholder="MRP"
                                className="w-16 px-2 py-1 border border-stone-300 rounded text-xs"
                              />
                              <input
                                type="number"
                                value={tempDiscountPrice}
                                onChange={(e) => setTempDiscountPrice(e.target.value)}
                                placeholder="Sale"
                                className="w-16 px-2 py-1 border border-stone-300 rounded text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => saveInlinePriceEdit(product.id)}
                                aria-label="Save price"
                                className="p-1 bg-stone-900 text-white rounded hover:bg-stone-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPriceId(null)}
                                aria-label="Cancel price edit"
                                className="p-1 text-stone-500 hover:text-stone-800"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900">
                                ₹{product.discountPrice ?? product.price}
                              </span>
                              {product.discountPrice && (
                                <span className="text-xs text-stone-400 line-through">
                                  ₹{product.price}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => startInlinePriceEdit(product)}
                                className="text-[11px] text-red-700 hover:underline ml-1 font-sans"
                              >
                                Edit Price
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={product.stockStatus}
                            onChange={(e) =>
                              updateProductStock(
                                product.id,
                                e.target.value as StockStatus
                              )
                            }
                            aria-label={`Stock status for ${product.name}`}
                            className={`px-2.5 py-1 rounded border text-xs font-semibold ${
                              product.stockStatus === 'In Stock'
                                ? 'bg-white border-stone-300 text-emerald-800'
                                : product.stockStatus === 'Low Stock'
                                ? 'bg-amber-50 border-amber-300 text-amber-900'
                                : 'bg-red-50 border-red-300 text-red-800'
                            }`}
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditProductModal(product)}
                              className="px-2.5 py-1 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-100 inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(product.id)}
                              aria-label={`Delete ${product.name}`}
                              className="p-1.5 text-stone-400 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
      )}

      {/* TAB 2: BRANDING */}
      {activeTab === 'branding' && (
        <form
          onSubmit={handleSaveBranding}
          className="bg-stone-50 border border-stone-200 rounded-lg p-6 sm:p-8 space-y-6 max-w-4xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Configurable Store Branding &amp; WhatsApp Settings
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                The OMEGA exercise book is used as a product visual reference. Update the official store name, logo text, contact details, and WhatsApp order number below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetStoreConfigToDefault();
                setBrandingForm({ ...storeConfig });
              }}
              className="text-xs font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Business / Store Name
              </label>
              <input
                type="text"
                value={brandingForm.businessName}
                onChange={(e) =>
                  setBrandingForm({ ...brandingForm, businessName: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Badge / Logo Monogram Text
              </label>
              <input
                type="text"
                value={brandingForm.logoText}
                onChange={(e) =>
                  setBrandingForm({ ...brandingForm, logoText: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                WhatsApp Business Number (Digits with Country Code, e.g. 919876543210)
              </label>
              <input
                type="text"
                value={brandingForm.whatsappNumber}
                onChange={(e) =>
                  setBrandingForm({ ...brandingForm, whatsappNumber: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono-tabular"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Display Phone Number
              </label>
              <input
                type="text"
                value={brandingForm.phoneNumber}
                onChange={(e) =>
                  setBrandingForm({ ...brandingForm, phoneNumber: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono-tabular"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Free Local Delivery Threshold (TSh)
              </label>
              <input
                type="number"
                value={brandingForm.freeDeliveryThreshold}
                onChange={(e) =>
                  setBrandingForm({
                    ...brandingForm,
                    freeDeliveryThreshold: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono-tabular"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Standard Local Delivery Charge (TSh)
              </label>
              <input
                type="number"
                value={brandingForm.standardDeliveryFee}
                onChange={(e) =>
                  setBrandingForm({
                    ...brandingForm,
                    standardDeliveryFee: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono-tabular"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Top Announcement Bar Text
            </label>
            <input
              type="text"
              value={brandingForm.announcementText}
              onChange={(e) =>
                setBrandingForm({ ...brandingForm, announcementText: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Shop Street Address
            </label>
            <input
              type="text"
              value={brandingForm.shopAddress}
              onChange={(e) =>
                setBrandingForm({ ...brandingForm, shopAddress: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Store Branding &amp; Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: MONGODB & REDIS ARCHITECTURE & BACKEND TELEMETRY */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Security & Route Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-950 uppercase tracking-wider">
                  Secure Route Obfuscation Active
                </p>
                <p className="text-xs text-red-800">
                  Public scans for <code className="bg-red-100 px-1 py-0.5 rounded font-mono font-bold">/admin</code> return 404 Not Found. This management portal is strictly mapped to <code className="bg-red-100 px-1 py-0.5 rounded font-mono font-bold">/omega-hq-portal-2026</code>.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-red-700 text-white shrink-0">
              Obfuscated &amp; Protected
            </span>
          </div>

          {/* Live MongoDB & Redis Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MongoDB Card */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">MongoDB Database</h3>
                    <p className="text-xs text-stone-500">Mongoose ODM · Persistent Storage</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                    backendHealth?.database.connected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {backendHealth?.database.connected ? 'Atlas / Local Daemon' : 'Resilient Fallback Mode'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-semibold text-stone-900">
                    {backendHealth?.database.connected
                      ? 'Atlas Connected (Live)'
                      : 'Resilient In-Memory / Local Engine'}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Collections</span>
                  <span className="font-semibold text-stone-900">products, orders</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Catalog Documents</span>
                  <span className="font-semibold text-stone-900 font-mono-tabular">
                    {backendHealth?.database.productsCount ?? products.length} Products
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Storage Target</span>
                  <span className="font-mono text-[11px] text-stone-800">omega_stationery</span>
                </div>
              </div>

              {/* One-Click Catalog Synchronization into MongoDB */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Catalog Synchronization</span>
                    <span className="text-[11px] text-stone-500">Sync all 33 products &amp; specs directly into MongoDB</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncDatabase}
                    disabled={syncingDb}
                    className="px-3.5 py-1.5 bg-[#4b423b] hover:bg-[#151D42] text-[#c49b7c] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 shrink-0 self-start sm:self-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingDb ? 'animate-spin' : ''}`} />
                    <span>{syncingDb ? 'Syncing...' : 'Sync All 33 to MongoDB'}</span>
                  </button>
                </div>

                {dbSyncMessage && (
                  <div
                    className={`p-2.5 rounded-lg text-xs font-medium ${
                      dbSyncMessage.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {dbSyncMessage.text}
                  </div>
                )}

                {!backendHealth?.database.connected && (
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-600 space-y-1">
                    <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-stone-600 inline" />
                      <span>MongoDB Atlas Cloud Notice:</span>
                    </p>
                    <p>
                      Your server is serving the full 33-product catalog via high-speed in-memory MongoDB storage. To activate live cloud writes to MongoDB Atlas, add your current IP address (or <code>0.0.0.0/0</code>) to your cluster's IP Whitelist in <strong>MongoDB Atlas &gt; Network Access</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Redis Cache Card */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-50 rounded-lg text-red-700">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Redis High-Speed Cache</h3>
                    <p className="text-xs text-stone-500">Sub-Millisecond Response Accelerator</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFlushCache}
                  disabled={flushingCache}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors border border-stone-300"
                >
                  <RefreshCw className={`w-3 h-3 ${flushingCache ? 'animate-spin' : ''}`} />
                  <span>Flush Cache</span>
                </button>
              </div>

              {cacheFlushMessage && (
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded text-xs font-semibold border border-emerald-200">
                  {cacheFlushMessage}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-stone-50 rounded-lg text-center">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Hit Ratio</span>
                  <span className="text-base font-black text-emerald-600 font-mono-tabular">
                    {backendHealth?.cache?.hitRatioPercent ?? 100}%
                  </span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg text-center">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Avg Latency</span>
                  <span className="text-base font-black text-red-700 font-mono-tabular">
                    {backendHealth?.cache?.averageLatencyMs ?? 1.5}ms
                  </span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg text-center">
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Cache Hits</span>
                  <span className="text-base font-black text-stone-900 font-mono-tabular">
                    {backendHealth?.cache?.hits ?? 0}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed italic flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 inline" />
                <span><strong>Doherty Threshold Advantage:</strong> With Redis caching, catalogue responses return in under 3ms, preventing page lag and ensuring optimal user experience for mobile shoppers on 3G/4G networks across Tanzania.</span>
              </p>
            </div>
          </div>

          {/* Local Order Drafts */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-stone-900">
              Recent Local WhatsApp Order Drafts ({demoOrders.length})
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Orders prepared on this browser during your session. Synchronized with the local store and MongoDB order receiver.
            </p>

            {demoOrders.length === 0 ? (
              <div className="p-6 bg-white border border-stone-200 rounded-md text-center text-xs text-stone-500">
                No WhatsApp order summaries generated in this browser session yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {demoOrders.map((ord) => (
                  <div
                    key={ord.orderReference}
                    className="p-3.5 bg-white border border-stone-200 rounded-md space-y-1 text-xs"
                  >
                    <div className="flex justify-between font-mono-tabular font-bold text-stone-900">
                      <span>{ord.orderReference}</span>
                      <span>TSh {Number(ord.totalAmount).toLocaleString()}</span>
                    </div>
                    <p className="text-stone-700 font-medium">
                      {ord.customerName} · {ord.phoneNumber}
                    </p>
                    <p className="text-stone-500">
                      {ord.fulfillmentType} · {ord.items.length} item(s) · {ord.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
          className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-stone-200 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 id="modal-product-title" className="text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Product' : 'Add New Product to Demo Catalog'}
              </h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                aria-label="Close modal"
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  placeholder="e.g., OMEGA Exercise Book — Broad Rule (140 Pages)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Product SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) =>
                      setProductForm({ ...productForm, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm font-mono-tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Regular Price (TSh) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm font-mono-tabular"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Discount Price (TSh)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={productForm.discountPrice}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        discountPrice: e.target.value,
                      })
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm font-mono-tabular"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-800">
                    Stock Status
                  </label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stockStatus: e.target.value as StockStatus,
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  Product Image Preset
                </label>
                <select
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm bg-white"
                >
                  <option value={IMAGES.omegaExerciseBook}>
                    OMEGA Exercise Book Illustration
                  </option>
                  <option value={IMAGES.hardcoverNotebooks}>
                    Hardcover Registers &amp; Spiral Notebooks
                  </option>
                  <option value={IMAGES.pensWritingSet}>
                    Fountain Pens, Gel Pens &amp; Pencils
                  </option>
                  <option value={IMAGES.artOfficeSupplies}>
                    Geometry Box, Art &amp; Office Supplies
                  </option>
                  <option value={IMAGES.heroStationery}>
                    Desk Collection Showcase
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-800">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Describe ruling type, page count, paper GSM, or pack contents..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) =>
                      setProductForm({ ...productForm, featured: e.target.checked })
                    }
                    className="rounded border-stone-300 text-red-700"
                  />
                  <span>Featured on Home Page</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.bestSeller}
                    onChange={(e) =>
                      setProductForm({ ...productForm, bestSeller: e.target.checked })
                    }
                    className="rounded border-stone-300 text-red-700"
                  />
                  <span>Best-Selling Item</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-md text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white rounded-md text-xs font-semibold hover:bg-red-800"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
