// OMEGA Stationery Client API & Cache Service
// Communicates with Express + MongoDB + Redis backend with optimistic fallback

export interface BackendHealth {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  database: {
    engine: string;
    connected: boolean;
    mode: string;
    collection: string;
    totalDocuments: number;
  };
  cache: {
    engine: string;
    connected: boolean;
    mode: string;
    totalRequests: number;
    hits: number;
    misses: number;
    hitRatioPercent: number;
    averageLatencyMs: number;
    cachedKeysCount: number;
    lastHitTime: string | null;
  };
}

const API_BASE = '/api';

export async function fetchHealth(): Promise<BackendHealth | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchProductsFromBackend(): Promise<{
  source: string;
  cacheHit: boolean;
  latencyMs: number;
  data: any[];
} | null> {
  try {
    const res = await fetch(`${API_BASE}/products`, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function flushRedisCache(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/cache/flush`, {
      method: 'POST',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function saveOrderToBackend(order: {
  customerName: string;
  phoneNumber: string;
  region?: string;
  items: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
  totalAmount: number;
  notes?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(3500),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
