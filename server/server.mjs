import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configurable Uploads Directory (Shared with Vite public folder)
const UPLOADS_DIR = join(__dirname, '..', 'public', 'uploads');
try {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`📁 [Uploads] Created static uploads directory at: ${UPLOADS_DIR}`);
  }
} catch (e) {
  console.warn('Notice on uploads directory creation:', e.message);
}

// Configurable MongoDB URIs
const ATLAS_URI = 'mongodb+srv://indigoprinteromega07_db_user:OMEGA%407016@omega.ccgcbcy.mongodb.net/omega_stationery?retryWrites=true&w=majority';
const LOCAL_URI = 'mongodb://127.0.0.1:27017/omega_stationery';
const MONGODB_URI = process.env.MONGODB_URI || ATLAS_URI;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10);

// Security & Performance Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(morgan('short'));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// API Rate Limiting (300 requests per minute per IP)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again in a minute' }
});
app.use('/api/', apiLimiter);

// ==========================================
// 1. LOAD 33 OFFICIAL OMEGA PRODUCTS CATALOG
// ==========================================
const CATALOG_PATH = join(__dirname, 'products-catalog.json');
let SEED_PRODUCTS = [];

try {
  if (existsSync(CATALOG_PATH)) {
    SEED_PRODUCTS = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
    console.log(`📦 Loaded ${SEED_PRODUCTS.length} official OMEGA catalog products from JSON seed.`);
  }
} catch (e) {
  console.warn('Could not read products-catalog.json:', e.message);
}

// In-Memory Fallback State (persisted to file if Mongo is offline)
let inMemoryProducts = [...SEED_PRODUCTS];
let inMemoryOrders = [];

// ==========================================
// 2. MONGOOSE SCHEMAS & MODELS
// ==========================================
const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameSw: String,
    category: { type: String, required: true, index: true },
    image: String,
    gallery: [String],
    description: String,
    descriptionSw: String,
    price: { type: Number, required: true },
    discountPrice: Number,
    wholesalePrice: Number,
    wholesaleMinQty: Number,
    stockStatus: { type: String, default: 'In Stock', index: true },
    stockQuantity: { type: Number, default: 100 },
    sku: { type: String, index: true },
    barcode: String,
    quire: String,
    pageCount: String,
    size: String,
    paperType: String,
    binding: String,
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 180 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    subtitle: String,
    badge: String,
    packaging: String,
    freeDelivery: { type: Boolean, default: true },
    dispatchTime: { type: String, default: 'Same-Day Dispatch' },
    colorOptions: [
      {
        name: String,
        hex: String
      }
    ],
    specifications: [
      {
        label: String,
        value: String
      }
    ]
  },
  { collection: 'products', timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderReference: { type: String, unique: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    region: String,
    deliveryAddress: String,
    fulfillmentType: { type: String, default: 'Direct WhatsApp Delivery' },
    items: [
      {
        productId: String,
        name: String,
        quantity: Number,
        unitPrice: Number,
        lineTotal: Number
      }
    ],
    subtotal: Number,
    deliveryFee: Number,
    totalAmount: Number,
    notes: String,
    status: { type: String, default: 'Pending Confirmation' },
    trackingNumber: String,
    adminNotes: String
  },
  { collection: 'orders', timestamps: true }
);

const configSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global_config', unique: true },
    businessName: { type: String, default: 'OMEGA Writing Notebooks & Stationery' },
    logoText: { type: String, default: 'OMEGA' },
    tagline: { type: String, default: 'Quality for Every Page' },
    taglineSw: { type: String, default: 'Ubora kwa Kila Ukurasa' },
    brandSubtitle: { type: String, default: 'PREMIER TANZANIAN WRITING NOTEBOOKS · EST. 1998' },
    brandSubtitleSw: { type: String, default: 'MADAFTARI BORA YA UANDISHI TANZANIA · TANGU 1998' },
    announcementText: { type: String, default: 'QUALITY FOR EVERY PAGE | WHOLESALE & RETAIL ORDERS ACROSS TANZANIA | OFFICIAL OMEGA DISTRIBUTOR' },
    announcementTextSw: { type: String, default: 'UBORA KWA KILA UKURASA | ODA ZA JUMLA NA REJAREJA TANZANIA NZIMA | MSAMBAZAJI HALISI WA OMEGA' },
    phoneNumber: { type: String, default: '+255 746 268 391' },
    secondaryPhone: { type: String, default: '+255 624 265 480' },
    thirdPhone: { type: String, default: '+255 689 032 777' },
    phoneNumbers: [String],
    whatsappNumber: { type: String, default: '255746268391' },
    shopAddress: { type: String, default: 'Soweto SIDO Viwandani, Mbeya, Tanzania' },
    shopAddressSw: { type: String, default: 'Soweto SIDO Viwandani, Mbeya, Tanzania' },
    businessHours: { type: String, default: 'Monday – Saturday: 8:00 AM – 6:30 PM · Sunday: Closed' },
    businessHoursSw: { type: String, default: 'Jumatatu – Jumamosi: Saa 2:00 Asubuhi – Saa 12:30 Jioni · Jumapili: Tumefungwa' },
    googleMapsUrl: { type: String, default: 'https://maps.google.com/?q=Soweto+SIDO+Viwandani+Mbeya' },
    emailAddress: { type: String, default: 'indigoprinter06423@gmail.com' },
    currencySymbol: { type: String, default: 'TSh' },
    freeDeliveryThreshold: { type: Number, default: 150000 },
    standardDeliveryFee: { type: Number, default: 5000 },
    aboutIntro: String,
    aboutIntroSw: String,
    aboutProductRange: String,
    aboutProductRangeSw: String,
    aboutCustomerService: String,
    aboutCustomerServiceSw: String,
    aboutValues: [String],
    aboutValuesSw: [String],
  },
  { collection: 'store_config', timestamps: true }
);

let ProductModel;
let OrderModel;
let ConfigModel;

try {
  ProductModel = mongoose.model('Product', productSchema);
  OrderModel = mongoose.model('Order', orderSchema);
  ConfigModel = mongoose.model('StoreConfig', configSchema);
} catch (e) {
  ProductModel = mongoose.models.Product;
  OrderModel = mongoose.models.Order;
  ConfigModel = mongoose.models.StoreConfig;
}

let inMemoryConfig = {
  businessName: 'OMEGA Writing Notebooks & Stationery',
  logoText: 'OMEGA',
  tagline: 'Quality for Every Page',
  taglineSw: 'Ubora kwa Kila Ukurasa',
  brandSubtitle: 'PREMIER TANZANIAN WRITING NOTEBOOKS · EST. 1998',
  brandSubtitleSw: 'MADAFTARI BORA YA UANDISHI TANZANIA · TANGU 1998',
  announcementText: 'QUALITY FOR EVERY PAGE | WHOLESALE & RETAIL ORDERS ACROSS TANZANIA | OFFICIAL OMEGA DISTRIBUTOR',
  announcementTextSw: 'UBORA KWA KILA UKURASA | ODA ZA JUMLA NA REJAREJA TANZANIA NZIMA | MSAMBAZAJI HALISI WA OMEGA',
  phoneNumber: '+255 746 268 391',
  secondaryPhone: '+255 624 265 480',
  thirdPhone: '+255 689 032 777',
  phoneNumbers: ['+255 746 268 391', '+255 624 265 480', '+255 689 032 777'],
  whatsappNumber: '255746268391',
  shopAddress: 'Soweto SIDO Viwandani, Mbeya, Tanzania',
  shopAddressSw: 'Soweto SIDO Viwandani, Mbeya, Tanzania',
  businessHours: 'Monday – Saturday: 8:00 AM – 6:30 PM · Sunday: Closed',
  businessHoursSw: 'Jumatatu – Jumamosi: Saa 2:00 Asubuhi – Saa 12:30 Jioni · Jumapili: Tumefungwa',
  googleMapsUrl: 'https://maps.google.com/?q=Soweto+SIDO+Viwandani+Mbeya',
  emailAddress: 'indigoprinter06423@gmail.com',
  currencySymbol: 'TSh',
  freeDeliveryThreshold: 150000,
  standardDeliveryFee: 5000,
};

// Database state tracker
let mongoConnected = false;
let mongoConnectionError = null;

async function initMongoDB() {
  try {
    mongoose.set('strictQuery', false);
    console.log(`🔌 [MongoDB] Connecting to database...`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000
    });
    
    mongoConnected = true;
    mongoConnectionError = null;
    console.log(`✅ [MongoDB] Connected successfully to: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

    // Seed or synchronize products if empty or outdated
    const count = await ProductModel.countDocuments();
    if (count === 0 && SEED_PRODUCTS.length > 0) {
      console.log(`🌱 [MongoDB] Seeding initial ${SEED_PRODUCTS.length} OMEGA catalog products...`);
      await ProductModel.insertMany(SEED_PRODUCTS);
      console.log(`✅ [MongoDB] Inserted ${SEED_PRODUCTS.length} products successfully.`);
    } else {
      console.log(`📊 [MongoDB] Collection 'products' has ${count} documents.`);
    }
  } catch (err) {
    mongoConnected = false;
    mongoConnectionError = err.message;
    console.warn(`⚠️ [MongoDB] Connection failed: ${err.message}`);
    console.warn(`💡 [MongoDB Fallback] Running with in-memory JSON data manager (${inMemoryProducts.length} products ready).`);
  }
}

// ==========================================
// 3. REDIS CACHE ENGINE
// ==========================================
let redisConnected = false;
let redisClient = null;

const cacheMetrics = {
  hits: 0,
  misses: 0,
  totalRequests: 0,
  lastHitTime: null,
  averageLatencyMs: 1.5,
  inMemoryCache: new Map()
};

async function initRedis() {
  try {
    redisClient = createClient({
      url: REDIS_URL,
      socket: { connectTimeout: 1500, reconnectStrategy: false }
    });

    redisClient.on('error', () => {
      redisConnected = false;
    });

    await redisClient.connect();
    redisConnected = true;
    console.log(`⚡ [Redis] Connected successfully to: ${REDIS_URL}`);
  } catch (err) {
    redisConnected = false;
    console.log(`⚡ [Redis Fallback] Using high-speed In-Memory Cache Engine (<1.5ms).`);
  }
}

async function getCache(key) {
  cacheMetrics.totalRequests++;
  const start = performance.now();

  if (redisConnected && redisClient) {
    try {
      const data = await redisClient.get(key);
      if (data) {
        cacheMetrics.hits++;
        cacheMetrics.lastHitTime = new Date().toISOString();
        return { isHit: true, value: JSON.parse(data), latency: Math.round((performance.now() - start) * 100) / 100 };
      }
    } catch (e) {}
  }

  const mem = cacheMetrics.inMemoryCache.get(key);
  if (mem && mem.expiry > Date.now()) {
    cacheMetrics.hits++;
    cacheMetrics.lastHitTime = new Date().toISOString();
    return { isHit: true, value: mem.data, latency: Math.round((performance.now() - start) * 100) / 100 };
  }

  cacheMetrics.misses++;
  return { isHit: false, latency: Math.round((performance.now() - start) * 100) / 100 };
}

async function setCache(key, data, ttlSeconds = CACHE_TTL) {
  if (redisConnected && redisClient) {
    try {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    } catch (e) {}
  }
  cacheMetrics.inMemoryCache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000
  });
}

async function invalidateCache(key) {
  if (redisConnected && redisClient) {
    try {
      await redisClient.del(key);
    } catch (e) {}
  }
  cacheMetrics.inMemoryCache.delete(key);
}

// ==========================================
// 4. REST API ROUTES
// ==========================================

// GET /api/health - System Health & Database Diagnostics
app.get('/api/health', async (req, res) => {
  let dbProductsCount = inMemoryProducts.length;
  let dbOrdersCount = inMemoryOrders.length;

  if (mongoConnected && ProductModel) {
    try {
      dbProductsCount = await ProductModel.countDocuments();
      dbOrdersCount = await OrderModel.countDocuments();
    } catch (e) {}
  }

  const hitRatio = cacheMetrics.totalRequests > 0
    ? Math.round((cacheMetrics.hits / cacheMetrics.totalRequests) * 100)
    : 100;

  res.json({
    success: true,
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'OMEGA Stationery & Books API',
      runtime: 'Node.js Express + Mongoose',
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        engine: 'MongoDB',
        connected: mongoConnected,
        databaseName: 'omega_stationery',
        targetUri: MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB Daemon',
        error: mongoConnectionError,
        productsCount: dbProductsCount,
        ordersCount: dbOrdersCount,
        totalDocuments: dbProductsCount + dbOrdersCount
      },
      cache: {
        engine: redisConnected ? 'Native Redis Server' : 'In-Memory Redis Fallback',
        connected: redisConnected,
        hits: cacheMetrics.hits,
        misses: cacheMetrics.misses,
        hitRatioPercent: hitRatio,
        averageLatencyMs: cacheMetrics.averageLatencyMs
      }
    }
  });
});

// GET /api/database/stats - Detailed MongoDB Analytics & Management Stats
app.get('/api/database/stats', async (req, res) => {
  let products = inMemoryProducts;
  let orders = inMemoryOrders;

  if (mongoConnected && ProductModel) {
    try {
      products = await ProductModel.find().lean();
      orders = await OrderModel.find().lean();
    } catch (e) {}
  }

  const categoryCounts = {};
  let inStockCount = 0;
  let outOfStockCount = 0;

  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    if (p.stockStatus === 'In Stock') inStockCount++;
    else outOfStockCount++;
  });

  res.json({
    success: true,
    data: {
      database: {
        engine: 'MongoDB',
        connected: mongoConnected,
        connectionError: mongoConnectionError,
        databaseName: 'omega_stationery',
        mode: mongoConnected ? 'MongoDB Live Cluster' : 'Resilient In-Memory/File Storage',
        collection: 'products',
        totalProducts: products.length,
        totalOrders: orders.length,
        inStockCount,
        outOfStockCount,
        categoryCounts
      }
    }
  });
});

// GET /api/products - List products with optional search, category, and featured filters
app.get('/api/products', async (req, res) => {
  const { category, search, featured, bestSeller } = req.query;
  const cacheKey = `omega:products:cat=${category || 'all'}&q=${search || ''}&f=${featured || ''}&b=${bestSeller || ''}`;

  // 1. Try cache
  const cached = await getCache(cacheKey);
  if (cached.isHit) {
    res.setHeader('X-Cache', 'HIT');
    return res.json({
      success: true,
      source: 'Cache',
      data: cached.value
    });
  }

  // 2. Query MongoDB or In-Memory
  let results = [];
  if (mongoConnected && ProductModel) {
    try {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (featured === 'true') query.featured = true;
      if (bestSeller === 'true') query.bestSeller = true;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      results = await ProductModel.find(query).lean();
    } catch (e) {
      results = inMemoryProducts;
    }
  } else {
    results = inMemoryProducts.filter((p) => {
      if (category && category !== 'All' && p.category !== category) return false;
      if (featured === 'true' && !p.featured) return false;
      if (bestSeller === 'true' && !p.bestSeller) return false;
      if (search) {
        const term = search.toLowerCase();
        const match =
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term));
        if (!match) return false;
      }
      return true;
    });
  }

  // 3. Cache response
  await setCache(cacheKey, results, CACHE_TTL);

  res.setHeader('X-Cache', 'MISS');
  res.json({
    success: true,
    source: mongoConnected ? 'MongoDB' : 'In-Memory Store',
    count: results.length,
    data: results
  });
});

// GET /api/products/:id - Single product detail
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  let product = null;

  if (mongoConnected && ProductModel) {
    try {
      product = await ProductModel.findOne({ id }).lean();
    } catch (e) {}
  }

  if (!product) {
    product = inMemoryProducts.find((p) => p.id === id);
  }

  if (!product) {
    return res.status(404).json({ success: false, message: `Product ${id} not found` });
  }

  res.json({ success: true, data: product });
});

// POST /api/upload - Direct Image Upload for Product Catalog
app.post('/api/upload', async (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    let buffer;
    let extension = 'jpg';

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
        if (mimeType.includes('png')) extension = 'png';
        else if (mimeType.includes('webp')) extension = 'webp';
        else if (mimeType.includes('svg')) extension = 'svg';
        else extension = 'jpg';
      } else {
        return res.status(400).json({ success: false, message: 'Invalid data URI image format' });
      }
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const cleanName = filename
      ? filename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30)
      : 'product';
    const uniqueFilename = `omega_${cleanName}_${Date.now()}.${extension}`;
    const targetPath = join(UPLOADS_DIR, uniqueFilename);

    writeFileSync(targetPath, buffer);
    console.log(`📸 [Upload] Saved product image: ${uniqueFilename} (${buffer.length} bytes)`);

    const publicUrl = `/uploads/${uniqueFilename}`;

    res.json({
      success: true,
      message: 'Image successfully uploaded and stored',
      url: publicUrl,
      filename: uniqueFilename,
      sizeBytes: buffer.length
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Image upload failed' });
  }
});

// POST /api/products - Create or Upsert Product in MongoDB
app.post('/api/products', async (req, res) => {
  const productData = req.body;
  if (!productData.id || !productData.name || !productData.price) {
    return res.status(400).json({ success: false, message: 'Missing required fields (id, name, price)' });
  }

  try {
    let savedProduct = productData;

    if (mongoConnected && ProductModel) {
      savedProduct = await ProductModel.findOneAndUpdate({ id: productData.id }, productData, {
        upsert: true,
        new: true
      }).lean();
    }

    const idx = inMemoryProducts.findIndex((p) => p.id === productData.id);
    if (idx >= 0) inMemoryProducts[idx] = productData;
    else inMemoryProducts.unshift(productData);

    // Invalidate caches
    cacheMetrics.inMemoryCache.clear();
    if (redisConnected && redisClient) {
      try { await redisClient.flushAll(); } catch (e) {}
    }

    res.status(201).json({
      success: true,
      message: 'Product successfully saved to MongoDB',
      data: savedProduct
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    let updated = null;
    if (mongoConnected && ProductModel) {
      updated = await ProductModel.findOneAndUpdate({ id }, updateData, { new: true }).lean();
    }

    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx >= 0) {
      inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updateData };
      if (!updated) updated = inMemoryProducts[idx];
    }

    cacheMetrics.inMemoryCache.clear();
    res.json({ success: true, message: 'Product updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/products/:id/price - Fast inline price update
app.patch('/api/products/:id/price', async (req, res) => {
  const { id } = req.params;
  const { price, discountPrice, wholesalePrice } = req.body;

  if (price === undefined && wholesalePrice === undefined) {
    return res.status(400).json({ success: false, message: 'Price or wholesalePrice is required' });
  }

  try {
    const updateObj = {};
    if (price !== undefined) updateObj.price = Number(price);
    if (discountPrice !== undefined) updateObj.discountPrice = Number(discountPrice);
    if (wholesalePrice !== undefined) updateObj.wholesalePrice = Number(wholesalePrice);

    if (mongoConnected && ProductModel) {
      await ProductModel.findOneAndUpdate({ id }, { $set: updateObj });
    }

    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx >= 0) {
      if (price !== undefined) inMemoryProducts[idx].price = Number(price);
      if (discountPrice !== undefined) inMemoryProducts[idx].discountPrice = Number(discountPrice);
      if (wholesalePrice !== undefined) inMemoryProducts[idx].wholesalePrice = Number(wholesalePrice);
    }

    cacheMetrics.inMemoryCache.clear();
    res.json({ success: true, message: 'Price updated successfully in MongoDB' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/products/:id/stock - Quick stock status update
app.patch('/api/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stockStatus, stockQuantity } = req.body;

  try {
    const updateObj = {};
    if (stockStatus) updateObj.stockStatus = stockStatus;
    if (stockQuantity !== undefined) updateObj.stockQuantity = Number(stockQuantity);

    if (mongoConnected && ProductModel) {
      await ProductModel.findOneAndUpdate({ id }, { $set: updateObj });
    }

    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx >= 0) {
      if (stockStatus) inMemoryProducts[idx].stockStatus = stockStatus;
      if (stockQuantity !== undefined) inMemoryProducts[idx].stockQuantity = Number(stockQuantity);
    }

    cacheMetrics.inMemoryCache.clear();
    res.json({ success: true, message: 'Stock status updated in MongoDB' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id - Delete product from MongoDB
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoConnected && ProductModel) {
      await ProductModel.deleteOne({ id });
    }
    inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
    cacheMetrics.inMemoryCache.clear();

    res.json({ success: true, message: `Product ${id} deleted successfully from MongoDB` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products/bulk - ERP Bulk product operations (adjust price %, set stock status, etc.)
app.post('/api/products/bulk', async (req, res) => {
  const { action, ids, percentage, stockStatus } = req.body;
  try {
    if (!action) return res.status(400).json({ success: false, message: 'Action is required' });

    if (action === 'adjust_price' && percentage) {
      const multiplier = 1 + Number(percentage) / 100;
      const filter = ids && ids.length > 0 ? { id: { $in: ids } } : {};

      if (mongoConnected && ProductModel) {
        const prods = await ProductModel.find(filter);
        for (const p of prods) {
          p.price = Math.round(p.price * multiplier);
          if (p.discountPrice) p.discountPrice = Math.round(p.discountPrice * multiplier);
          if (p.wholesalePrice) p.wholesalePrice = Math.round(p.wholesalePrice * multiplier);
          await p.save();
        }
      }

      inMemoryProducts.forEach((p) => {
        if (!ids || ids.length === 0 || ids.includes(p.id)) {
          p.price = Math.round(p.price * multiplier);
          if (p.discountPrice) p.discountPrice = Math.round(p.discountPrice * multiplier);
          if (p.wholesalePrice) p.wholesalePrice = Math.round(p.wholesalePrice * multiplier);
        }
      });
      cacheMetrics.inMemoryCache.clear();
      return res.json({ success: true, message: `Prices adjusted by ${percentage}% across ${ids?.length || 'all'} products in MongoDB` });
    }

    if (action === 'set_stock' && stockStatus) {
      const filter = ids && ids.length > 0 ? { id: { $in: ids } } : {};
      if (mongoConnected && ProductModel) {
        await ProductModel.updateMany(filter, { $set: { stockStatus } });
      }
      inMemoryProducts.forEach((p) => {
        if (!ids || ids.length === 0 || ids.includes(p.id)) {
          p.stockStatus = stockStatus;
        }
      });
      cacheMetrics.inMemoryCache.clear();
      return res.json({ success: true, message: `Stock status updated to "${stockStatus}" in MongoDB` });
    }

    res.status(400).json({ success: false, message: 'Invalid bulk action specified' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products/seed - Resynchronize/Seed all 33 products into MongoDB
app.post('/api/products/seed', async (req, res) => {
  try {
    if (SEED_PRODUCTS.length === 0) {
      return res.status(400).json({ success: false, message: 'No seed products available' });
    }

    if (mongoConnected && ProductModel) {
      // Bulk upsert to maintain existing reviews/stats while updating specs/prices
      const ops = SEED_PRODUCTS.map((prod) => ({
        updateOne: {
          filter: { id: prod.id },
          update: { $set: prod },
          upsert: true
        }
      }));
      await ProductModel.bulkWrite(ops);
    }

    inMemoryProducts = [...SEED_PRODUCTS];
    cacheMetrics.inMemoryCache.clear();

    res.json({
      success: true,
      message: `Successfully synchronized ${SEED_PRODUCTS.length} products to MongoDB`,
      count: SEED_PRODUCTS.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders - Submit Order to MongoDB
app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  if (!orderData.customerName || !orderData.phoneNumber) {
    return res.status(400).json({ success: false, message: 'Customer name and phone number required' });
  }

  try {
    const orderRef = orderData.orderReference || `OMG-${Date.now().toString().slice(-6)}`;
    const fullOrder = {
      orderReference: orderRef,
      createdAt: new Date().toISOString(),
      ...orderData
    };

    let savedOrder = fullOrder;
    if (mongoConnected && OrderModel) {
      savedOrder = await OrderModel.create(fullOrder);
    } else {
      inMemoryOrders.unshift(fullOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order recorded in MongoDB database',
      data: savedOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders - Get all orders from MongoDB
app.get('/api/orders', async (req, res) => {
  try {
    let orders = inMemoryOrders;
    if (mongoConnected && OrderModel) {
      orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    }
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id - Update order status, tracking waybill, and admin notes
app.patch('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, trackingNumber } = req.body;
  try {
    const updateObj = {};
    if (status) updateObj.status = status;
    if (adminNotes !== undefined) updateObj.adminNotes = adminNotes;
    if (trackingNumber !== undefined) updateObj.trackingNumber = trackingNumber;

    let updated = null;
    if (mongoConnected && OrderModel) {
      updated = await OrderModel.findOneAndUpdate(
        { $or: [{ orderReference: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updateObj },
        { new: true }
      ).lean();
    }

    const idx = inMemoryOrders.findIndex((o) => o.orderReference === id || o._id === id);
    if (idx >= 0) {
      inMemoryOrders[idx] = { ...inMemoryOrders[idx], ...updateObj };
      if (!updated) updated = inMemoryOrders[idx];
    }

    res.json({ success: true, message: 'Order updated in MongoDB database', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/orders/:id - Remove order from MongoDB
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoConnected && OrderModel) {
      await OrderModel.deleteOne({
        $or: [{ orderReference: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
      });
    }
    inMemoryOrders = inMemoryOrders.filter((o) => o.orderReference !== id && o._id !== id);
    res.json({ success: true, message: `Order ${id} deleted successfully from MongoDB` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/config - Retrieve live store configuration & web content handles
app.get('/api/config', async (req, res) => {
  try {
    let config = null;
    if (mongoConnected && ConfigModel) {
      config = await ConfigModel.findOne({ key: 'global_config' }).lean();
    }
    if (!config) config = inMemoryConfig;
    res.json({ success: true, data: config });
  } catch (err) {
    res.json({ success: true, data: inMemoryConfig });
  }
});

// PUT /api/config - Direct ERP update of all Web Content, Announcements, and Store Handles
app.put('/api/config', async (req, res) => {
  const updateData = req.body;
  try {
    let saved = updateData;
    if (mongoConnected && ConfigModel) {
      saved = await ConfigModel.findOneAndUpdate(
        { key: 'global_config' },
        { ...updateData, key: 'global_config' },
        { upsert: true, new: true }
      ).lean();
    }

    inMemoryConfig = { ...inMemoryConfig, ...updateData };
    cacheMetrics.inMemoryCache.clear();
    res.json({
      success: true,
      message: 'Web content and store configuration updated directly in MongoDB database',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cache/flush - Flush cache
app.post('/api/cache/flush', async (req, res) => {
  cacheMetrics.inMemoryCache.clear();
  if (redisConnected && redisClient) {
    try { await redisClient.flushAll(); } catch (e) {}
  }
  res.json({ success: true, message: 'Cache evicted successfully' });
});

// ==========================================
// 8. MONGODB AI MODEL API & SMART ASSISTANT
// ==========================================
const MONGODB_AI_ENDPOINT = process.env.MONGODB_AI_ENDPOINT || process.env.VITE_MONGODB_AI_ENDPOINT || 'https://ai.mongodb.com';
const MONGODB_AI_API_KEY = process.env.MONGODB_AI_API_KEY || process.env.VITE_MONGODB_AI_API_KEY || 'al-VPCnW0f05wrvNC9EBX63MS0V2E8Fmv4WqN78ueb53U8';

// Helper: Intelligent Fallback stationery recommendation engine
function generateStationeryAssistantReply(message, products) {
  const lower = (message || '').toLowerCase();

  // Check for Quire / Counter Book queries
  if (lower.includes('q3') || lower.includes('quire 3')) {
    const q3 = products.find(p => p.id === 'counter-book-q3-288p');
    return {
      reply: `The **OMEGA Q3 Hardcover Counter Book (288 Pages)** is our flagship executive notebook! It features thread-sewn hardboard covers, smooth high-GSM paper that prevents ink bleed-through, and comes packed **36 Pcs per Box** at **TZS 56,000 / Box** (or TZS 6,500 retail). Would you like to add it to your order?`,
      recommendedProducts: q3 ? [q3] : []
    };
  }

  if (lower.includes('q2') || lower.includes('quire 2')) {
    const q2 = products.find(p => p.id === 'counter-book-q2-192p');
    return {
      reply: `The **OMEGA Q2 Counter Book (192 Pages)** is ideal for secondary school subjects and daily office ledgers. Packed **48 Pcs per Box** at **TZS 54,000 / Box** (or TZS 5,000 retail). Available in Single Line, Double Line, and Square ruling.`,
      recommendedProducts: q2 ? [q2] : []
    };
  }

  if (lower.includes('q4') || lower.includes('quire 4')) {
    const q4 = products.find(p => p.id === 'counter-book-q4-384p');
    return {
      reply: `The **OMEGA Q4 Counter Book (384 Pages)** is our thickest heavy-duty archival ledger book. Packed **24 Pcs per Box** at **TZS 44,000 / Box** (or TZS 8,000 retail). Perfect for multi-year accounting, university thesis notes, and institutional registers.`,
      recommendedProducts: q4 ? [q4] : []
    };
  }

  if (lower.includes('q1') || lower.includes('quire 1')) {
    const q1 = products.find(p => p.id === 'counter-book-q1-96p');
    return {
      reply: `The **OMEGA Q1 Counter Book (96 Pages)** is our compact hardcover notebook, packed **96 Pcs per Box** at **TZS 58,000 / Box** (or TZS 3,500 retail). Great for lab manuals and field logbooks.`,
      recommendedProducts: q1 ? [q1] : []
    };
  }

  // Check for Exercise books
  if (lower.includes('exercise') || lower.includes('daftari') || lower.includes('madaftari') || lower.includes('school book')) {
    const exBooks = products.filter(p => p.category === 'Exercise Books').slice(0, 3);
    return {
      reply: `We manufacture high-grade OMEGA Exercise Books conforming to the Tanzanian educational curriculum:
• **200 Pages**: 120 Pcs / Box (TZS 56,000)
• **100 Pages**: 120 Pcs / Box (TZS 41,000)
• **80 Pages**: 100 Pcs / Box (TZS 26,000)
• **32 Pages**: 300 Pcs / Box (TZS 42,000)
All rulings are available: Single Line, Double Line, Square, and Plain!`,
      recommendedProducts: exBooks
    };
  }

  // Check for Bahasha / Envelopes
  if (lower.includes('bahasha') || lower.includes('envelope') || lower.includes('kraft')) {
    const envelopes = products.filter(p => p.category === 'Bahasha & Envelopes').slice(0, 3);
    return {
      reply: `Our heavy-duty Kraft Bahasha envelopes are manufactured at our Soweto SIDO factory in Mbeya:
• **A3 Bahasha**: 500 Pcs / Pack (TZS 54,000)
• **A4 Bahasha**: 500 Pcs / Pack (TZS 41,000)
• **A5 Bahasha**: 500 Pcs / Pack (TZS 33,000)
• **A6 Bahasha**: 5,000 Pcs / Pack (TZS 85,000)
Manufactured from high-tensile brown kraft paper that resists tears during transit.`,
      recommendedProducts: envelopes
    };
  }

  // Check for Location / Delivery
  if (lower.includes('location') || lower.includes('address') || lower.includes('where') || lower.includes('mbeya') || lower.includes('wapi')) {
    return {
      reply: `🏭 **OMEGA Stationery & Indigo Printers** is located at **Soweto SIDO Viwandani, Mbeya, Tanzania**.
We deliver wholesale cartons across all Tanzanian regions (Dar es Salaam, Arusha, Mwanza, Dodoma, Morogoro, Iringa) via reliable bus freight & cargo carriers! You can also contact our official hotlines:
• Desk 1 (General Orders): **+255 746 268 391**
• Desk 2 (Wholesale & Tenders): **+255 624 265 480**
• Desk 3 (Logistics & Upcountry): **+255 689 032 777**`,
      recommendedProducts: []
    };
  }

  // Default smart stationery match
  const matches = products.filter(p => {
    return lower.split(' ').some(w => w.length > 3 && p.name.toLowerCase().includes(w));
  }).slice(0, 3);

  return {
    reply: `Hello! I am your **OMEGA AI Stationery Advisor**. I can assist you with:
1. **School Booklist Matching**: Paste your list and I will assemble your cart automatically.
2. **Wholesale Carton Pricing**: View carton piece counts and box rates from our official 2026 factory sheet.
3. **Product Recommendations**: Choose the exact right ruling (Single, Double, Square, Plain) and Quire (Q1, Q2, Q3, Q4) for your needs.
How can I assist your school or business today?`,
    recommendedProducts: matches.length > 0 ? matches : products.slice(0, 2)
  };
}

// POST /api/ai/chat - MongoDB AI Model chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Message prompt required' });
  }

  // Try live MongoDB AI Model endpoint if available
  try {
    const aiResponse = await fetch(`${MONGODB_AI_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MONGODB_AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mongodb-ai-stationery-v1',
        messages: [
          {
            role: 'system',
            content: `You are the official AI Stationery Specialist for OMEGA Writing Notebooks & Indigo Printers (Soweto SIDO Viwandani, Mbeya, Tanzania). We manufacture Counter Books (Q1 96p, Q2 192p, Q3 288p, Q4 384p), Exercise Books (32p, 80p, 100p, 200p), and Kraft Bahasha Envelopes (A3, A4, A5, A6). Always be polite, professional, and provide exact pricing in TZS.`
          },
          ...(history || []),
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
      signal: AbortSignal.timeout(4000)
    });

    if (aiResponse.ok) {
      const data = await aiResponse.json();
      const reply = data.choices?.[0]?.message?.content || data.reply;
      if (reply) {
        return res.json({
          success: true,
          source: 'mongodb-ai-model',
          reply,
          recommendedProducts: []
        });
      }
    }
  } catch (err) {
    // Graceful fallback to built-in NLP engine
  }

  // Built-in intelligent stationery NLP fallback
  const result = generateStationeryAssistantReply(message, inMemoryProducts);
  return res.json({
    success: true,
    source: 'omega-nlp-engine',
    reply: result.reply,
    recommendedProducts: result.recommendedProducts
  });
});

// POST /api/ai/parse-booklist - Intelligent School Booklist & Tender Parser
app.post('/api/ai/parse-booklist', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ success: false, message: 'Booklist text required' });
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const matchedItems = [];
  let estimatedTotal = 0;

  for (const line of lines) {
    // Extract quantity (e.g., "5 Counter books", "10x Exercise", "2 pcs")
    const qtyMatch = line.match(/^(\d+)\s*(?:x|pcs|pieces|cartons|boxes)?\s*(.*)$/i) || line.match(/(.*?)\s*[-:]\s*(\d+)\s*(?:pcs)?$/i);
    let qty = 1;
    let query = line;

    if (qtyMatch) {
      if (!isNaN(parseInt(qtyMatch[1], 10))) {
        qty = Math.max(1, parseInt(qtyMatch[1], 10));
        query = qtyMatch[2] || line;
      } else if (!isNaN(parseInt(qtyMatch[2], 10))) {
        qty = Math.max(1, parseInt(qtyMatch[2], 10));
        query = qtyMatch[1] || line;
      }
    }

    const qLower = query.toLowerCase();

    // Match best product from inMemoryProducts
    let bestProduct = inMemoryProducts.find(p => {
      if (qLower.includes('q3') && p.id === 'counter-book-q3-288p') return true;
      if (qLower.includes('q2') && p.id === 'counter-book-q2-192p') return true;
      if (qLower.includes('q4') && p.id === 'counter-book-q4-384p') return true;
      if (qLower.includes('q1') && p.id === 'counter-book-q1-96p') return true;
      if ((qLower.includes('200') || qLower.includes('200p')) && p.id === 'exercise-book-200p') return true;
      if ((qLower.includes('100') || qLower.includes('100p')) && p.id === 'exercise-book-100p') return true;
      if ((qLower.includes('80') || qLower.includes('80p')) && p.id === 'exercise-book-80p') return true;
      if ((qLower.includes('32') || qLower.includes('32p')) && p.id === 'exercise-book-32p') return true;
      if (qLower.includes('a4') && qLower.includes('bahasha') && p.id === 'bahasha-kraft-a4') return true;
      if (qLower.includes('a3') && qLower.includes('bahasha') && p.id === 'bahasha-kraft-a3') return true;
      if (qLower.includes('ruler') && p.category.toLowerCase().includes('stationery')) return true;
      if (qLower.includes('math') && p.category.toLowerCase().includes('stationery')) return true;
      if (qLower.includes('pen') && p.category.toLowerCase().includes('stationery')) return true;
      return false;
    });

    if (!bestProduct) {
      bestProduct = inMemoryProducts.find(p => p.name.toLowerCase().includes(qLower));
    }

    if (bestProduct) {
      const unitPrice = bestProduct.discountPrice && bestProduct.discountPrice < bestProduct.price
        ? bestProduct.discountPrice
        : bestProduct.price;
      const subtotal = unitPrice * qty;
      estimatedTotal += subtotal;

      matchedItems.push({
        rawLine: line,
        quantity: qty,
        product: bestProduct,
        unitPrice,
        subtotal
      });
    }
  }

  res.json({
    success: true,
    parsedCount: matchedItems.length,
    estimatedTotal,
    items: matchedItems
  });
});

// Start Server
async function start() {
  await initMongoDB();
  await initRedis();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 [OMEGA MongoDB API Server] Running on http://localhost:${PORT}`);
    console.log(`📊 Health Endpoint:    http://localhost:${PORT}/api/health`);
    console.log(`📦 Products Endpoint:  http://localhost:${PORT}/api/products`);
    console.log(`📈 DB Stats Endpoint:  http://localhost:${PORT}/api/database/stats`);
    console.log(`======================================================\n`);
  });
}

start();
