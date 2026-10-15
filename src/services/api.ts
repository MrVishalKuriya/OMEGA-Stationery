import { Product, CustomerOrderInput, DemoOrderRecord } from '../types/store';

// Reads backend URL from environment (e.g. Render Web Service URL)
// Default fallback to local development port 8080
const RAW_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
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
 * Check connectivity and status of the Java Spring Boot + MongoDB backend
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
    // If running with standard Spring Boot without Redis, return simulated ok
    return true;
  }
}

// Client-side in-memory query cache for fast e-commerce navigation (TTL: 45s)
const clientProductCache = new Map<string, { data: Product[]; expiresAt: number }>();

/**
 * Fetch products from the Java Spring Boot + MongoDB backend (Optimized with In-Memory Query Cache)
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
    console.info('Java Backend not reachable, using localized catalog fallback:', err);
    return null;
  }
}

/**
 * Record a customer order in MongoDB via Java Spring Boot backend
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
    console.warn('Could not sync order to Java MongoDB backend:', err.message);
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
 * Sign in using Java Spring Boot + MongoDB backend
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
 * Register new user in MongoDB via Java Spring Boot backend
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

