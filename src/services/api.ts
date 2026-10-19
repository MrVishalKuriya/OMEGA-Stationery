import { Product, CustomerOrderInput, DemoOrderRecord } from '../types/store';

// Reads backend URL from environment (e.g. Render Web Service URL)
// Default fallback to MongoDB API server on port 5000
const RAW_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const BACKEND_URL = RAW_URL.replace(/\/+$/, '');

export interface BackendHealthData {
  status: 'UP' | 'DOWN';
  timestamp: string;
  service: string;
  runtime: string;
  uptimeSeconds: number;
  database: {
    engine: string;
    connected: boolean;
    productsCount: number;
    ordersCount: number;
    usersCount?: number;
    totalDocuments?: number;
    databaseName?: string;
    error?: string;
  };
  cache?: {
    engine?: string;
    connected?: boolean;
    mode?: string;
    totalRequests?: number;
    hits?: number;
    misses?: number;
    hitRatioPercent?: number;
    averageLatencyMs?: number;
  };
}

export interface BackendApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

/**
 * Check connectivity and status of the Node.js + MongoDB Atlas backend
 */
export async function checkBackendHealth(): Promise<{ online: boolean; data?: BackendHealthData; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { online: false, error: `Backend responded with HTTP status ${res.status}` };
    }

    const json: BackendApiResponse<BackendHealthData> = await res.json();
    return {
      online: json.success && json.data.status === 'UP',
      data: json.data,
    };
  } catch (err: any) {
    return {
      online: false,
      error: err.name === 'AbortError' ? 'Backend connection timed out (service may be waking up on Render free tier)' : err.message,
    };
  }
}

export type BackendHealth = BackendHealthData;

/**
 * Fetch health data for Admin Dashboard
 */
export async function fetchHealth(): Promise<BackendHealthData | null> {
  const result = await checkBackendHealth();
  return result.data || null;
}

/**
 * Trigger cache flush or sync
 */
export async function flushRedisCache(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/cache/flush`, { method: 'POST' });
    return res.ok;
  } catch {
    return true;
  }
}

/**
 * Synchronize all 33 products into MongoDB collection
 */
export async function syncDatabaseProducts(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Could not connect to MongoDB server' };
  }
}

/**
 * Fetch detailed database management statistics from MongoDB
 */
export async function fetchDatabaseStats(): Promise<any | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/database/stats`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

// Client-side in-memory query cache for fast e-commerce navigation (TTL: 45s)
const clientProductCache = new Map<string, { data: Product[]; expiresAt: number }>();

/**
 * Fetch products from the Node.js + MongoDB backend (Optimized with In-Memory Query Cache)
 */
export async function fetchLiveProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  forceRefresh?: boolean;
}): Promise<Product[] | null> {
  const cacheKey = `cat=${options?.category || 'all'}&q=${options?.search || ''}&feat=${!!options?.featured}`;
  
  if (!options?.forceRefresh) {
    const cached = clientProductCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
  }

  try {
    const params = new URLSearchParams();
    if (options?.category && options.category !== 'All') params.append('category', options.category);
    if (options?.search) params.append('search', options.search);
    if (options?.featured) params.append('featured', 'true');

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BACKEND_URL}/api/products${query}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) return null;

    const json: BackendApiResponse<Product[]> = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      clientProductCache.set(cacheKey, {
        data: json.data,
        expiresAt: Date.now() + 45_000,
      });
      return json.data;
    }
    return null;
  } catch (err) {
    console.info('Node.js Backend not reachable, using localized catalog fallback:', err);
    return null;
  }
}

/**
 * Record a customer order in MongoDB via Node.js backend
 */
export async function submitOrderToBackend(input: CustomerOrderInput & {
  items: DemoOrderRecord['items'];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}): Promise<{ success: boolean; order?: any; error?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return { success: false, error: errJson.message || `HTTP ${res.status}` };
    }

    const json = await res.json();
    return { success: true, order: json.data };
  } catch (err: any) {
    console.warn('Could not sync order to MongoDB backend:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all orders from MongoDB (used by Admin portal / Orders view)
 */
export async function fetchLiveOrders(): Promise<any[] | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    accountType?: 'individual' | 'wholesale' | 'school';
    role?: string;
    initials: string;
  };
}

/**
 * Sign in using Node.js + MongoDB backend
 */
export async function loginUserWithBackend(credentials: {
  email: string;
  password?: string;
  rememberMe?: boolean;
}): Promise<BackendAuthResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password || '',
        rememberMe: credentials.rememberMe ?? true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = await res.json();
    return json;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.info('Backend auth unreachable or timed out, falling back to local session:', err.message);
    return null;
  }
}

/**
 * Register new user in MongoDB via Node.js backend
 */
export async function registerUserWithBackend(userData: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  accountType?: 'individual' | 'wholesale' | 'school';
}): Promise<BackendAuthResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password || '',
        phone: userData.phone || '',
        accountType: userData.accountType || 'individual',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = await res.json();
    return json;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.info('Backend register unreachable or timed out, falling back to local storage:', err.message);
    return null;
  }
}

/**
 * Ask OMEGA AI Stationery Advisor (Powered by MongoDB AI Model)
 */
export async function askStationeryAI(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<{ success: boolean; reply: string; source?: string; recommendedProducts?: Product[] }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return {
      success: false,
      reply: 'Apologies, our AI Stationery service is currently unavailable. Please reach our direct sales hotlines (+255 746 268 391) for immediate quotes.',
    };
  } catch (err: any) {
    return {
      success: false,
      reply: 'Connection timed out. Our team is always on standby on WhatsApp (+255 746 268 391) to help with orders.',
    };
  }
}

/**
 * Parse raw school booklist or tender requirements into matched OMEGA products
 */
export async function parseSchoolBooklist(text: string): Promise<{
  success: boolean;
  parsedCount: number;
  estimatedTotal: number;
  items: Array<{
    rawLine: string;
    quantity: number;
    product: Product;
    unitPrice: number;
    subtotal: number;
  }>;
}> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/parse-booklist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      return await res.json();
    }
    return { success: false, parsedCount: 0, estimatedTotal: 0, items: [] };
  } catch (err) {
    return { success: false, parsedCount: 0, estimatedTotal: 0, items: [] };
  }
}

// =========================================================================
// DIRECT DATABASE CRUD OPERATIONS (ERP SYSTEM ENGINE)
// =========================================================================

/**
 * Create or Upsert Product directly in MongoDB Database
 */
export async function createProductInDb(product: Product): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(product),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Update Product directly in MongoDB Database
 */
export async function updateProductInDb(id: string, product: Partial<Product>): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(product),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Fast inline price update directly in MongoDB
 */
export async function updateProductPriceInDb(id: string, price: number, discountPrice?: number, wholesalePrice?: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}/price`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ price, discountPrice, wholesalePrice }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Update stock status & quantity directly in MongoDB
 */
export async function updateProductStockInDb(id: string, stockStatus: string, stockQuantity?: number): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ stockStatus, stockQuantity }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Delete product directly from MongoDB
 */
export async function deleteProductFromDb(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * ERP Bulk Product Operations (adjust price percentage, change stock status)
 */
export async function bulkUpdateProductsInDb(payload: {
  action: 'adjust_price' | 'set_stock';
  ids?: string[];
  percentage?: number;
  stockStatus?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Fetch live store configuration & web content handles from MongoDB
 */
export async function fetchStoreConfigFromDb(): Promise<any | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/config`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

/**
 * Update Web Content & Store Handles directly in MongoDB Database
 */
export async function saveStoreConfigToDb(config: any): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(config),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Update order status, tracking waybill, and admin notes directly in MongoDB
 */
export async function updateOrderStatusInDb(id: string, update: { status?: string; trackingNumber?: string; adminNotes?: string }): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(update),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Delete order record directly from MongoDB
 */
export async function deleteOrderFromDb(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Database unreachable' };
  }
}

/**
 * Upload Product Image directly to Server & Database
 */
export async function uploadProductImage(
  dataUriOrBase64: string,
  filename?: string
): Promise<{ success: boolean; url?: string; filename?: string; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ image: dataUriOrBase64, filename }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Image upload failed' };
  }
}


