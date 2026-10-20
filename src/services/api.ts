import { Product, CustomerOrderInput, DemoOrderRecord } from '../types/store';

/**
 * Detects if the current environment is a public HTTPS origin trying to access a loopback address space.
 * Chrome Private Network Access (PNA) and Mixed Content restrictions strictly forbid
 * public HTTPS origins (such as https://omegastationery.vercel.app) from accessing http://localhost.
 */
function isLoopbackTarget(url: string): boolean {
  return url.includes('localhost') || url.includes('127.0.0.1') || url.startsWith('http://[::1]');
}

/**
 * Detects if the current environment is a public HTTPS origin trying to access a loopback address space.
 * Chrome Private Network Access (PNA) and Mixed Content restrictions strictly forbid
 * public HTTPS origins (such as https://omegastationery.vercel.app) from accessing http://localhost.
 */
export function isLoopbackRestricted(url: string = BACKEND_URL): boolean {
  if (typeof window === 'undefined') return false;
  const isHttps = window.location.protocol === 'https:';
  const isNotLocalhostHost = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  return isHttps && isNotLocalhostHost && isLoopbackTarget(url);
}

function resolveBackendUrl(): string {
  const isBrowser = typeof window !== 'undefined';
  const isRemoteHttps = isBrowser && window.location.protocol === 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  if (isBrowser) {
    const saved = localStorage.getItem('OMEGA_BACKEND_URL');
    if (saved && saved.trim()) {
      let clean = saved.trim().replace(/\/+$/, '');
      if (clean.endsWith('/api')) clean = clean.slice(0, -4);
      if (isRemoteHttps && isLoopbackTarget(clean)) {
        try { localStorage.removeItem('OMEGA_BACKEND_URL'); } catch {}
      } else {
        return clean;
      }
    }
  }

  const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (clean.endsWith('/api')) clean = clean.slice(0, -4);
    if (!(isRemoteHttps && isLoopbackTarget(clean))) {
      return clean;
    }
  }

  if (isBrowser) {
    const isLocalhostHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhostHost) {
      return 'http://localhost:5000';
    }
    return 'https://omega-stationery-backend.onrender.com';
  }

  return 'https://omega-stationery-backend.onrender.com';
}

export let BACKEND_URL = resolveBackendUrl();

export function setCustomBackendUrl(url: string): void {
  const clean = url.trim().replace(/\/+$/, '');
  BACKEND_URL = clean;
  if (typeof window !== 'undefined') {
    if (clean) {
      localStorage.setItem('OMEGA_BACKEND_URL', clean);
    } else {
      localStorage.removeItem('OMEGA_BACKEND_URL');
    }
  }
}

export function isBackendConfigured(): boolean {
  return Boolean(BACKEND_URL) && !isLoopbackRestricted(BACKEND_URL);
}

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
    mode?: string;
    connected?: boolean;
    isLive?: boolean;
    status?: 'ONLINE' | 'ACTIVE_FALLBACK' | 'ERROR';
    redisUrl?: string;
    redisError?: string | null;
    cachedKeysCount?: number;
    totalRequests?: number;
    hits?: number;
    misses?: number;
    hitRatioPercent?: number;
    averageLatencyMs?: number;
    lastHitTime?: string | null;
    lastTestResult?: {
      success: boolean;
      latencyMs: number;
      timestamp: string;
      engine?: string;
    };
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
  if (!BACKEND_URL) {
    return {
      online: false,
      error: 'Backend URL is not configured. Set VITE_BACKEND_URL in Vercel to your deployed backend URL (e.g. Render).',
    };
  }

  if (isLoopbackRestricted(BACKEND_URL)) {
    return {
      online: false,
      error: 'Access to localhost:5000 is blocked from public HTTPS domains by browser Private Network Access policy. Deploy backend and set VITE_BACKEND_URL in Vercel.',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
export async function flushRedisCache(): Promise<{ success: boolean; message: string; details?: any }> {
  if (!isBackendConfigured()) {
    return { success: false, message: 'Backend not connected or loopback restricted on public domain' };
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/cache/flush`, { method: 'POST' });
    const json = await res.json();
    return {
      success: json.success ?? res.ok,
      message: json.message || (res.ok ? 'Cache flushed successfully' : 'Failed to flush cache'),
      details: json.details
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to cache flush endpoint' };
  }
}

/**
 * Execute a live sub-millisecond cache benchmark test
 */
export async function testLiveCacheBenchmark(): Promise<{
  success: boolean;
  message: string;
  data?: {
    isLive: boolean;
    latencyMs: number;
    engine: string;
    connectedToRedis: boolean;
    redisUrl?: string;
    redisError?: string | null;
    cachedKeysCount: number;
    timestamp: string;
  };
}> {
  if (!isBackendConfigured()) {
    return { success: false, message: 'Backend not connected or loopback restricted on public domain' };
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/cache/test`, { method: 'POST' });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Cache benchmark call failed',
    };
  }
}

/**
 * Attempt Redis reconnection on demand
 */
export async function reconnectRedisServer(): Promise<{
  success: boolean;
  message: string;
  connected?: boolean;
  error?: string;
  engine?: string;
}> {
  if (!isBackendConfigured()) {
    return { success: false, message: 'Backend not connected or loopback restricted on public domain' };
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/cache/reconnect`, { method: 'POST' });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to trigger Redis reconnect',
    };
  }
}

/**
 * Fetch dedicated cache diagnostics & telemetry
 */
export async function fetchCacheStats(): Promise<any | null> {
  if (!isBackendConfigured()) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/cache/stats`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

/**
 * Synchronize all 33 products into MongoDB collection
 */
export async function syncDatabaseProducts(): Promise<{ success: boolean; message: string; count?: number }> {
  if (!isBackendConfigured()) {
    return { success: false, message: 'Cloud backend is not connected. Configure VITE_BACKEND_URL in Vercel settings.' };
  }
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
  if (!isBackendConfigured()) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/database/stats`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

// Client-side in-memory query cache for fast e-commerce navigation (TTL: 15s)
const clientProductCache = new Map<string, { data: Product[]; expiresAt: number }>();

export function clearClientProductCache(): void {
  clientProductCache.clear();
}

/**
 * Fetch products from the Node.js + MongoDB backend (Optimized with In-Memory Query Cache)
 */
export async function fetchLiveProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  forceRefresh?: boolean;
}): Promise<Product[] | null> {
  if (!isBackendConfigured()) {
    return null;
  }

  const cacheKey = `cat=${options?.category || 'all'}&q=${options?.search || ''}&feat=${!!options?.featured}`;
  
  if (options?.forceRefresh) {
    clientProductCache.clear();
  } else {
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
    if (options?.forceRefresh) params.append('force', 'true');
    params.append('_t', String(Date.now()));

    const query = `?${params.toString()}`;
    const res = await fetch(`${BACKEND_URL}/api/products${query}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    if (!res.ok) return null;

    const json: BackendApiResponse<Product[]> = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      clientProductCache.set(cacheKey, {
        data: json.data,
        expiresAt: Date.now() + 15_000,
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
  if (!isBackendConfigured()) {
    return { success: false, error: 'Live backend offline (Order saved in browser demo orders).' };
  }
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
  if (!isBackendConfigured()) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders?_t=${Date.now()}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
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
  if (!isBackendConfigured()) return null;
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
  if (!isBackendConfigured()) return null;
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
  if (!isBackendConfigured()) {
    return {
      success: false,
      reply: 'OMEGA AI assistant is offline (backend not connected). For instant assistance, please reach our sales team on WhatsApp: +255 746 268 391.',
    };
  }
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
  if (!isBackendConfigured()) {
    return { success: false, parsedCount: 0, estimatedTotal: 0, items: [] };
  }
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/config?_t=${Date.now()}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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
  if (!isBackendConfigured()) return { success: false, message: 'Cloud backend not configured' };
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


