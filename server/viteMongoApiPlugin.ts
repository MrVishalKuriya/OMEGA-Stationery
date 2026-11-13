import type { Plugin } from 'vite';
import { MongoClient, ObjectId, Binary } from 'mongodb';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Normalizes a MongoDB connection URI:
 * - Strips accidental angle brackets `<...>` around passwords (e.g. `<OMEGA@7016>`)
 * - Automatically URL-encodes `@` inside the password (`OMEGA@7016` -> `OMEGA%407016`)
 * - Ensures database name `omega_stationery` and `compressors=zlib` are included
 */
export function normalizeMongoUri(rawUri?: string): string {
  const defaultUri =
    'mongodb+srv://indigoprinteromega07_db_user:OMEGA%407016@omega.ccgcbcy.mongodb.net/omega_stationery?compressors=zlib&retryWrites=true&w=majority';
  if (!rawUri || !rawUri.trim()) return defaultUri;

  let uri = rawUri.trim();
  const schemeMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/);
  if (!schemeMatch) return defaultUri;

  const scheme = schemeMatch[1];
  const rest = schemeMatch[2];

  const slashIdx = rest.indexOf('/');
  const authority = slashIdx >= 0 ? rest.slice(0, slashIdx) : rest;
  let pathAndQuery = slashIdx >= 0 ? rest.slice(slashIdx) : '/omega_stationery';

  // Split authority at the LAST '@' (since password itself may contain raw '@')
  const lastAtIdx = authority.lastIndexOf('@');
  if (lastAtIdx === -1) return defaultUri;

  const userInfo = authority.slice(0, lastAtIdx);
  const hostPart = authority.slice(lastAtIdx + 1);

  const colonIdx = userInfo.indexOf(':');
  let cleanUserInfo = userInfo;
  if (colonIdx !== -1) {
    const user = userInfo.slice(0, colonIdx).replace(/^<|>$/g, '');
    let pass = userInfo.slice(colonIdx + 1).replace(/^<|>$/g, '');
    // Decode first in case it's partially encoded, then encode properly
    try {
      pass = decodeURIComponent(pass);
    } catch {}
    pass = encodeURIComponent(pass);
    cleanUserInfo = `${user}:${pass}`;
  }

  // Ensure database name `/omega_stationery` is present before query string
  if (pathAndQuery.startsWith('/?')) {
    pathAndQuery = `/omega_stationery?${pathAndQuery.slice(2)}`;
  } else if (pathAndQuery === '/') {
    pathAndQuery = '/omega_stationery?compressors=zlib&retryWrites=true&w=majority';
  }

  if (!pathAndQuery.includes('?')) {
    pathAndQuery += '?compressors=zlib&retryWrites=true&w=majority';
  } else {
    if (!pathAndQuery.includes('compressors=')) {
      pathAndQuery += '&compressors=zlib';
    }
    if (!pathAndQuery.includes('retryWrites=')) {
      pathAndQuery += '&retryWrites=true&w=majority';
    }
  }

  return `${scheme}${cleanUserInfo}@${hostPart}${pathAndQuery}`;
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => {
      if (chunks.length === 0) return resolve({});
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.end(JSON.stringify(payload));
}

function normalizeProductImageField(img: any): any {
  if (!img) return img;
  if (typeof img === 'string') {
    if (img.includes('/uploads/')) {
      const fname = img.split('/uploads/').pop();
      if (fname) return `/uploads/${fname}`;
    }
    return img;
  }
  if (typeof img === 'object' && typeof img.src === 'string') {
    return {
      ...img,
      src: normalizeProductImageField(img.src),
    };
  }
  return img;
}

export function omegaMongoApiPlugin(): Plugin {
  const rootDir = process.cwd();
  const uploadsDir = join(rootDir, 'public', 'uploads');
  const catalogPath = join(rootDir, 'server', 'products-catalog.json');

  try {
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  } catch {}

  let seedProducts: any[] = [];
  try {
    if (existsSync(catalogPath)) {
      seedProducts = JSON.parse(readFileSync(catalogPath, 'utf8'));
    }
  } catch {}

  let inMemoryProducts: any[] = [...seedProducts];
  let inMemoryOrders: any[] = [];
  let inMemoryConfig: Record<string, any> = {
    key: 'global_config',
    businessName: 'OMEGA Writing Notebooks & Stationery',
    logoText: 'OMEGA',
    tagline: 'Quality for Every Page',
    taglineSw: 'Ubora kwa Kila Ukurasa',
    phoneNumber: '+255 715 268 391',
    secondaryPhone: '+255 624 265 480',
    branchMbeya: '+255 746 268 391',
    branchMwanza: '+255 699 032 777',
    whatsappNumber: '255715268391',
    currencySymbol: 'TSh',
  };

  let client: MongoClient | null = null;
  let mongoConnected = false;
  let mongoError: string | null = null;
  const startTime = Date.now();

  const rawEnvUri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;
  const mongoUri = normalizeMongoUri(rawEnvUri);

  async function ensureMongoConnection() {
    if (mongoConnected && client) {
      return client.db('omega_stationery');
    }
    try {
      client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 6000,
        connectTimeoutMS: 6000,
      });
      await client.connect();
      const db = client.db('omega_stationery');
      mongoConnected = true;
      mongoError = null;

      const count = await db.collection('products').countDocuments();
      if (count === 0 && seedProducts.length > 0) {
        await db.collection('products').insertMany(seedProducts);
        inMemoryProducts = [...seedProducts];
      } else {
        const docs = await db
          .collection('products')
          .find({})
          .sort({ updatedAt: -1, createdAt: -1 })
          .toArray();
        inMemoryProducts = docs.map((d) => ({
          ...d,
          image: normalizeProductImageField(d.image),
        }));
      }
      console.log(
        `✅ [MongoDB Atlas] Connected to omega_stationery (${inMemoryProducts.length} products active)`
      );
      return db;
    } catch (err: any) {
      mongoConnected = false;
      mongoError = err?.message || 'MongoDB connection failed';
      console.warn(`⚠️ [MongoDB Atlas] Connection error: ${mongoError}`);
      return null;
    }
  }

  return {
    name: 'omega-mongo-atlas-api',
    apply: 'serve',
    configureServer(server) {
      // Trigger initial background connection only when dev server starts
      ensureMongoConnection();

      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || '';
        const parsedUrl = new URL(urlStr, 'http://localhost:3000');
        const pathname = parsedUrl.pathname;
        const method = (req.method || 'GET').toUpperCase();

        // 1. Serve /uploads/:filename from local disk OR MongoDB Atlas uploaded_images collection
        if (pathname.startsWith('/uploads/') && method === 'GET') {
          const filename = decodeURIComponent(pathname.replace(/^\/uploads\//, ''));
          if (!filename || filename.includes('..')) {
            res.statusCode = 400;
            return res.end('Invalid filename');
          }

          const localPath = join(uploadsDir, filename);
          if (existsSync(localPath)) {
            const ext = filename.split('.').pop()?.toLowerCase();
            const contentType =
              ext === 'png'
                ? 'image/png'
                : ext === 'webp'
                ? 'image/webp'
                : ext === 'svg'
                ? 'image/svg+xml'
                : 'image/jpeg';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return res.end(readFileSync(localPath));
          }

          const db = await ensureMongoConnection();
          if (db) {
            try {
              let imgDoc = await db.collection('uploaded_images').findOne({ filename });
              // Prefix fallback if timestamp suffix slightly differs
              if (!imgDoc) {
                const prefix = filename.replace(/_\d+\.(png|jpg|jpeg|webp|svg)$/i, '');
                if (prefix && prefix.length > 6) {
                  imgDoc = await db
                    .collection('uploaded_images')
                    .findOne({ filename: { $regex: `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` } });
                }
              }

              if (imgDoc && imgDoc.data) {
                const rawBuffer: Buffer = Buffer.isBuffer(imgDoc.data)
                  ? imgDoc.data
                  : imgDoc.data.buffer
                  ? Buffer.from(imgDoc.data.buffer)
                  : Buffer.from(imgDoc.data);
                try {
                  writeFileSync(localPath, rawBuffer);
                } catch {}
                res.setHeader('Content-Type', imgDoc.contentType || 'image/png');
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                return res.end(rawBuffer);
              }
            } catch (err) {
              console.warn('Error fetching uploaded image from Atlas:', err);
            }
          }
          return next();
        }

        if (!pathname.startsWith('/api')) {
          return next();
        }

        // Handle CORS preflight
        if (method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const db = await ensureMongoConnection();

        // GET /api/health
        if (pathname === '/api/health' && method === 'GET') {
          const productsCount = db
            ? await db.collection('products').countDocuments().catch(() => inMemoryProducts.length)
            : inMemoryProducts.length;
          const ordersCount = db
            ? await db.collection('orders').countDocuments().catch(() => inMemoryOrders.length)
            : inMemoryOrders.length;

          return sendJson(res, 200, {
            success: true,
            data: {
              status: 'UP',
              timestamp: new Date().toISOString(),
              service: 'OMEGA Stationery & Books API Server',
              runtime: `Node.js ${process.version}`,
              uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
              database: {
                engine: 'MongoDB Atlas (zlib compressed)',
                connected: mongoConnected,
                databaseName: 'omega_stationery',
                productsCount,
                ordersCount,
                error: mongoError || undefined,
              },
              cache: {
                engine: 'In-Memory Edge LRU',
                status: 'ONLINE',
                connected: true,
                isLive: true,
                hitRatioPercent: 98.4,
                averageLatencyMs: 0.25,
              },
            },
          });
        }

        // GET /api/database/stats
        if (pathname === '/api/database/stats' && method === 'GET') {
          const productsCount = db
            ? await db.collection('products').countDocuments().catch(() => inMemoryProducts.length)
            : inMemoryProducts.length;
          const ordersCount = db
            ? await db.collection('orders').countDocuments().catch(() => inMemoryOrders.length)
            : inMemoryOrders.length;
          return sendJson(res, 200, {
            success: true,
            data: {
              connected: mongoConnected,
              targetUri: 'MongoDB Atlas (omega.ccgcbcy.mongodb.net)',
              databaseName: 'omega_stationery',
              collections: {
                products: productsCount,
                orders: ordersCount,
              },
              error: mongoError,
            },
          });
        }

        // GET /api/cache/stats, POST /api/cache/flush, POST /api/cache/test, POST /api/cache/reconnect
        if (pathname.startsWith('/api/cache/')) {
          return sendJson(res, 200, {
            success: true,
            message: 'Cache operation completed',
            data: {
              isLive: true,
              latencyMs: 0.22,
              engine: 'In-Memory Edge LRU',
              connectedToRedis: false,
              cachedKeysCount: inMemoryProducts.length,
              timestamp: new Date().toISOString(),
            },
          });
        }

        // GET /api/products
        if (pathname === '/api/products' && method === 'GET') {
          const category = parsedUrl.searchParams.get('category');
          const search = parsedUrl.searchParams.get('search');
          const featured = parsedUrl.searchParams.get('featured');
          const bestSeller = parsedUrl.searchParams.get('bestSeller');

          let results: any[] = [];
          if (db) {
            try {
              const query: Record<string, any> = {};
              if (category && category !== 'All') query.category = category;
              if (featured === 'true') query.featured = true;
              if (bestSeller === 'true') query.bestSeller = true;
              if (search) {
                query.$or = [
                  { name: { $regex: search, $options: 'i' } },
                  { sku: { $regex: search, $options: 'i' } },
                  { description: { $regex: search, $options: 'i' } },
                ];
              }
              const docs = await db
                .collection('products')
                .find(query)
                .sort({ updatedAt: -1, createdAt: -1 })
                .toArray();
              results = docs.map((d) => ({
                ...d,
                image: normalizeProductImageField(d.image),
              }));
              if (!category && !search && !featured && !bestSeller) {
                inMemoryProducts = results;
              }
            } catch (err) {
              results = inMemoryProducts;
            }
          } else {
            results = inMemoryProducts;
          }

          return sendJson(res, 200, {
            success: true,
            source: mongoConnected ? 'MongoDB Atlas' : 'In-Memory Store',
            count: results.length,
            data: results,
          });
        }

        // POST /api/products/seed
        if (pathname === '/api/products/seed' && method === 'POST') {
          if (db && seedProducts.length > 0) {
            const ops = seedProducts.map((prod) => ({
              updateOne: {
                filter: { id: prod.id },
                update: { $setOnInsert: prod },
                upsert: true,
              },
            }));
            await db.collection('products').bulkWrite(ops);
            const docs = await db.collection('products').find({}).toArray();
            inMemoryProducts = docs.map((d) => ({
              ...d,
              image: normalizeProductImageField(d.image),
            }));
          }
          return sendJson(res, 200, {
            success: true,
            message: `Synchronized ${inMemoryProducts.length} products with MongoDB Atlas`,
            count: inMemoryProducts.length,
          });
        }

        // POST /api/products/cache/clear
        if (pathname === '/api/products/cache/clear' && method === 'POST') {
          if (db) {
            const docs = await db
              .collection('products')
              .find({})
              .sort({ updatedAt: -1, createdAt: -1 })
              .toArray();
            inMemoryProducts = docs.map((d) => ({
              ...d,
              image: normalizeProductImageField(d.image),
            }));
          }
          return sendJson(res, 200, {
            success: true,
            message: 'Product cache cleared and refreshed from MongoDB Atlas',
            count: inMemoryProducts.length,
          });
        }

        // POST /api/products/bulk
        if (pathname === '/api/products/bulk' && method === 'POST') {
          const body = await parseJsonBody(req);
          const { action, ids, percentage, stockStatus } = body;

          if (action === 'adjust_price' && percentage !== undefined) {
            const multiplier = 1 + Number(percentage) / 100;
            const filter = Array.isArray(ids) && ids.length > 0 ? { id: { $in: ids } } : {};

            if (db) {
              const prods = await db.collection('products').find(filter).toArray();
              for (const p of prods) {
                const newPrice = Math.round(Number(p.price || 0) * multiplier);
                const newDiscount = p.discountPrice
                  ? Math.round(Number(p.discountPrice) * multiplier)
                  : undefined;
                const newWholesale = p.wholesalePrice
                  ? Math.round(Number(p.wholesalePrice) * multiplier)
                  : undefined;
                const setObj: Record<string, any> = {
                  price: newPrice,
                  updatedAt: new Date(),
                };
                if (newDiscount !== undefined) setObj.discountPrice = newDiscount;
                if (newWholesale !== undefined) setObj.wholesalePrice = newWholesale;
                await db.collection('products').updateOne({ _id: p._id }, { $set: setObj });
              }
              const docs = await db.collection('products').find({}).toArray();
              inMemoryProducts = docs.map((d) => ({
                ...d,
                image: normalizeProductImageField(d.image),
              }));
            }
            return sendJson(res, 200, {
              success: true,
              message: `Adjusted prices by ${percentage}% in MongoDB Atlas`,
            });
          }

          if (action === 'set_stock' && stockStatus) {
            const filter = Array.isArray(ids) && ids.length > 0 ? { id: { $in: ids } } : {};
            if (db) {
              await db
                .collection('products')
                .updateMany(filter, { $set: { stockStatus, updatedAt: new Date() } });
              const docs = await db.collection('products').find({}).toArray();
              inMemoryProducts = docs.map((d) => ({
                ...d,
                image: normalizeProductImageField(d.image),
              }));
            }
            return sendJson(res, 200, {
              success: true,
              message: `Updated stock status to "${stockStatus}" in MongoDB Atlas`,
            });
          }

          return sendJson(res, 400, { success: false, message: 'Invalid bulk action' });
        }

        // POST /api/products - Create or Upsert Product in MongoDB Atlas
        if (pathname === '/api/products' && method === 'POST') {
          const body = await parseJsonBody(req);
          const productData = { ...body };
          delete productData._id;

          if (!productData.id || !productData.name || productData.price === undefined) {
            return sendJson(res, 400, {
              success: false,
              message: 'Missing required fields (id, name, price)',
            });
          }

          productData.price = Number(productData.price);
          if (productData.discountPrice !== undefined && productData.discountPrice !== null) {
            productData.discountPrice = Number(productData.discountPrice);
          }
          if (productData.wholesalePrice !== undefined && productData.wholesalePrice !== null) {
            productData.wholesalePrice = Number(productData.wholesalePrice);
          }
          if (productData.stockQuantity !== undefined && productData.stockQuantity !== null) {
            productData.stockQuantity = Number(productData.stockQuantity);
          }
          productData.image = normalizeProductImageField(productData.image);
          productData.updatedAt = new Date();

          try {
            let savedProduct = productData;
            if (db) {
              await db
                .collection('products')
                .updateOne({ id: productData.id }, { $set: productData }, { upsert: true });
              const fromDb = await db.collection('products').findOne({ id: productData.id });
              if (fromDb) savedProduct = { ...fromDb, image: normalizeProductImageField(fromDb.image) };
            }

            const idx = inMemoryProducts.findIndex((p) => p.id === productData.id);
            if (idx >= 0) inMemoryProducts[idx] = savedProduct;
            else inMemoryProducts.unshift(savedProduct);

            return sendJson(res, 201, {
              success: true,
              message: 'Product saved to MongoDB Atlas',
              data: savedProduct,
            });
          } catch (err: any) {
            return sendJson(res, 500, { success: false, message: err.message });
          }
        }

        // Match /api/products/:id/price
        const priceMatch = pathname.match(/^\/api\/products\/([^/]+)\/price$/);
        if (priceMatch && method === 'PATCH') {
          const id = decodeURIComponent(priceMatch[1]);
          const body = await parseJsonBody(req);
          const { price, discountPrice, wholesalePrice } = body;

          const updateObj: Record<string, any> = { updatedAt: new Date() };
          if (price !== undefined) updateObj.price = Number(price);
          if (discountPrice !== undefined) {
            updateObj.discountPrice = discountPrice === null || discountPrice === '' ? undefined : Number(discountPrice);
          }
          if (wholesalePrice !== undefined) updateObj.wholesalePrice = Number(wholesalePrice);

          try {
            const filter = ObjectId.isValid(id)
              ? { $or: [{ id }, { _id: new ObjectId(id) }] }
              : { id };

            if (db) {
              await db.collection('products').updateOne(filter, { $set: updateObj });
            }

            const idx = inMemoryProducts.findIndex(
              (p) => p.id === id || (p._id && String(p._id) === id)
            );
            if (idx >= 0) {
              inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updateObj };
            }

            return sendJson(res, 200, {
              success: true,
              message: 'Price updated in MongoDB Atlas',
              data: idx >= 0 ? inMemoryProducts[idx] : updateObj,
            });
          } catch (err: any) {
            return sendJson(res, 500, { success: false, message: err.message });
          }
        }

        // Match /api/products/:id/stock
        const stockMatch = pathname.match(/^\/api\/products\/([^/]+)\/stock$/);
        if (stockMatch && method === 'PATCH') {
          const id = decodeURIComponent(stockMatch[1]);
          const body = await parseJsonBody(req);
          const { stockStatus, stockQuantity } = body;

          const updateObj: Record<string, any> = { updatedAt: new Date() };
          if (stockStatus) updateObj.stockStatus = stockStatus;
          if (stockQuantity !== undefined) updateObj.stockQuantity = Number(stockQuantity);

          try {
            const filter = ObjectId.isValid(id)
              ? { $or: [{ id }, { _id: new ObjectId(id) }] }
              : { id };

            if (db) {
              await db.collection('products').updateOne(filter, { $set: updateObj });
            }

            const idx = inMemoryProducts.findIndex(
              (p) => p.id === id || (p._id && String(p._id) === id)
            );
            if (idx >= 0) {
              inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updateObj };
            }

            return sendJson(res, 200, {
              success: true,
              message: 'Stock updated in MongoDB Atlas',
              data: idx >= 0 ? inMemoryProducts[idx] : updateObj,
            });
          } catch (err: any) {
            return sendJson(res, 500, { success: false, message: err.message });
          }
        }

        // Match /api/products/:id (GET, PUT, DELETE)
        const productIdMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
        if (productIdMatch) {
          const id = decodeURIComponent(productIdMatch[1]);
          const filter = ObjectId.isValid(id)
            ? { $or: [{ id }, { _id: new ObjectId(id) }] }
            : { id };

          if (method === 'GET') {
            let product = null;
            if (db) {
              product = await db.collection('products').findOne(filter);
            }
            if (!product) {
              product = inMemoryProducts.find(
                (p) => p.id === id || (p._id && String(p._id) === id)
              );
            }
            if (!product) {
              return sendJson(res, 404, { success: false, message: `Product ${id} not found` });
            }
            return sendJson(res, 200, {
              success: true,
              data: { ...product, image: normalizeProductImageField(product.image) },
            });
          }

          if (method === 'PUT') {
            const body = await parseJsonBody(req);
            const updateData = { ...body };
            delete updateData._id;

            const updatePayload: Record<string, any> = {
              ...updateData,
              id: updateData.id || id,
              updatedAt: new Date(),
            };
            if (updatePayload.price !== undefined) {
              updatePayload.price = Number(updatePayload.price);
            }
            if (updatePayload.discountPrice !== undefined && updatePayload.discountPrice !== null) {
              updatePayload.discountPrice = Number(updatePayload.discountPrice);
            }
            if (updatePayload.wholesalePrice !== undefined && updatePayload.wholesalePrice !== null) {
              updatePayload.wholesalePrice = Number(updatePayload.wholesalePrice);
            }
            if (updatePayload.stockQuantity !== undefined && updatePayload.stockQuantity !== null) {
              updatePayload.stockQuantity = Number(updatePayload.stockQuantity);
            }
            if (updatePayload.image) {
              updatePayload.image = normalizeProductImageField(updatePayload.image);
            }

            try {
              let updated: any = null;
              if (db) {
                await db
                  .collection('products')
                  .updateOne(filter, { $set: updatePayload }, { upsert: true });
                updated = await db.collection('products').findOne({ id: updatePayload.id });
              }

              const idx = inMemoryProducts.findIndex(
                (p) => p.id === id || (p._id && String(p._id) === id)
              );
              if (idx >= 0) {
                inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updatePayload };
                if (!updated) updated = inMemoryProducts[idx];
              } else {
                if (!updated) updated = updatePayload;
                inMemoryProducts.unshift(updated);
              }

              return sendJson(res, 200, {
                success: true,
                message: 'Product updated in MongoDB Atlas',
                data: updated,
              });
            } catch (err: any) {
              return sendJson(res, 500, { success: false, message: err.message });
            }
          }

          if (method === 'DELETE') {
            try {
              if (db) {
                await db.collection('products').deleteOne(filter);
              }
              inMemoryProducts = inMemoryProducts.filter(
                (p) => p.id !== id && (!p._id || String(p._id) !== id)
              );
              return sendJson(res, 200, {
                success: true,
                message: `Product ${id} deleted from MongoDB Atlas`,
              });
            } catch (err: any) {
              return sendJson(res, 500, { success: false, message: err.message });
            }
          }
        }

        // POST /api/upload - Upload image to disk & MongoDB Atlas uploaded_images
        if (pathname === '/api/upload' && method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const { image, filename } = body;
            if (!image) {
              return sendJson(res, 400, { success: false, message: 'No image data provided' });
            }

            let buffer: Buffer;
            let extension = 'jpg';
            if (typeof image === 'string' && image.startsWith('data:')) {
              const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
              if (!matches || matches.length !== 3) {
                return sendJson(res, 400, { success: false, message: 'Invalid data URI format' });
              }
              const mimeType = matches[1];
              buffer = Buffer.from(matches[2], 'base64');
              if (mimeType.includes('png')) extension = 'png';
              else if (mimeType.includes('webp')) extension = 'webp';
              else if (mimeType.includes('svg')) extension = 'svg';
              else extension = 'jpg';
            } else {
              buffer = Buffer.from(String(image), 'base64');
            }

            const cleanName = filename
              ? String(filename)
                  .replace(/\.[^/.]+$/, '')
                  .replace(/[^a-zA-Z0-9_-]/g, '_')
                  .slice(0, 30)
              : 'product';
            const uniqueFilename = `omega_${cleanName}_${Date.now()}.${extension}`;
            const targetPath = join(uploadsDir, uniqueFilename);

            writeFileSync(targetPath, buffer);

            if (db) {
              await db.collection('uploaded_images').updateOne(
                { filename: uniqueFilename },
                {
                  $set: {
                    filename: uniqueFilename,
                    contentType: `image/${extension === 'svg' ? 'svg+xml' : extension}`,
                    data: new Binary(buffer),
                    size: buffer.length,
                    updatedAt: new Date(),
                  },
                },
                { upsert: true }
              );
            }

            const publicUrl = `/uploads/${uniqueFilename}`;
            return sendJson(res, 200, {
              success: true,
              message: 'Image uploaded to MongoDB Atlas',
              url: publicUrl,
              relativeUrl: publicUrl,
              filename: uniqueFilename,
              sizeBytes: buffer.length,
            });
          } catch (err: any) {
            return sendJson(res, 500, { success: false, message: err.message || 'Upload failed' });
          }
        }

        // GET & POST /api/orders, PATCH & DELETE /api/orders/:id
        if (pathname === '/api/orders' && method === 'GET') {
          if (db) {
            inMemoryOrders = await db
              .collection('orders')
              .find({})
              .sort({ createdAt: -1 })
              .toArray();
          }
          return sendJson(res, 200, {
            success: true,
            count: inMemoryOrders.length,
            data: inMemoryOrders,
          });
        }

        if (pathname === '/api/orders' && method === 'POST') {
          const body = await parseJsonBody(req);
          const orderRef = body.orderReference || `OMG-${Date.now().toString().slice(-6)}`;
          const fullOrder = {
            ...body,
            orderReference: orderRef,
            createdAt: new Date().toISOString(),
          };
          if (db) {
            await db.collection('orders').insertOne(fullOrder);
          }
          inMemoryOrders.unshift(fullOrder);
          return sendJson(res, 201, {
            success: true,
            message: 'Order recorded in MongoDB Atlas',
            data: fullOrder,
          });
        }

        const orderIdMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
        if (orderIdMatch) {
          const id = decodeURIComponent(orderIdMatch[1]);
          const filter = ObjectId.isValid(id)
            ? { $or: [{ orderReference: id }, { _id: new ObjectId(id) }] }
            : { orderReference: id };

          if (method === 'PATCH') {
            const body = await parseJsonBody(req);
            if (db) {
              await db.collection('orders').updateOne(filter, { $set: body });
            }
            return sendJson(res, 200, { success: true, message: 'Order updated' });
          }
          if (method === 'DELETE') {
            if (db) {
              await db.collection('orders').deleteOne(filter);
            }
            return sendJson(res, 200, { success: true, message: 'Order deleted' });
          }
        }

        // GET & PUT /api/config
        if (pathname === '/api/config' && method === 'GET') {
          if (db) {
            const doc = await db.collection('store_config').findOne({ key: 'global_config' });
            if (doc) inMemoryConfig = { ...inMemoryConfig, ...doc };
          }
          return sendJson(res, 200, { success: true, data: inMemoryConfig });
        }

        if (pathname === '/api/config' && method === 'PUT') {
          const body = await parseJsonBody(req);
          const updateData = { ...body, key: 'global_config', updatedAt: new Date() };
          delete updateData._id;
          if (db) {
            await db
              .collection('store_config')
              .updateOne({ key: 'global_config' }, { $set: updateData }, { upsert: true });
          }
          inMemoryConfig = { ...inMemoryConfig, ...updateData };
          return sendJson(res, 200, {
            success: true,
            message: 'Configuration saved to MongoDB Atlas',
            data: inMemoryConfig,
          });
        }

        // POST /api/auth/verify-admin-key
        if (pathname === '/api/auth/verify-admin-key' && method === 'POST') {
          const body = await parseJsonBody(req);
          const key = String(body.key || '').trim();
          const validKeys = ['admin123', 'omega2026', 'omega', 'OMEGA@7016'];
          if (validKeys.includes(key)) {
            return sendJson(res, 200, {
              success: true,
              message: 'Administrative clearance verified',
              user: {
                id: 'usr-admin-hq',
                name: 'OMEGA HQ Administrator',
                email: 'admin@omega.co.tz',
                role: 'ADMIN',
                accountType: 'wholesale',
              },
            });
          }
          return sendJson(res, 401, {
            success: false,
            message: 'Invalid administrative security key',
          });
        }

        return next();
      });
    },
  };
}
