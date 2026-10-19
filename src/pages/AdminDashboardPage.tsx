import React, { useState, useMemo, useEffect } from 'react';
import {
  Package,
  Layers,
  Settings,
  Server,
  Database,
  Zap,
  RefreshCw,
  Search,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  Check,
  X,
  Lock,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Phone,
  MapPin,
  MessageCircle,
  FileText,
  CheckCircle2,
  Clock,
  Truck,
  Copy,
  Sparkles,
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Filter,
  CheckSquare,
  Square,
  Percent,
  Sliders,
  Globe,
  Send,
  Eye,
  BarChart3,
  Boxes,
  ArrowUpDown,
  Tag,
  Barcode,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  Upload,
  ShieldAlert,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  Product,
  PRODUCT_CATEGORIES,
  ProductCategory,
  StockStatus,
  formatPrice,
} from '../types/store';
import { IMAGES, INITIAL_STORE_CONFIG } from '../data/products';
import { SEOHead } from '../components/SEOHead';
import {
  fetchHealth,
  flushRedisCache,
  syncDatabaseProducts,
  BackendHealth,
  fetchLiveOrders,
  updateOrderStatusInDb,
  deleteOrderFromDb,
  saveStoreConfigToDb,
  uploadProductImage,
  testLiveCacheBenchmark,
  reconnectRedisServer,
} from '../services/api';

// Official OMEGA Factory Product Photography Assets for 1-Click Preset Selection
const OMEGA_IMAGE_PRESETS = [
  { label: 'Counter Book Q2 (192P)', path: '/omega-products/counter-book-q2-192p.jpeg', category: 'Counter Books' },
  { label: 'Counter Book Q3 (288P)', path: '/omega-products/counter-book-q3-288p.jpeg', category: 'Counter Books' },
  { label: 'Counter Book Q4 (384P)', path: '/omega-products/counter-book-q4-384p.jpeg', category: 'Counter Books' },
  { label: 'Exercise Book 200P Purple', path: '/omega-products/exercise-book-200p-purple.jpeg', category: 'Exercise Books' },
  { label: 'Exercise Book 100P Pink', path: '/omega-products/exercise-book-100p-pink.jpeg', category: 'Exercise Books' },
  { label: 'Exercise Book 80P Yellow', path: '/omega-products/exercise-book-80p-yellow.jpeg', category: 'Exercise Books' },
  { label: 'Exercise Book 32P Kraft', path: '/omega-products/exercise-book-32p-kraft.jpeg', category: 'Exercise Books' },
  { label: 'Oxford Mathematical Set', path: '/omega-products/oxford-mathematical-set.jpeg', category: 'Mathematical Sets' },
  { label: 'OMEGA PVC Spring File', path: '/omega-products/omega-pvc-spring-file.jpeg', category: 'Files & Folders' },
  { label: 'Manila File Folder Flat', path: '/omega-products/manila-file-folder-flat.jpeg', category: 'Files & Folders' },
  { label: 'Heavy Kraft Bahasha A4', path: '/omega-products/bahasha-a4-envelope.jpeg', category: 'Envelopes (Bahasha)' },
  { label: 'Heavy Kraft Bahasha A3', path: '/omega-products/bahasha-a3-envelope.jpeg', category: 'Envelopes (Bahasha)' },
  { label: 'Ruled Paper Ream Pack', path: '/omega-products/ruled-paper-ream-tall.jpeg', category: 'Examination Paper' },
  { label: 'OMEGA Carton Box Branded', path: '/omega-products/omega-carton-box-branded.jpeg', category: 'Wholesale Bundles' },
  { label: 'Stiff Cover 200P Register', path: '/omega-products/stiff-cover-200p-black.jpeg', category: 'Drawing & Registers' },
  { label: 'Shorthand Notebook Spiral', path: '/omega-products/omega-shorthand-notebook.jpeg', category: 'Notepads & Shorthand' },
];

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
    reloadCatalogFromDb,
    reloadConfigFromDb,
    bulkUpdateProducts,
    showToast,
  } = useStore();

  const currency = storeConfig.currencySymbol || 'TSh';

  // Backend Health & Cloud Telemetry State
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [flushingCache, setFlushingCache] = useState(false);
  const [cacheFlushMessage, setCacheFlushMessage] = useState('');
  const [testingCacheBenchmark, setTestingCacheBenchmark] = useState(false);
  const [cacheBenchmarkResult, setCacheBenchmarkResult] = useState<any | null>(null);
  const [reconnectingRedis, setReconnectingRedis] = useState(false);
  const [redisReconnectMsg, setRedisReconnectMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [syncingDb, setSyncingDb] = useState(false);
  const [dbSyncMessage, setDbSyncMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [isReloadingCatalog, setIsReloadingCatalog] = useState(false);

  // Tabs: inventory | orders | cms_handles | architecture
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'cms_handles' | 'architecture'>('inventory');

  // Search, Filters & Sorting for ERP Inventory
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<
    'default' | 'price-asc' | 'price-desc' | 'wholesale-desc' | 'margin-desc' | 'stock-asc' | 'stock-desc' | 'title-asc'
  >('default');

  // ERP Multi-Selection State for Bulk Operations
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkAdjustmentPercent, setBulkAdjustmentPercent] = useState<string>('5');
  const [isBulkAdjusting, setIsBulkAdjusting] = useState<boolean>(false);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState<ProductCategory>('Counter Books');

  // In-Table Direct Row Quick-Edit Mode
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [tempDiscountPrice, setTempDiscountPrice] = useState<string>('');
  const [tempWholesalePrice, setTempWholesalePrice] = useState<string>('');
  const [tempStockStatus, setTempStockStatus] = useState<StockStatus>('In Stock');
  const [tempStockQuantity, setTempStockQuantity] = useState<string>('100');

  // Add / Edit / Clone Master Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'clone'>('add');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'info' | 'pricing' | 'specs' | 'stock' | 'media'>('info');

  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Counter Books' as ProductCategory,
    sku: '',
    barcode: '',
    price: '56000',
    discountPrice: '52000',
    wholesalePrice: '38000',
    wholesaleMinQty: '48',
    packaging: '48 Pcs / Strapped Corrugated Box',
    quire: '2 Quire',
    pageCount: '192 Pages',
    rulingType: 'Single Line Ruled',
    paperQuality: '70 GSM Bleed-Proof Woodfree Paper',
    bindingType: 'Hardcover Smyth-Sewn Thread Bound',
    dispatchTime: 'Same-Day Factory Dispatch',
    stockStatus: 'In Stock' as StockStatus,
    stockQuantity: '150',
    image: '/omega-products/counter-book-q2-192p.jpeg',
    description: 'Premier Tanzanian heavy-duty book manufactured by OMEGA Indigo Printer · Mbeya.',
    featured: false,
    bestSeller: false,
    freeDelivery: true,
  });
  const [formError, setFormError] = useState<string>('');
  const [dbSaveSuccessMessage, setDbSaveSuccessMessage] = useState<string | null>(null);

  // Image Upload State & Local Storage Pipeline
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState<string | null>(null);
  const [uploadErrorNotice, setUploadErrorNotice] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  const handleImageFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadErrorNotice('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadErrorNotice('File is too large. Image size must be under 25MB.');
      return;
    }

    setIsUploadingImage(true);
    setUploadErrorNotice(null);
    setUploadSuccessNotice(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        if (!base64Data) {
          setIsUploadingImage(false);
          setUploadErrorNotice('Failed to read image data.');
          return;
        }

        const res = await uploadProductImage(base64Data, file.name);
        setIsUploadingImage(false);

        if (res.success && res.url) {
          setProductForm((prev) => ({ ...prev, image: res.url! }));
          setUploadSuccessNotice(`Image saved to server: ${res.url}`);
          showToast('Image uploaded successfully to server!');
          setTimeout(() => setUploadSuccessNotice(null), 5000);
        } else {
          // If server endpoint has an issue, assign high-quality DataURI directly to product record in MongoDB
          setProductForm((prev) => ({ ...prev, image: base64Data }));
          setUploadSuccessNotice('Image attached directly to product!');
          showToast('Image attached to product record!');
          setTimeout(() => setUploadSuccessNotice(null), 5000);
        }
      };
      reader.onerror = () => {
        setIsUploadingImage(false);
        setUploadErrorNotice('Failed to read file from disk.');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingImage(false);
      setUploadErrorNotice(err?.message || 'Upload failed.');
    }
  };

  // Quick Product Inspection Drawer
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // Web Content & Store Handles CMS State
  const [brandingForm, setBrandingForm] = useState({ ...storeConfig });
  const [brandingSaved, setBrandingSaved] = useState(false);
  const [cmsActiveSubTab, setCmsActiveSubTab] = useState<'identity' | 'hero' | 'contacts' | 'about' | 'logistics'>('identity');

  // Live Orders state from MongoDB API & local demo
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState<'all' | 'wholesale' | 'retail' | 'dispatched'>('all');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [tempTrackingNumber, setTempTrackingNumber] = useState<string>('');
  const [tempAdminNotes, setTempAdminNotes] = useState<string>('');

  // Backend Health poll
  useEffect(() => {
    let isMounted = true;
    const loadHealth = async () => {
      const data = await fetchHealth();
      if (isMounted && data) setBackendHealth(data);
    };
    loadHealth();
    const interval = setInterval(loadHealth, 7000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch live orders directly from MongoDB
  const loadLiveOrders = async () => {
    const ords = await fetchLiveOrders();
    if (ords && Array.isArray(ords)) {
      setLiveOrders(ords);
    }
  };

  useEffect(() => {
    loadLiveOrders();
  }, []);

  // Sync StoreConfig state to branding form whenever storeConfig changes
  useEffect(() => {
    setBrandingForm({ ...storeConfig });
  }, [storeConfig]);

  // Synchronize Database Handler
  const handleSyncDatabase = async () => {
    setSyncingDb(true);
    setDbSyncMessage(null);
    const res = await syncDatabaseProducts();
    if (res.success) {
      setDbSyncMessage({
        text: res.message || 'All official catalog products synchronized to MongoDB Atlas successfully!',
        success: true,
      });
      await reloadCatalogFromDb();
      const data = await fetchHealth();
      if (data) setBackendHealth(data);
    } else {
      setDbSyncMessage({
        text: `Sync note: ${res.message}`,
        success: false,
      });
    }
    setSyncingDb(false);
    setTimeout(() => setDbSyncMessage(null), 6000);
  };

  // Reload Catalog from DB Handler
  const handleReloadCatalog = async () => {
    setIsReloadingCatalog(true);
    await reloadCatalogFromDb();
    setIsReloadingCatalog(false);
  };

  // Flush Cache Handler
  const handleFlushCache = async () => {
    setFlushingCache(true);
    const res = await flushRedisCache();
    if (res.success) {
      setCacheFlushMessage(res.message || 'In-Memory & Redis cache flushed! Next query will hit MongoDB fresh.');
      const data = await fetchHealth();
      if (data) setBackendHealth(data);
      showToast('Cache flushed successfully');
    } else {
      setCacheFlushMessage(res.message || 'Failed to flush cache.');
    }
    setFlushingCache(false);
    setTimeout(() => setCacheFlushMessage(''), 4500);
  };

  // Live Cache Benchmark Handler
  const handleTestCacheBenchmark = async () => {
    setTestingCacheBenchmark(true);
    setCacheBenchmarkResult(null);
    const res = await testLiveCacheBenchmark();
    setTestingCacheBenchmark(false);
    if (res.success && res.data) {
      setCacheBenchmarkResult(res.data);
      showToast(`⚡ Live Edge Cache Benchmark passed! Latency: ${res.data.latencyMs}ms`);
      const data = await fetchHealth();
      if (data) setBackendHealth(data);
    } else {
      showToast(`Notice: ${res.message || 'Benchmark failed'}`);
    }
  };

  // On-Demand Redis Reconnect Handler
  const handleReconnectRedis = async () => {
    setReconnectingRedis(true);
    setRedisReconnectMsg(null);
    const res = await reconnectRedisServer();
    setReconnectingRedis(false);
    setRedisReconnectMsg({
      text: res.message,
      success: !!res.connected,
    });
    const data = await fetchHealth();
    if (data) setBackendHealth(data);
    if (res.connected) {
      showToast('Redis Server connected successfully!');
    } else {
      showToast('Redis offline. High-Speed Memory Cache actively handling requests.');
    }
    setTimeout(() => setRedisReconnectMsg(null), 6000);
  };

  // ERP Inventory Valuation Computations
  const totalUnitsOnHand = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + (p.stockQuantity !== undefined ? p.stockQuantity : 100),
      0
    );
  }, [products]);

  const totalRetailValuation = useMemo(() => {
    return products.reduce((acc, p) => {
      const qty = p.stockQuantity !== undefined ? p.stockQuantity : 100;
      return acc + p.price * qty;
    }, 0);
  }, [products]);

  const totalWholesaleValuation = useMemo(() => {
    return products.reduce((acc, p) => {
      const qty = p.stockQuantity !== undefined ? p.stockQuantity : 100;
      const wPrice = p.wholesalePrice || Math.round(p.price * 0.7);
      return acc + wPrice * qty;
    }, 0);
  }, [products]);

  const inStockCount = products.filter((p) => p.stockStatus === 'In Stock').length;
  const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'Out of Stock').length;
  const featuredCount = products.filter((p) => p.featured || p.bestSeller).length;

  // Filtered & Sorted Inventory
  const filteredInventory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (stockStatusFilter !== 'All' && p.stockStatus !== stockStatusFilter) return false;
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.toLowerCase().includes(q)) ||
          (p.packaging && p.packaging.toLowerCase().includes(q))
        );
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      const aWholesale = a.wholesalePrice || Math.round(a.price * 0.7);
      const bWholesale = b.wholesalePrice || Math.round(b.price * 0.7);
      const aQty = a.stockQuantity !== undefined ? a.stockQuantity : 100;
      const bQty = b.stockQuantity !== undefined ? b.stockQuantity : 100;

      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'wholesale-desc':
          return bWholesale - aWholesale;
        case 'margin-desc': {
          const aMargin = (a.price - aWholesale) / a.price;
          const bMargin = (b.price - bWholesale) / b.price;
          return bMargin - aMargin;
        }
        case 'stock-asc':
          return aQty - bQty;
        case 'stock-desc':
          return bQty - aQty;
        case 'title-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [products, searchQuery, categoryFilter, stockStatusFilter, sortBy]);

  // Multi-select helpers
  const handleToggleSelectAll = () => {
    if (selectedProductIds.length === filteredInventory.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredInventory.map((p) => p.id));
    }
  };

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ERP Bulk Operations
  const handleBulkPriceAdjustment = async (isIncrease: boolean) => {
    const percentNum = parseFloat(bulkAdjustmentPercent);
    if (Number.isNaN(percentNum) || percentNum === 0) {
      showToast('Please enter a valid percentage adjustment.');
      return;
    }
    const finalPercent = isIncrease ? Math.abs(percentNum) : -Math.abs(percentNum);

    setIsBulkAdjusting(true);
    const ok = await bulkUpdateProducts({
      action: 'adjust_price',
      ids: selectedProductIds.length > 0 ? selectedProductIds : undefined,
      percentage: finalPercent,
    });
    setIsBulkAdjusting(false);
    if (ok) {
      setSelectedProductIds([]);
    }
  };

  const handleBulkStockStatusChange = async (newStockStatus: string) => {
    if (selectedProductIds.length === 0) {
      showToast('Please select at least one product.');
      return;
    }
    setIsBulkAdjusting(true);
    const ok = await bulkUpdateProducts({
      action: 'set_stock',
      ids: selectedProductIds,
      stockStatus: newStockStatus,
    });
    setIsBulkAdjusting(false);
    if (ok) {
      setSelectedProductIds([]);
    }
  };

  // Export CSV Spreadsheet
  const handleExportCSV = () => {
    const itemsToExport =
      selectedProductIds.length > 0
        ? products.filter((p) => selectedProductIds.includes(p.id))
        : filteredInventory;

    const headers = [
      'SKU',
      'Barcode EAN-13',
      'Product Title',
      'Category',
      'Retail MSRP (TSh)',
      'Promotional Price (TSh)',
      'Wholesale Unit Price (TSh)',
      'Min Wholesale Carton Qty',
      'Carton Case Value (TSh)',
      'Gross Dealer Margin (%)',
      'Warehouse Stock Units',
      'Stock Status',
      'Packaging Specification',
      'Quire',
      'Page Count',
      'Lead Time',
    ];

    const rows = itemsToExport.map((p) => {
      const wholesaleP = p.wholesalePrice || Math.round(p.price * 0.7);
      const minQty = p.wholesaleMinQty || 48;
      const margin = Math.round(((p.price - wholesaleP) / p.price) * 100);
      const cartonTotal = wholesaleP * minQty;

      return [
        `"${p.sku}"`,
        `"${p.barcode || ''}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.price,
        p.discountPrice || '',
        wholesaleP,
        minQty,
        cartonTotal,
        `${margin}%`,
        p.stockQuantity !== undefined ? p.stockQuantity : 100,
        `"${p.stockStatus}"`,
        `"${p.packaging || ''}"`,
        `"${p.quire || ''}"`,
        `"${p.pageCount || ''}"`,
        `"${p.dispatchTime || 'Same-day'}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `OMEGA_Master_ERP_Inventory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${itemsToExport.length} products to master ERP CSV spreadsheet.`);
  };

  // In-Table Direct Row Quick-Edit Handlers
  const startRowEdit = (product: Product) => {
    setEditingRowId(product.id);
    setTempPrice(String(product.price));
    setTempDiscountPrice(product.discountPrice ? String(product.discountPrice) : '');
    setTempWholesalePrice(
      product.wholesalePrice
        ? String(product.wholesalePrice)
        : String(Math.round(product.price * 0.7))
    );
    setTempStockStatus(product.stockStatus);
    setTempStockQuantity(
      product.stockQuantity !== undefined ? String(product.stockQuantity) : '100'
    );
  };

  const saveRowEdit = (productId: string) => {
    const parsedPrice = parseFloat(tempPrice);
    const parsedDiscount = tempDiscountPrice.trim() ? parseFloat(tempDiscountPrice) : undefined;
    const parsedWholesale = tempWholesalePrice.trim() ? parseFloat(tempWholesalePrice) : undefined;
    const parsedStockQty = tempStockQuantity.trim() ? parseInt(tempStockQuantity, 10) : 100;

    if (!Number.isNaN(parsedPrice) && parsedPrice > 0) {
      updateProductPrice(
        productId,
        Math.round(parsedPrice),
        parsedDiscount ? Math.round(parsedDiscount) : undefined,
        parsedWholesale ? Math.round(parsedWholesale) : undefined
      );
      updateProductStock(productId, tempStockStatus, parsedStockQty);
    }
    setEditingRowId(null);
  };

  // Automatic Generators for SKU and Barcode
  const generateSkuCode = (category: string, quire?: string, pageCount?: string): string => {
    const catCodeMap: Record<string, string> = {
      'Counter Books': 'CB',
      'Exercise Books': 'EX',
      'Envelopes (Bahasha)': 'BH',
      'Files & Folders': 'FL',
      'Examination Paper': 'EXAM',
      'Mathematical Sets': 'MTH',
      'Notepads & Shorthand': 'PAD',
      'Drawing & Registers': 'REG',
      'Office Stationery': 'OFF',
      'Wholesale Bundles': 'BNDL',
    };
    const prefix = catCodeMap[category] || 'GEN';
    const quirePart = quire && quire !== 'N/A' ? `-${quire.replace(/\s+/g, '').toUpperCase()}` : '';
    const pagesPart = pageCount ? `-${pageCount.replace(/\D/g, '')}P` : '';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `OMG-${prefix}${quirePart}${pagesPart}-${rand}`;
  };

  const generateEan13Barcode = (): string => {
    // 616: Tanzania GS1 prefix + 400: OMEGA Indigo Printer manufacturer code + 6 random digits
    const prefix = '616400';
    let body = '';
    for (let i = 0; i < 6; i++) {
      body += Math.floor(Math.random() * 10);
    }
    const base12 = prefix + body;
    // Calculate EAN-13 check digit
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(base12[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return base12 + checkDigit;
  };

  // Add / Edit / Clone Master Product Modal Handlers
  const openAddProductModal = () => {
    setModalMode('add');
    setEditingProductId(null);
    setModalActiveTab('info');
    const autoSku = generateSkuCode('Counter Books', '2 Quire', '192 Pages');
    const autoBarcode = generateEan13Barcode();

    setProductForm({
      name: '',
      category: 'Counter Books',
      sku: autoSku,
      barcode: autoBarcode,
      price: '56000',
      discountPrice: '52000',
      wholesalePrice: '38000',
      wholesaleMinQty: '48',
      packaging: '48 Pcs / Strapped Corrugated Box',
      quire: '2 Quire',
      pageCount: '192 Pages',
      rulingType: 'Single Line Ruled',
      paperQuality: '70 GSM Bleed-Proof Woodfree Paper',
      bindingType: 'Hardcover Smyth-Sewn Thread Bound',
      dispatchTime: 'Same-Day Factory Dispatch',
      stockStatus: 'In Stock',
      stockQuantity: '150',
      image: '/omega-products/counter-book-q2-192p.jpeg',
      description: 'Manufactured by OMEGA Indigo Printer · SIDO Viwandani, Mbeya, Tanzania.',
      featured: false,
      bestSeller: false,
      freeDelivery: true,
    });
    setFormError('');
    setDbSaveSuccessMessage(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setModalMode('edit');
    setEditingProductId(product.id);
    setModalActiveTab('info');

    // Extract specs if stored in specifications array
    const rulingSpec = product.specifications?.find((s) => s.label === 'Ruling')?.value;
    const gsmSpec = product.specifications?.find((s) => s.label === 'Paper Quality')?.value;
    const bindingSpec = product.specifications?.find((s) => s.label === 'Binding')?.value;

    setProductForm({
      name: product.name,
      category: product.category,
      sku: product.sku,
      barcode: product.barcode || generateEan13Barcode(),
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      wholesalePrice: product.wholesalePrice
        ? String(product.wholesalePrice)
        : String(Math.round(product.price * 0.7)),
      wholesaleMinQty: product.wholesaleMinQty ? String(product.wholesaleMinQty) : '48',
      packaging: product.packaging || '48 Pcs / Strapped Box',
      quire: product.quire || '2 Quire',
      pageCount: product.pageCount || '192 Pages',
      rulingType: rulingSpec || 'Single Line Ruled',
      paperQuality: gsmSpec || '70 GSM Bleed-Proof Woodfree Paper',
      bindingType: bindingSpec || 'Hardcover Smyth-Sewn Thread Bound',
      dispatchTime: product.dispatchTime || 'Same-Day Factory Dispatch',
      stockStatus: product.stockStatus,
      stockQuantity: product.stockQuantity !== undefined ? String(product.stockQuantity) : '150',
      image: product.image,
      description: product.description || '',
      featured: !!product.featured,
      bestSeller: !!product.bestSeller,
      freeDelivery: product.freeDelivery !== false,
    });
    setFormError('');
    setDbSaveSuccessMessage(null);
    setIsProductModalOpen(true);
  };

  // ERP Product Duplication / Variant Cloning
  const handleCloneProduct = (product: Product) => {
    setModalMode('clone');
    setEditingProductId(null);
    setModalActiveTab('info');
    const autoSku = `${product.sku}-V2`;
    const autoBarcode = generateEan13Barcode();

    setProductForm({
      name: `${product.name} (Variant)`,
      category: product.category,
      sku: autoSku,
      barcode: autoBarcode,
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      wholesalePrice: product.wholesalePrice
        ? String(product.wholesalePrice)
        : String(Math.round(product.price * 0.7)),
      wholesaleMinQty: product.wholesaleMinQty ? String(product.wholesaleMinQty) : '48',
      packaging: product.packaging || '48 Pcs / Strapped Box',
      quire: product.quire || '2 Quire',
      pageCount: product.pageCount || '192 Pages',
      rulingType: 'Single Line Ruled',
      paperQuality: '70 GSM Bleed-Proof Woodfree Paper',
      bindingType: 'Hardcover Smyth-Sewn Thread Bound',
      dispatchTime: product.dispatchTime || 'Same-Day Factory Dispatch',
      stockStatus: 'In Stock',
      stockQuantity: '100',
      image: product.image,
      description: product.description || '',
      featured: false,
      bestSeller: false,
      freeDelivery: true,
    });
    setFormError('');
    setDbSaveSuccessMessage(null);
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setFormError('Product title is required.');
      return;
    }
    if (!productForm.sku.trim()) {
      setFormError('SKU code is required.');
      return;
    }
    const priceNum = Math.round(Number(productForm.price));
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid retail price in Tanzanian Shillings (TSh).');
      return;
    }

    const discountNum = productForm.discountPrice.trim()
      ? Math.round(Number(productForm.discountPrice))
      : undefined;

    const wholesaleNum = productForm.wholesalePrice.trim()
      ? Math.round(Number(productForm.wholesalePrice))
      : Math.round(priceNum * 0.7);

    const minQtyNum = productForm.wholesaleMinQty.trim()
      ? Math.round(Number(productForm.wholesaleMinQty))
      : 48;

    const stockQtyNum = productForm.stockQuantity.trim()
      ? Math.max(0, parseInt(productForm.stockQuantity, 10))
      : 100;

    const specsArray = [
      { label: 'Category', value: productForm.category },
      { label: 'SKU', value: productForm.sku.trim().toUpperCase() },
      { label: 'Packaging', value: productForm.packaging.trim() },
      { label: 'Ruling', value: productForm.rulingType },
      { label: 'Paper Quality', value: productForm.paperQuality },
      { label: 'Binding', value: productForm.bindingType },
    ];

    if (modalMode === 'edit' && editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        const updatedObj: Product = {
          ...existing,
          name: productForm.name.trim(),
          category: productForm.category,
          sku: productForm.sku.trim().toUpperCase(),
          barcode: productForm.barcode.trim(),
          price: priceNum,
          discountPrice: discountNum,
          wholesalePrice: wholesaleNum,
          wholesaleMinQty: minQtyNum,
          packaging: productForm.packaging.trim(),
          quire: productForm.quire.trim(),
          pageCount: productForm.pageCount.trim(),
          stockStatus: productForm.stockStatus,
          stockQuantity: stockQtyNum,
          image: productForm.image.trim(),
          description: productForm.description.trim(),
          specifications: specsArray,
          featured: productForm.featured,
          bestSeller: productForm.bestSeller,
          freeDelivery: productForm.freeDelivery,
          dispatchTime: productForm.dispatchTime,
        };
        updateProduct(updatedObj);
        setDbSaveSuccessMessage(`Updated in MongoDB Atlas! Document ID: ${updatedObj.id}`);
      }
    } else {
      // Add or Clone Mode
      const createdObj = addProduct({
        name: productForm.name.trim(),
        category: productForm.category,
        sku: productForm.sku.trim().toUpperCase(),
        barcode: productForm.barcode.trim(),
        price: priceNum,
        discountPrice: discountNum,
        wholesalePrice: wholesaleNum,
        wholesaleMinQty: minQtyNum,
        packaging: productForm.packaging.trim(),
        quire: productForm.quire.trim(),
        pageCount: productForm.pageCount.trim(),
        stockStatus: productForm.stockStatus,
        stockQuantity: stockQtyNum,
        image: productForm.image.trim(),
        gallery: [productForm.image.trim()],
        description: productForm.description.trim(),
        specifications: specsArray,
        featured: productForm.featured,
        bestSeller: productForm.bestSeller,
        freeDelivery: productForm.freeDelivery,
        dispatchTime: productForm.dispatchTime,
        isDemoData: false,
      });
      setDbSaveSuccessMessage(`Persisted to MongoDB Atlas! New SKU: ${createdObj.sku}`);
    }

    setTimeout(() => {
      setIsProductModalOpen(false);
      setDbSaveSuccessMessage(null);
    }, 1200);
  };

  // Save Store Branding & Handles directly to MongoDB Atlas
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    const boss1Digits = (brandingForm.phoneNumber || '255715268391').replace(/\D/g, '');
    const boss2Digits = (brandingForm.secondaryPhone || '255624265480').replace(/\D/g, '');
    const mbeyaDigits = (brandingForm.branchMbeya || brandingForm.thirdPhone || '255746268391').replace(/\D/g, '');
    const mwanzaDigits = (brandingForm.branchMwanza || brandingForm.fourthPhone || '255699032777').replace(/\D/g, '');

    const updated = {
      ...brandingForm,
      phoneNumber: brandingForm.phoneNumber || '+255 715 268 391',
      secondaryPhone: brandingForm.secondaryPhone || '+255 624 265 480',
      branchMbeya: brandingForm.branchMbeya || '+255 746 268 391',
      branchMwanza: brandingForm.branchMwanza || '+255 699 032 777',
      thirdPhone: brandingForm.branchMbeya || '+255 746 268 391',
      fourthPhone: brandingForm.branchMwanza || '+255 699 032 777',
      whatsappNumber: boss1Digits || '255715268391',
      phoneNumbers: [
        brandingForm.phoneNumber || '+255 715 268 391',
        brandingForm.secondaryPhone || '+255 624 265 480',
        brandingForm.branchMbeya || '+255 746 268 391',
        brandingForm.branchMwanza || '+255 699 032 777',
      ],
      whatsappNumbers: [
        { label: 'Co-Founder & MD (Desk 1)', number: brandingForm.phoneNumber || '+255 715 268 391', digits: boss1Digits, role: 'Co-Founder & Managing Director' },
        { label: 'VIJESH K. HALAI (Co-Founder & MD)', number: brandingForm.secondaryPhone || '+255 624 265 480', digits: boss2Digits, role: 'Co-Founder & Managing Director' },
        { label: 'Mbeya Branch (Soweto SIDO)', number: brandingForm.branchMbeya || '+255 746 268 391', digits: mbeyaDigits, role: 'Mbeya Branch' },
        { label: 'Mwanza Branch Desk', number: brandingForm.branchMwanza || '+255 699 032 777', digits: mwanzaDigits, role: 'Mwanza Branch' },
      ],
      freeDeliveryThreshold: Math.max(0, Number(brandingForm.freeDeliveryThreshold) || 0),
      standardDeliveryFee: Math.max(0, Number(brandingForm.standardDeliveryFee) || 0),
      isPlaceholderConfig: false,
    };
    updateStoreConfig(updated);
    setBrandingSaved(true);
    setTimeout(() => setBrandingSaved(false), 3500);
  };

  // Order Lifecycle Handlers
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatusInDb(orderId, { status: newStatus });
    if (res.success) {
      setLiveOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId || o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
      showToast(`Order #${orderId} marked as ${newStatus}`);
    } else {
      showToast(`Notice: ${res.message || 'Updated locally'}`);
    }
  };

  const handleSaveOrderTracking = async (orderId: string) => {
    const res = await updateOrderStatusInDb(orderId, {
      trackingNumber: tempTrackingNumber,
      adminNotes: tempAdminNotes,
    });
    if (res.success) {
      setLiveOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId || o._id === orderId
            ? { ...o, trackingNumber: tempTrackingNumber, adminNotes: tempAdminNotes }
            : o
        )
      );
      showToast(`Waybill tracking updated for #${orderId}`);
      setEditingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete order #${orderId} from MongoDB Atlas?`
      )
    ) {
      return;
    }
    const res = await deleteOrderFromDb(orderId);
    if (res.success) {
      setLiveOrders((prev) =>
        prev.filter((o) => o.orderId !== orderId && o._id !== orderId)
      );
      showToast(`Order #${orderId} deleted from database.`);
    } else {
      showToast(`Notice: ${res.message || 'Removed from display'}`);
    }
  };

  // Filtered Orders
  const allOrdersCombined = useMemo(() => {
    const map = new Map<string, any>();
    liveOrders.forEach((o) => map.set(o.orderId || o._id, o));
    demoOrders.forEach((o) => {
      if (!map.has(o.orderReference)) {
        map.set(o.orderReference, o);
      }
    });
    const list = Array.from(map.values());
    return list.filter((ord) => {
      if (orderFilter === 'all') return true;
      if (orderFilter === 'wholesale') {
        return (
          ord.fulfillmentType === 'Upcountry Bus Parcel (Mikoani)' ||
          (ord.totalAmount && ord.totalAmount >= 200000)
        );
      }
      if (orderFilter === 'retail') {
        return ord.totalAmount && ord.totalAmount < 200000;
      }
      if (orderFilter === 'dispatched') {
        return ord.status === 'Dispatched' || ord.status === 'Delivered';
      }
      return true;
    });
  }, [liveOrders, demoOrders, orderFilter]);

  // Live Dealer Margin Computation in Modal
  const modalRetailNum = Number(productForm.price) || 0;
  const modalWholesaleNum = Number(productForm.wholesalePrice) || Math.round(modalRetailNum * 0.7);
  const modalMinQtyNum = Number(productForm.wholesaleMinQty) || 48;
  const modalMarginPercent =
    modalRetailNum > 0
      ? Math.round(((modalRetailNum - modalWholesaleNum) / modalRetailNum) * 100)
      : 0;
  const modalCartonWholesaleTotal = modalWholesaleNum * modalMinQtyNum;
  const modalCartonRetailYield = modalRetailNum * modalMinQtyNum;
  const modalCartonDealerProfit = modalCartonRetailYield - modalCartonWholesaleTotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans text-[#2b2520]">
      <SEOHead
        title="OMEGA HQ Enterprise ERP Portal | Central Management System"
        description="Comprehensive Enterprise Resource Planning (ERP) suite for OMEGA Stationery Tanzania: Direct MongoDB Atlas CRUD operations, catalog handles, CMS web content, and logistics waybills."
      />

      {/* Top Security & ERP Telemetry Banner */}
      <div className="bg-[#3b352f] text-stone-200 border border-[#2b2520] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c49b7c] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xs uppercase tracking-wider">
                OMEGA HQ ENTERPRISE ERP ENGINE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#c49b7c] font-mono font-bold">
                /omega-hq-portal-2026
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Direct Database CRUD Operations · Live MongoDB Atlas Connection · Central Operations Desk · Mbeya
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Atlas Live (omega_stationery)</span>
          </span>
          <button
            type="button"
            onClick={handleReloadCatalog}
            disabled={isReloadingCatalog}
            title="Reload latest catalog directly from database"
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-stone-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isReloadingCatalog ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Header & Tabs */}
      <div className="border-b border-stone-200 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#4b423b] text-[#c49b7c]">
              ERP OPERATIONS
            </span>
            <span className="text-xs text-stone-500 font-mono">v4.2 · Direct Cloud Database CRUD</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#2b2520]">
            Store Operations &amp; Database Controls
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Perform real-time CRUD operations directly on MongoDB Atlas: Catalog master records, SKU duplication, bulk price adjustments, web CMS content, and carton logistics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex items-center gap-1 p-1 bg-stone-100 border border-stone-200 rounded-xl self-start overflow-x-auto max-w-full shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-white text-[#4b423b] shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4 text-[#c49b7c]" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-[#4b423b] shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#c49b7c]" />
            <span>Orders &amp; Logistics ({allOrdersCombined.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cms_handles')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'cms_handles'
                ? 'bg-white text-[#4b423b] shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <Globe className="w-4 h-4 text-[#c49b7c]" />
            <span>Web Content &amp; Handles (CMS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-white text-[#4b423b] shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <Server className="w-4 h-4 text-[#c49b7c]" />
            <span>Cloud &amp; Telemetry</span>
          </button>
        </div>
      </div>

      {/* ==================== TAB 1: PRODUCT INVENTORY & BULK ERP OPERATIONS ==================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* ERP Inventory Valuation & Health Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Active SKUs</span>
              <p className="text-2xl font-black text-[#2b2520] font-mono mt-1">{products.length}</p>
              <span className="text-[11px] text-stone-500">Live MongoDB documents</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Physical Stock Units</span>
              <p className="text-2xl font-black text-emerald-700 font-mono mt-1">
                {totalUnitsOnHand.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold">Warehouse inventory count</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Wholesale Asset Value</span>
              <p className="text-lg font-black text-[#4b423b] font-mono mt-1 truncate">
                {formatPrice(totalWholesaleValuation, currency)}
              </p>
              <span className="text-[11px] text-stone-500">At factory dealer rates</span>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Retail Yield Valuation</span>
              <p className="text-lg font-black text-amber-700 font-mono mt-1 truncate">
                {formatPrice(totalRetailValuation, currency)}
              </p>
              <span className="text-[11px] text-amber-700 font-semibold">Total retail revenue potential</span>
            </div>
          </div>

          {/* Database Master Source of Truth Live Indicator */}
          <div className="bg-linear-to-r from-[#1c2e24] via-[#242b26] to-[#2b2520] text-white p-3.5 rounded-2xl border border-emerald-700/40 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="absolute w-5 h-5 rounded-full bg-emerald-400/30 animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-300">
                    Live Database Source of Truth
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-600/50">
                    MongoDB Atlas: omega_stationery.products
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  All catalog records, pricing, and stock updates are read and written directly to your cloud database in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReloadCatalog}
                disabled={isReloadingCatalog}
                className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
                title="Fetch authoritative catalog state directly from MongoDB Atlas"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReloadingCatalog ? 'animate-spin' : ''}`} />
                <span>{isReloadingCatalog ? 'Reloading...' : 'Reload from DB'}</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Status Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStockStatusFilter('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                stockStatusFilter === 'All'
                  ? 'bg-[#4b423b] text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setStockStatusFilter('In Stock')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                stockStatusFilter === 'In Stock'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              In Stock ({inStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStockStatusFilter('Low Stock')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                stockStatusFilter === 'Low Stock'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-amber-700 hover:bg-amber-50'
              }`}
            >
              ⚠️ Low Stock Attention ({lowStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStockStatusFilter('Out of Stock')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                stockStatusFilter === 'Out of Stock'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-red-700 hover:bg-red-50'
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>

          {/* ERP Floating Bulk Action Bar (Visible when rows are selected) */}
          {selectedProductIds.length > 0 && (
            <div className="bg-[#4b423b] text-white p-4 rounded-2xl shadow-lg border border-[#3b352f] flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#c49b7c] text-white flex items-center justify-center font-bold text-xs">
                  {selectedProductIds.length}
                </span>
                <span className="text-xs font-bold tracking-wide">
                  Products Selected for Direct Database Batch Operation
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Bulk Price Adjust */}
                <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
                  <span className="text-[11px] text-stone-300 px-2 font-mono">%:</span>
                  <input
                    type="number"
                    value={bulkAdjustmentPercent}
                    onChange={(e) => setBulkAdjustmentPercent(e.target.value)}
                    className="w-14 px-2 py-1 bg-white text-black font-mono text-xs rounded-lg font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleBulkPriceAdjustment(true)}
                    disabled={isBulkAdjusting}
                    className="px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:text-white transition-colors"
                  >
                    +Increase
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkPriceAdjustment(false)}
                    disabled={isBulkAdjusting}
                    className="px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors"
                  >
                    -Decrease
                  </button>
                </div>

                {/* Bulk Stock Status */}
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20 text-xs">
                  <span className="text-[11px] text-stone-300 px-1.5">Status:</span>
                  <button
                    type="button"
                    onClick={() => handleBulkStockStatusChange('In Stock')}
                    className="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white"
                  >
                    In Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkStockStatusChange('Low Stock')}
                    className="px-2 py-1 text-[11px] font-bold rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white"
                  >
                    Low Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkStockStatusChange('Out of Stock')}
                    className="px-2 py-1 text-[11px] font-bold rounded-lg bg-red-600/80 hover:bg-red-600 text-white"
                  >
                    Out
                  </button>
                </div>

                {/* Export & Deselect */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-[#c49b7c] hover:bg-[#b08769] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProductIds([])}
                  className="px-2.5 py-1.5 text-xs text-stone-300 hover:text-white font-medium"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Search, Filters, Sorting, and Operations Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, SKU, barcode..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter inventory by category"
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
              >
                <option value="All">All Categories ({products.length})</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort inventory"
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
              >
                <option value="default">Sort: Default</option>
                <option value="price-desc">Sort: Retail Price (High → Low)</option>
                <option value="price-asc">Sort: Retail Price (Low → High)</option>
                <option value="wholesale-desc">Sort: Wholesale Price (High → Low)</option>
                <option value="margin-desc">Sort: Dealer Margin % (Highest)</option>
                <option value="stock-asc">Sort: Stock Units (Low → High)</option>
                <option value="stock-desc">Sort: Stock Units (High → Low)</option>
                <option value="title-asc">Sort: Title (A → Z)</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleExportCSV}
                title="Export current view to Excel CSV format"
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-[#4b423b] border border-stone-200 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleSyncDatabase}
                disabled={syncingDb}
                title="Synchronize and seed all official catalog products to MongoDB Atlas"
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#4b423b] border border-stone-200 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#c49b7c] ${syncingDb ? 'animate-spin' : ''}`} />
                <span>Sync DB</span>
              </button>

              <button
                type="button"
                onClick={openAddProductModal}
                className="px-4 py-2 btn-ledup-copper text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Sync notification message */}
          {dbSyncMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                dbSyncMessage.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{dbSyncMessage.text}</span>
            </div>
          )}

          {/* Master Inventory Table with Direct DB CRUD */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#3b352f] text-white uppercase tracking-wider text-[11px] font-heading">
                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedProductIds.length === filteredInventory.length &&
                          filteredInventory.length > 0
                        }
                        onChange={handleToggleSelectAll}
                        aria-label="Select all products"
                        className="rounded text-[#c49b7c] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 font-bold">Product &amp; SKU</th>
                    <th className="py-3 px-4 font-bold">Category</th>
                    <th className="py-3 px-4 font-bold">Retail MSRP</th>
                    <th className="py-3 px-4 font-bold text-amber-200">Wholesale Unit</th>
                    <th className="py-3 px-4 font-bold">Warehouse Stock</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredInventory.map((product) => {
                    const isEditingThisRow = editingRowId === product.id;
                    const isSelected = selectedProductIds.includes(product.id);
                    const wholesaleP =
                      product.wholesalePrice || Math.round(product.price * 0.7);
                    const stockQty =
                      product.stockQuantity !== undefined ? product.stockQuantity : 100;
                    const dealerMargin = Math.round(
                      ((product.price - wholesaleP) / product.price) * 100
                    );

                    return (
                      <tr
                        key={product.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-amber-50/50' : 'hover:bg-stone-50/70'
                        }`}
                      >
                        {/* Checkbox column */}
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectProduct(product.id)}
                            aria-label={`Select ${product.name}`}
                            className="rounded text-[#c49b7c] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Title, SKU & Barcode */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setInspectingProduct(product)}
                              className="shrink-0 group relative"
                              title="Click to view full ERP specification sheet"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                className="w-12 h-12 rounded-lg object-contain bg-stone-50 p-1 border border-stone-200 group-hover:border-[#c49b7c] transition-colors"
                              />
                              <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </button>
                            <div>
                              <button
                                type="button"
                                onClick={() => setInspectingProduct(product)}
                                className="font-bold text-[#2b2520] hover:text-[#c49b7c] text-left line-clamp-1 transition-colors"
                              >
                                {product.name}
                              </button>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-stone-500 font-mono">
                                  {product.sku}
                                </span>
                                {product.barcode && (
                                  <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                                    · 📟 {product.barcode}
                                  </span>
                                )}
                              </div>
                              {product.packaging && (
                                <p className="text-[10px] text-stone-400">
                                  {product.packaging}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                          {product.category}
                        </td>

                        {/* Retail Price Column */}
                        <td className="py-3 px-4 font-mono whitespace-nowrap">
                          {isEditingThisRow ? (
                            <div className="space-y-1">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                placeholder="Retail Price"
                                className="w-24 px-2 py-1 border border-stone-300 rounded text-xs bg-white font-mono"
                              />
                              <input
                                type="number"
                                value={tempDiscountPrice}
                                onChange={(e) => setTempDiscountPrice(e.target.value)}
                                placeholder="Discount (Opt)"
                                className="w-24 px-2 py-1 border border-stone-300 rounded text-[11px] bg-white font-mono"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-bold text-[#2b2520]">
                                {formatPrice(product.discountPrice ?? product.price, currency)}
                              </span>
                              {product.discountPrice && (
                                <span className="text-[10px] text-stone-400 line-through">
                                  {formatPrice(product.price, currency)}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Wholesale Price Column */}
                        <td className="py-3 px-4 font-mono whitespace-nowrap">
                          {isEditingThisRow ? (
                            <input
                              type="number"
                              value={tempWholesalePrice}
                              onChange={(e) => setTempWholesalePrice(e.target.value)}
                              placeholder="Wholesale"
                              className="w-24 px-2 py-1 border border-stone-300 rounded text-xs bg-white font-mono text-emerald-800 font-bold"
                            />
                          ) : (
                            <div>
                              <span className="font-bold text-emerald-700">
                                {formatPrice(wholesaleP, currency)}
                              </span>
                              <span className="text-[10px] text-stone-400 block font-sans">
                                {dealerMargin}% dealer margin
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Stock Units on Hand */}
                        <td className="py-3 px-4 font-mono whitespace-nowrap">
                          {isEditingThisRow ? (
                            <input
                              type="number"
                              value={tempStockQuantity}
                              onChange={(e) => setTempStockQuantity(e.target.value)}
                              placeholder="Stock Units"
                              className="w-20 px-2 py-1 border border-stone-300 rounded text-xs bg-white font-mono"
                            />
                          ) : (
                            <span className="font-bold text-stone-700">
                              {stockQty.toLocaleString()} pcs
                            </span>
                          )}
                        </td>

                        {/* Stock Status Dropdown */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isEditingThisRow ? (
                            <select
                              value={tempStockStatus}
                              onChange={(e) => setTempStockStatus(e.target.value as StockStatus)}
                              className="px-2 py-1 border border-stone-300 rounded text-xs bg-white"
                            >
                              <option value="In Stock">In Stock</option>
                              <option value="Low Stock">Low Stock</option>
                              <option value="Out of Stock">Out of Stock</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                                product.stockStatus === 'In Stock'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                  : product.stockStatus === 'Low Stock'
                                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                                  : 'bg-red-50 border-red-200 text-red-800'
                              }`}
                            >
                              {product.stockStatus}
                            </span>
                          )}
                        </td>

                        {/* Actions: Edit, Clone, Delete, In-table Save */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {isEditingThisRow ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => saveRowEdit(product.id)}
                                title="Save changes directly to MongoDB Atlas"
                                className="px-2.5 py-1 bg-[#4b423b] hover:bg-black text-white text-xs font-bold rounded-lg inline-flex items-center gap-1 shadow-2xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingRowId(null)}
                                title="Cancel"
                                className="p-1 text-stone-400 hover:text-black"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => startRowEdit(product)}
                                title="Quick in-table edit"
                                className="p-1.5 text-stone-500 hover:text-[#4b423b] hover:bg-stone-100 rounded-lg transition-colors"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditProductModal(product)}
                                title="Open full master edit form"
                                className="p-1.5 text-stone-500 hover:text-[#4b423b] hover:bg-stone-100 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#c49b7c]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCloneProduct(product)}
                                title="Clone / Duplicate SKU into a new product"
                                className="p-1.5 text-stone-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProduct(product.id)}
                                title="Delete product permanently from MongoDB Atlas"
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
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

      {/* ==================== TAB 2: ORDERS & LOGISTICS (DIRECT MONGODB CRUD) ==================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#2b2520]">
                Customer Orders &amp; Wholesale Logistics Pipeline
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Real-time orders recorded in MongoDB Atlas. Update consignment statuses, tracking waybills, and dispatch notes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  orderFilter === 'all'
                    ? 'bg-[#4b423b] text-white'
                    : 'bg-white border border-stone-200 text-stone-600'
                }`}
              >
                All Orders ({allOrdersCombined.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('wholesale')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  orderFilter === 'wholesale'
                    ? 'bg-[#4b423b] text-white'
                    : 'bg-white border border-stone-200 text-stone-600'
                }`}
              >
                Wholesale Consignments
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('dispatched')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  orderFilter === 'dispatched'
                    ? 'bg-[#4b423b] text-white'
                    : 'bg-white border border-stone-200 text-stone-600'
                }`}
              >
                In Transit / Dispatched
              </button>
            </div>
          </div>

          {allOrdersCombined.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#2b2520]">No Orders In Pipeline Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Orders created via the shopping cart, wholesale calculator, or tender forms will show here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allOrdersCombined.map((ord, idx) => {
                const orderId = ord.orderId || ord._id || ord.orderReference || `ORD-${idx + 1000}`;
                const custName = ord.customerName || 'Direct Customer';
                const phone = ord.phoneNumber || ord.phone || '+255 746 268 391';
                const total = ord.totalAmount || ord.subtotal || 0;
                const status = ord.status || 'Pending Confirmation';
                const tracking = ord.trackingNumber || '';
                const isEditingThisOrder = editingOrderId === orderId;

                const waConfirmationUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hello ${custName}, this is OMEGA Stationery Mbeya regarding your order #${orderId}. Current status: ${status}. Tracking / Waybill: ${tracking || 'Being packed'}. Please confirm dispatch details.`
                )}`;

                return (
                  <div
                    key={orderId}
                    className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 hover:border-[#c49b7c] transition-colors"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#4b423b]">
                          #{orderId}
                        </span>
                        <div className="text-[11px] text-stone-500">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Today'}
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <select
                        value={status}
                        onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${
                          status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : status === 'Dispatched'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : status === 'Confirmed'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending Confirmation">Pending Confirmation</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Customer:</span>
                        <span className="font-bold text-[#2b2520]">{custName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Phone:</span>
                        <span className="font-mono text-stone-800">{phone}</span>
                      </div>
                      {ord.deliveryAddress && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Address:</span>
                          <span className="text-stone-800 font-medium text-right max-w-xs truncate">
                            {ord.deliveryAddress}
                          </span>
                        </div>
                      )}
                      {ord.fulfillmentType && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Fulfillment:</span>
                          <span className="text-stone-800 font-medium">{ord.fulfillmentType}</span>
                        </div>
                      )}

                      {/* Items Preview */}
                      {ord.items && Array.isArray(ord.items) && ord.items.length > 0 && (
                        <div className="pt-1 border-t border-stone-100">
                          <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
                            Carton Breakdown ({ord.items.length} items):
                          </span>
                          <div className="space-y-0.5">
                            {ord.items.slice(0, 3).map((it: any, i: number) => (
                              <div key={i} className="flex justify-between text-[11px] text-stone-600">
                                <span>{it.quantity} × {it.name || it.productId}</span>
                                <span className="font-mono">{formatPrice(it.lineTotal || 0, currency)}</span>
                              </div>
                            ))}
                            {ord.items.length > 3 && (
                              <span className="text-[10px] text-stone-400 italic">
                                + {ord.items.length - 3} more items...
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Waybill / Tracking Section */}
                      <div className="pt-1.5 border-t border-stone-100">
                        {isEditingThisOrder ? (
                          <div className="space-y-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 uppercase block">
                                Bus / Cargo Waybill Number:
                              </label>
                              <input
                                type="text"
                                value={tempTrackingNumber}
                                onChange={(e) => setTempTrackingNumber(e.target.value)}
                                placeholder="e.g. BM-7829-DAR / ABOOD-092"
                                className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 uppercase block">
                                Dispatch Notes:
                              </label>
                              <input
                                type="text"
                                value={tempAdminNotes}
                                onChange={(e) => setTempAdminNotes(e.target.value)}
                                placeholder="e.g. Loaded onto 6:00 AM bus to Dar es Salaam"
                                className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs"
                              />
                            </div>
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingOrderId(null)}
                                className="px-2 py-1 text-xs text-stone-500 hover:text-black"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveOrderTracking(orderId)}
                                className="px-3 py-1 bg-[#4b423b] text-white rounded text-xs font-bold"
                              >
                                Save Waybill
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500">Waybill / Tracking:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#4b423b]">
                                {tracking || 'Not assigned'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingOrderId(orderId);
                                  setTempTrackingNumber(tracking);
                                  setTempAdminNotes(ord.adminNotes || '');
                                }}
                                className="text-[10px] text-[#c49b7c] hover:underline font-bold"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-1 border-t border-stone-100 font-bold">
                        <span>Total Consignment:</span>
                        <span className="text-[#4b423b] font-mono text-sm">{formatPrice(total, currency)}</span>
                      </div>
                    </div>

                    {/* Order Action Buttons */}
                    <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(orderId)}
                        title="Delete order permanently from MongoDB Atlas"
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <a
                        href={waConfirmationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full bg-[#4b423b] hover:bg-black text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Update via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: WEB CONTENT & STORE HANDLES (CMS ENGINE) ==================== */}
      {activeTab === 'cms_handles' && (
        <form
          onSubmit={handleSaveBranding}
          className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#4b423b] text-[#c49b7c]">
                  CMS ENGINE
                </span>
                <span className="text-xs text-stone-500 font-mono">Live MongoDB Configuration</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-[#2b2520] mt-1">
                Web Content, Store Handles &amp; Tanzanian Contacts
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Every edit made here directly updates the live website handles across hero sections, announcement tickers, contact desks, and company profile.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetStoreConfigToDefault();
                  setBrandingForm({ ...storeConfig });
                }}
                className="text-xs font-bold text-stone-500 hover:text-[#c49b7c] inline-flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {brandingSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Web Content handles saved directly to MongoDB Atlas and published live!</span>
            </div>
          )}

          {/* CMS Sub-Tabs Navigation */}
          <div className="flex border-b border-stone-200 gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCmsActiveSubTab('identity')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                cmsActiveSubTab === 'identity'
                  ? 'bg-[#4b423b] text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Store Identity
            </button>
            <button
              type="button"
              onClick={() => setCmsActiveSubTab('hero')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                cmsActiveSubTab === 'hero'
                  ? 'bg-[#4b423b] text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Hero &amp; Announcement
            </button>
            <button
              type="button"
              onClick={() => setCmsActiveSubTab('contacts')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                cmsActiveSubTab === 'contacts'
                  ? 'bg-[#4b423b] text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              WhatsApp &amp; Contacts
            </button>
            <button
              type="button"
              onClick={() => setCmsActiveSubTab('about')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                cmsActiveSubTab === 'about'
                  ? 'bg-[#4b423b] text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Company Profile (About)
            </button>
            <button
              type="button"
              onClick={() => setCmsActiveSubTab('logistics')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                cmsActiveSubTab === 'logistics'
                  ? 'bg-[#4b423b] text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Commercial &amp; Delivery
            </button>
          </div>

          {/* SubTab 1: Store Identity */}
          {cmsActiveSubTab === 'identity' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Official Business Name
                  </label>
                  <input
                    type="text"
                    value={brandingForm.businessName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Logo Monogram Brand
                  </label>
                  <input
                    type="text"
                    value={brandingForm.logoText}
                    onChange={(e) => setBrandingForm({ ...brandingForm, logoText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Brand Slogan / Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.tagline}
                    onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Brand Slogan / Tagline (Swahili)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.taglineSw}
                    onChange={(e) => setBrandingForm({ ...brandingForm, taglineSw: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Brand Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.brandSubtitle}
                    onChange={(e) => setBrandingForm({ ...brandingForm, brandSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Brand Subtitle (Swahili)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.brandSubtitleSw}
                    onChange={(e) => setBrandingForm({ ...brandingForm, brandSubtitleSw: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SubTab 2: Hero & Announcement */}
          {cmsActiveSubTab === 'hero' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Top Announcement Ticker (English)
                </label>
                <textarea
                  rows={2}
                  value={brandingForm.announcementText}
                  onChange={(e) => setBrandingForm({ ...brandingForm, announcementText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Top Announcement Ticker (Swahili)
                </label>
                <textarea
                  rows={2}
                  value={brandingForm.announcementTextSw}
                  onChange={(e) => setBrandingForm({ ...brandingForm, announcementTextSw: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                />
              </div>
            </div>
          )}

          {/* SubTab 3: WhatsApp & Contacts */}
          {cmsActiveSubTab === 'contacts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Boss 1 (Executive Desk)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.phoneNumber || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#4b423b]"
                    placeholder="+255 715 268 391"
                  />
                  <span className="text-[10px] text-stone-400">e.g. +255 715 268 391</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Boss 2 (Management Desk)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.secondaryPhone || ''}
                    onChange={(e) => setBrandingForm({ ...brandingForm, secondaryPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#4b423b]"
                    placeholder="+255 624 265 480"
                  />
                  <span className="text-[10px] text-stone-400">e.g. +255 624 265 480</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Mbeya Branch (Soweto SIDO)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.branchMbeya || brandingForm.thirdPhone || ''}
                    onChange={(e) =>
                      setBrandingForm({
                        ...brandingForm,
                        branchMbeya: e.target.value,
                        thirdPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#4b423b]"
                    placeholder="+255 746 268 391"
                  />
                  <span className="text-[10px] text-stone-400">e.g. +255 746 268 391</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Mwanza Branch Desk
                  </label>
                  <input
                    type="text"
                    value={brandingForm.branchMwanza || brandingForm.fourthPhone || ''}
                    onChange={(e) =>
                      setBrandingForm({
                        ...brandingForm,
                        branchMwanza: e.target.value,
                        fourthPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#4b423b]"
                    placeholder="+255 699 032 777"
                  />
                  <span className="text-[10px] text-stone-400">e.g. +255 699 032 777</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Factory &amp; Shop Address (English)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.shopAddress}
                    onChange={(e) => setBrandingForm({ ...brandingForm, shopAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Factory &amp; Shop Address (Swahili)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.shopAddressSw}
                    onChange={(e) => setBrandingForm({ ...brandingForm, shopAddressSw: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Business Hours (English)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.businessHours}
                    onChange={(e) => setBrandingForm({ ...brandingForm, businessHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Business Hours (Swahili)
                  </label>
                  <input
                    type="text"
                    value={brandingForm.businessHoursSw}
                    onChange={(e) => setBrandingForm({ ...brandingForm, businessHoursSw: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Support Email Address
                  </label>
                  <input
                    type="email"
                    value={brandingForm.emailAddress}
                    onChange={(e) => setBrandingForm({ ...brandingForm, emailAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Google Maps Pin URL
                  </label>
                  <input
                    type="text"
                    value={brandingForm.googleMapsUrl}
                    onChange={(e) => setBrandingForm({ ...brandingForm, googleMapsUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SubTab 4: Company Profile (About) */}
          {cmsActiveSubTab === 'about' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Company Intro (English)
                </label>
                <textarea
                  rows={3}
                  value={brandingForm.aboutIntro}
                  onChange={(e) => setBrandingForm({ ...brandingForm, aboutIntro: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Company Intro (Swahili)
                </label>
                <textarea
                  rows={3}
                  value={brandingForm.aboutIntroSw}
                  onChange={(e) => setBrandingForm({ ...brandingForm, aboutIntroSw: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Product Range Overview (English)
                </label>
                <textarea
                  rows={2}
                  value={brandingForm.aboutProductRange}
                  onChange={(e) => setBrandingForm({ ...brandingForm, aboutProductRange: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Product Range Overview (Swahili)
                </label>
                <textarea
                  rows={2}
                  value={brandingForm.aboutProductRangeSw}
                  onChange={(e) => setBrandingForm({ ...brandingForm, aboutProductRangeSw: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#4b423b]"
                />
              </div>
            </div>
          )}

          {/* SubTab 5: Commercial & Logistics */}
          {cmsActiveSubTab === 'logistics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={brandingForm.currencySymbol}
                    onChange={(e) => setBrandingForm({ ...brandingForm, currencySymbol: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] text-stone-400">Default: TSh</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Free Delivery Threshold (TSh)
                  </label>
                  <input
                    type="number"
                    value={brandingForm.freeDeliveryThreshold}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, freeDeliveryThreshold: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] text-stone-400">Orders above this get free delivery</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Standard Local Delivery Fee (TSh)
                  </label>
                  <input
                    type="number"
                    value={brandingForm.standardDeliveryFee}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, standardDeliveryFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] text-stone-400">Standard rate in Mbeya</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-stone-200">
            <button
              type="submit"
              className="px-6 py-2.5 btn-ledup-copper text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Publish to MongoDB Atlas</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================== TAB 4: MONGODB & REDIS CLOUD TELEMETRY ==================== */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MongoDB Atlas Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[#2b2520]">MongoDB Atlas Cloud</h3>
                    <p className="text-[11px] text-stone-500">Mongoose ODM · Persistent Cloud Database</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Atlas Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Cluster Engine</span>
                  <span className="font-bold text-[#2b2520]">MongoDB Atlas (Cloud)</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Target Database</span>
                  <span className="font-bold text-[#2b2520] font-mono">omega_stationery</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Cloud Products Count</span>
                  <span className="font-black text-emerald-700 font-mono text-sm">
                    {backendHealth?.database.productsCount ?? products.length} Documents
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Orders Recorded</span>
                  <span className="font-bold text-[#2b2520] font-mono">
                    {liveOrders.length} Orders
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSyncDatabase}
                  disabled={syncingDb}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-xs font-bold text-[#4b423b] inline-flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-4 h-4 text-[#c49b7c] ${syncingDb ? 'animate-spin' : ''}`} />
                  <span>Synchronize Catalog Seed with MongoDB Atlas</span>
                </button>
              </div>
            </div>

            {/* Redis & In-Memory Cache Card with Live Status & Error Handler */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[#2b2520]">Redis &amp; Memory Cache</h3>
                    <p className="text-[11px] text-stone-500">Sub-millisecond Edge Response Cache</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE · ACTIVE
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    Cache Layer
                  </span>
                </div>
              </div>

              {/* Cache Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Cache Hit Rate</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {backendHealth?.cache?.hitRatioPercent ? `${backendHealth.cache.hitRatioPercent}%` : '100%'}
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-0.5">Hits: {backendHealth?.cache?.hits ?? 0}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Response Latency</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {backendHealth?.cache?.averageLatencyMs ? `${backendHealth.cache.averageLatencyMs}ms` : '<0.5ms'}
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">Sub-millisecond</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Active Engine</span>
                  <span className="font-bold text-[#2b2520] font-mono text-xs truncate block">
                    {backendHealth?.cache?.engine || 'Sub-millisecond Edge LRU'}
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-0.5">
                    {backendHealth?.cache?.connected ? 'Native Redis (Port 6379)' : 'In-Memory Live Engine'}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Cached Query Keys</span>
                  <span className="font-bold text-[#2b2520] font-mono text-sm">
                    {backendHealth?.cache?.cachedKeysCount ?? 0} Keys
                  </span>
                  <span className="block text-[10px] text-stone-400 mt-0.5">Auto-evicted via TTL</span>
                </div>
              </div>

              {/* Error Handler & Fallback Diagnostics Alert Banner */}
              {!backendHealth?.cache?.connected ? (
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Redis Error Handler: Automatic Edge Fallback Active</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Zero Downtime
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Native Redis daemon is offline on <code className="px-1 py-0.5 bg-white/70 rounded border border-amber-200 font-mono text-[10px]">{backendHealth?.cache?.redisUrl || 'redis://localhost:6379'}</code> ({backendHealth?.cache?.redisError || 'Connection refused'}). The <strong>Sub-millisecond In-Memory LRU Cache</strong> is seamlessly serving all product and config requests with &lt;0.5ms latency.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Native Redis Server Connected &amp; Synced ({backendHealth?.cache?.redisUrl})</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Dual multi-tier caching operational: Native Redis key-value store + in-memory response cache.
                  </p>
                </div>
              )}

              {/* Live Benchmark Result Banner (if executed) */}
              {cacheBenchmarkResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-900">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      Live Cache Benchmark Test Passed!
                    </span>
                    <span className="font-mono font-bold text-emerald-700 text-xs bg-emerald-100 px-2 py-0.5 rounded">
                      {cacheBenchmarkResult.latencyMs}ms Edge Latency
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Engine: {cacheBenchmarkResult.engine} · Verified active write &amp; read cycles.
                  </p>
                </div>
              )}

              {/* Action Buttons: Benchmark, Reconnect, Flush */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestCacheBenchmark}
                  disabled={testingCacheBenchmark}
                  className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Zap className={`w-3.5 h-3.5 ${testingCacheBenchmark ? 'animate-spin' : ''}`} />
                  <span>{testingCacheBenchmark ? 'Testing...' : 'Test Live Benchmark'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReconnectRedis}
                  disabled={reconnectingRedis}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[#4b423b] rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#c49b7c] ${reconnectingRedis ? 'animate-spin' : ''}`} />
                  <span>{reconnectingRedis ? 'Connecting...' : 'Reconnect Redis'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFlushCache}
                  disabled={flushingCache}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[#4b423b] rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-amber-600 ${flushingCache ? 'animate-spin' : ''}`} />
                  <span>{flushingCache ? 'Evicting...' : 'Flush Cache'}</span>
                </button>
              </div>

              {/* Reconnect or Flush Feedback Banner */}
              {redisReconnectMsg && (
                <div
                  className={`p-2.5 border rounded-xl text-[11px] font-bold text-center ${
                    redisReconnectMsg.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  {redisReconnectMsg.text}
                </div>
              )}

              {cacheFlushMessage && (
                <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-700 text-center">
                  {cacheFlushMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT / CLONE MASTER PRODUCT MODAL (DIRECT MONGODB CRUD) ==================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#4b423b] text-[#c49b7c]">
                    {modalMode === 'add' ? 'ADD NEW PRODUCT' : modalMode === 'clone' ? 'CLONE VARIANT SKU' : 'EDIT PRODUCT'}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">Direct Database CRUD</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-[#2b2520] mt-0.5">
                  {modalMode === 'add'
                    ? 'Create Product Master in MongoDB Atlas'
                    : modalMode === 'clone'
                    ? `Clone SKU Variant: ${productForm.name}`
                    : `Edit Master SKU: ${productForm.sku}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                aria-label="Close modal"
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success notification */}
            {dbSaveSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{dbSaveSuccessMessage}</span>
              </div>
            )}

            {/* Error notification */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Internal Section Tabs */}
            <div className="flex border-b border-stone-200 gap-1 overflow-x-auto pb-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalActiveTab('info')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  modalActiveTab === 'info'
                    ? 'bg-[#4b423b] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                1. Core Info &amp; Barcode
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('pricing')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  modalActiveTab === 'pricing'
                    ? 'bg-[#4b423b] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                2. Pricing &amp; Wholesale Tiers
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('specs')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  modalActiveTab === 'specs'
                    ? 'bg-[#4b423b] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                3. Manufacturing &amp; Packaging
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('stock')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  modalActiveTab === 'stock'
                    ? 'bg-[#4b423b] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                4. Stock &amp; Warehouse
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('media')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  modalActiveTab === 'media'
                    ? 'bg-[#4b423b] text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                5. Imagery &amp; Presets
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4">
              {/* SECTION 1: Core Info & Barcode */}
              {modalActiveTab === 'info' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. OMEGA Hardcover Counter Book Q3 (288 Pages)"
                      className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Category *
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm({ ...productForm, category: e.target.value as ProductCategory })
                        }
                        className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                      >
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                          SKU Code *
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              sku: generateSkuCode(
                                productForm.category,
                                productForm.quire,
                                productForm.pageCount
                              ),
                            })
                          }
                          className="text-[10px] text-[#c49b7c] hover:underline font-bold"
                        >
                          ⚡ Auto-Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                          Barcode (EAN-13 / GS1)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm({ ...productForm, barcode: generateEan13Barcode() })
                          }
                          className="text-[10px] text-[#c49b7c] hover:underline font-bold"
                        >
                          ⚡ Generate EAN-13
                        </button>
                      </div>
                      <input
                        type="text"
                        value={productForm.barcode}
                        onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                        placeholder="e.g. 6164000192837"
                        className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Dispatch Time Guarantee
                      </label>
                      <input
                        type="text"
                        value={productForm.dispatchTime}
                        onChange={(e) =>
                          setProductForm({ ...productForm, dispatchTime: e.target.value })
                        }
                        placeholder="e.g. Same-Day Factory Dispatch"
                        className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                      placeholder="Specifications, paper ruling, GSM, school requirements..."
                      className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 2: Pricing, Margins & Wholesale Tiers */}
              {modalActiveTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Retail MSRP (TSh) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Discount Price (TSh)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={productForm.discountPrice}
                        onChange={(e) =>
                          setProductForm({ ...productForm, discountPrice: e.target.value })
                        }
                        placeholder="Optional sale rate"
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Wholesale Unit Price (TSh) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={productForm.wholesalePrice}
                        onChange={(e) =>
                          setProductForm({ ...productForm, wholesalePrice: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50 focus:outline-none focus:border-emerald-600 font-bold text-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 max-w-xs">
                    <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                      Min Wholesale Quantity (Pcs/Box) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={productForm.wholesaleMinQty}
                      onChange={(e) =>
                        setProductForm({ ...productForm, wholesaleMinQty: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50"
                    />
                  </div>

                  {/* Live Margin & Carton Calculator Box */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#4b423b] border-b border-stone-200 pb-1.5">
                      <span>ERP Live Commercial Margin Calculator</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono">
                        {modalMarginPercent}% Dealer Margin
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-bold">Carton Wholesale Cost:</span>
                        <span className="font-mono font-bold text-[#2b2520]">
                          {formatPrice(modalCartonWholesaleTotal, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-bold">Carton Retail Value:</span>
                        <span className="font-mono font-bold text-stone-700">
                          {formatPrice(modalCartonRetailYield, currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase font-bold">Retailer Profit / Case:</span>
                        <span className="font-mono font-bold text-emerald-700">
                          +{formatPrice(modalCartonDealerProfit, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: Manufacturing & Packaging Specs */}
              {modalActiveTab === 'specs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Packaging Spec (e.g. 48 Pcs / Box)
                      </label>
                      <input
                        type="text"
                        value={productForm.packaging}
                        onChange={(e) =>
                          setProductForm({ ...productForm, packaging: e.target.value })
                        }
                        placeholder="e.g. 48 Pcs / Strapped Corrugated Box"
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Quire Classification
                      </label>
                      <select
                        value={productForm.quire}
                        onChange={(e) => setProductForm({ ...productForm, quire: e.target.value })}
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                      >
                        <option value="1 Quire">1 Quire</option>
                        <option value="2 Quire">2 Quire</option>
                        <option value="3 Quire">3 Quire</option>
                        <option value="4 Quire">4 Quire</option>
                        <option value="N/A">N/A / Standard</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Page Count
                      </label>
                      <select
                        value={productForm.pageCount}
                        onChange={(e) =>
                          setProductForm({ ...productForm, pageCount: e.target.value })
                        }
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                      >
                        <option value="32 Pages">32 Pages</option>
                        <option value="48 Pages">48 Pages</option>
                        <option value="80 Pages">80 Pages</option>
                        <option value="100 Pages">100 Pages</option>
                        <option value="120 Pages">120 Pages</option>
                        <option value="192 Pages">192 Pages</option>
                        <option value="200 Pages">200 Pages</option>
                        <option value="288 Pages">288 Pages</option>
                        <option value="384 Pages">384 Pages</option>
                        <option value="500 Sheets / Ream">500 Sheets / Ream</option>
                        <option value="50 Envelopes / Pack">50 Envelopes / Pack</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Ruling / Grid Pattern
                      </label>
                      <select
                        value={productForm.rulingType}
                        onChange={(e) =>
                          setProductForm({ ...productForm, rulingType: e.target.value })
                        }
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                      >
                        <option value="Single Line Ruled">Single Line Ruled</option>
                        <option value="Square Grid 5mm (Hesabu)">Square Grid 5mm (Hesabu)</option>
                        <option value="Double Line (Kiswahili/English)">Double Line (Kiswahili/English)</option>
                        <option value="Plain Unruled">Plain Unruled</option>
                        <option value="Ledger / Cash Columns">Ledger / Cash Columns</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Paper Weight / Quality
                      </label>
                      <input
                        type="text"
                        value={productForm.paperQuality}
                        onChange={(e) =>
                          setProductForm({ ...productForm, paperQuality: e.target.value })
                        }
                        placeholder="e.g. 70 GSM Bleed-Proof Woodfree Paper"
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Binding Type
                      </label>
                      <input
                        type="text"
                        value={productForm.bindingType}
                        onChange={(e) =>
                          setProductForm({ ...productForm, bindingType: e.target.value })
                        }
                        placeholder="e.g. Hardcover Smyth-Sewn Thread Bound"
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: Stock & Warehouse Inventory */}
              {modalActiveTab === 'stock' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Stock Status
                      </label>
                      <select
                        value={productForm.stockStatus}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stockStatus: e.target.value as StockStatus })
                        }
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-stone-50"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                        Physical Stock Quantity on Hand (Units)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={productForm.stockQuantity}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stockQuantity: e.target.value })
                        }
                        placeholder="e.g. 500 pcs"
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-200">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) =>
                          setProductForm({ ...productForm, featured: e.target.checked })
                        }
                        className="rounded text-[#4b423b] focus:ring-0"
                      />
                      <span>Featured on Homepage Showcase</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.bestSeller}
                        onChange={(e) =>
                          setProductForm({ ...productForm, bestSeller: e.target.checked })
                        }
                        className="rounded text-[#4b423b] focus:ring-0"
                      />
                      <span>Best-Selling Badge</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.freeDelivery}
                        onChange={(e) =>
                          setProductForm({ ...productForm, freeDelivery: e.target.checked })
                        }
                        className="rounded text-[#4b423b] focus:ring-0"
                      />
                      <span>Free Delivery Eligibility Tag</span>
                    </label>
                  </div>
                </div>
              )}

              {/* SECTION 5: Imagery, Upload & Presets */}
              {modalActiveTab === 'media' && (
                <div className="space-y-4">
                  {/* File Upload Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageFileUpload(file);
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      isDraggingFile
                        ? 'border-[#c49b7c] bg-[#c49b7c]/10 shadow-md scale-[1.01]'
                        : 'border-stone-300 hover:border-[#c49b7c] bg-stone-50/80 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="file"
                      id="product-image-file-input"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFileUpload(file);
                      }}
                    />

                    {isUploadingImage ? (
                      <div className="py-4 flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-[#c49b7c] animate-spin" />
                        <p className="text-xs font-bold text-[#4b423b]">
                          Processing &amp; Uploading Image...
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Saving image to server repository and linking to MongoDB Atlas
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#4b423b]/10 text-[#4b423b] flex items-center justify-center">
                          <UploadCloud className="w-6 h-6 text-[#c49b7c]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#2b2520]">
                            Drag &amp; Drop product photo here, or{' '}
                            <label
                              htmlFor="product-image-file-input"
                              className="text-[#c49b7c] font-black hover:underline cursor-pointer"
                            >
                              Browse Files
                            </label>
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Supports PNG, JPG, JPEG, WEBP or SVG (Max 25MB). Uploads directly to server storage.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <label
                            htmlFor="product-image-file-input"
                            className="px-3.5 py-1.5 bg-[#4b423b] hover:bg-[#3b352f] text-white text-[11px] font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#c49b7c]" />
                            <span>Select from Computer / Mobile</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Notification Banners */}
                  {uploadSuccessNotice && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{uploadSuccessNotice}</span>
                    </div>
                  )}

                  {uploadErrorNotice && (
                    <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 font-bold flex items-center gap-2 animate-in fade-in">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{uploadErrorNotice}</span>
                    </div>
                  )}

                  {/* Live Image Preview & Assigned Path */}
                  <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-contain bg-white p-1 border border-stone-300 shadow-2xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/omega-products/counter-book-q2-192p.jpeg';
                      }}
                    />
                    <div className="text-xs flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#2b2520]">Active Product Photo</p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          Ready for Database
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] truncate font-mono mt-0.5">
                        {productForm.image}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1">
                        High-definition rendering with automatic aspect-ratio containment and shadow depth.
                      </p>
                    </div>
                  </div>

                  {/* Manual Image URL Path */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider">
                      Or Direct Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="/uploads/omega_photo.png or https://..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono bg-stone-50 focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>

                  {/* 1-Click Official OMEGA Asset Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-600 uppercase block">
                      ⚡ Quick 1-Click Factory Presets:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                      {OMEGA_IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image: preset.path })}
                          className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                            productForm.image === preset.path
                              ? 'border-[#c49b7c] bg-amber-50/50 shadow-2xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <img
                            src={preset.path}
                            alt={preset.label}
                            className="w-8 h-8 rounded object-contain bg-stone-50 shrink-0"
                          />
                          <span className="text-[10px] font-semibold text-stone-700 line-clamp-2">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 btn-ledup-copper text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {modalMode === 'add'
                        ? 'Create Product in MongoDB Atlas'
                        : modalMode === 'clone'
                        ? 'Save Cloned Variant to Database'
                        : 'Update Product in Database'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== QUICK PRODUCT INSPECTION DRAWER ==================== */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#4b423b] text-[#c49b7c]">
                  ERP MASTER RECORD
                </span>
                <h3 className="font-heading text-lg font-bold text-[#2b2520] mt-1">
                  {inspectingProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingProduct(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <img
                src={inspectingProduct.image}
                alt={inspectingProduct.name}
                className="w-20 h-20 rounded-lg object-contain bg-white p-1 border border-stone-300"
              />
              <div className="space-y-1 text-xs">
                <p className="font-mono font-bold text-stone-800">
                  SKU: {inspectingProduct.sku}
                </p>
                {inspectingProduct.barcode && (
                  <p className="font-mono text-stone-600 text-[11px]">
                    📟 EAN-13: {inspectingProduct.barcode}
                  </p>
                )}
                <p className="text-stone-500 font-semibold">{inspectingProduct.category}</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inspectingProduct.stockStatus === 'In Stock'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {inspectingProduct.stockStatus} ·{' '}
                  {inspectingProduct.stockQuantity !== undefined
                    ? inspectingProduct.stockQuantity
                    : 100}{' '}
                  units on hand
                </span>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Retail Price:</span>
                <span className="font-mono font-bold text-[#2b2520]">
                  {formatPrice(inspectingProduct.price, currency)}
                </span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Wholesale Unit Price:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {formatPrice(
                    inspectingProduct.wholesalePrice || Math.round(inspectingProduct.price * 0.7),
                    currency
                  )}
                </span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Packaging Spec:</span>
                <span className="font-medium text-stone-800">
                  {inspectingProduct.packaging || '48 Pcs / Strapped Box'}
                </span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Quire &amp; Pages:</span>
                <span className="font-medium text-stone-800">
                  {inspectingProduct.quire || '2 Quire'} · {inspectingProduct.pageCount || '192 Pages'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setInspectingProduct(null);
                  handleCloneProduct(inspectingProduct);
                }}
                className="px-3.5 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold inline-flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Clone Variant</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectingProduct(null);
                  openEditProductModal(inspectingProduct);
                }}
                className="px-4 py-1.5 bg-[#4b423b] hover:bg-black text-white rounded-xl text-xs font-bold inline-flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>Edit Master Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
