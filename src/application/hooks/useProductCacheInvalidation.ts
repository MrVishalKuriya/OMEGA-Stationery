import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/store';
import {
  clearClientProductCache,
  purgeProductCacheInDb,
  resolveImageUrl,
} from '@/services/api';

export const PRODUCTS_QUERY_KEY = ['products'] as const;
export const PRODUCTS_STORAGE_KEY = 'omega_products_v6';

function normalizeProductMedia(product: Product): Product {
  return {
    ...product,
    image: resolveImageUrl(product.image),
    gallery: Array.isArray(product.gallery)
      ? product.gallery.map((g) => resolveImageUrl(g))
      : product.gallery,
  };
}

export interface InvalidateProductsOptions {
  /** Also flush server-side cache before refetching (useful after bulk or external DB changes) */
  purgeServerCache?: boolean;
  /** Optional freshly updated product to seed immediately into cache before the forced refetch settles */
  updatedProduct?: Product;
}

/**
 * Cache-invalidation & forced refetch hook for product mutations.
 * Clears client/API caches, marks the ['products'] React Query cache stale,
 * and forces an immediate active refetch from MongoDB Atlas so all UI views
 * stay 100% synchronized without needing a manual page reload.
 */
export function useProductCacheInvalidation() {
  const queryClient = useQueryClient();
  const [isSyncingCache, setIsSyncingCache] = useState(false);

  const invalidateAndRefetchProducts = useCallback(
    async (options: InvalidateProductsOptions = {}): Promise<Product[]> => {
      const { purgeServerCache = false, updatedProduct } = options;
      setIsSyncingCache(true);

      try {
        // 1. Clear client-side in-memory product response cache
        clearClientProductCache();

        // 2. Immediately seed confirmed product into React Query + localStorage for zero-flicker UI sync
        if (updatedProduct) {
          const normalized = normalizeProductMedia(updatedProduct);
          const current = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY) || [];
          const exists = current.some((p) => p.id === normalized.id);
          const next = exists
            ? current.map((p) => (p.id === normalized.id ? normalized : p))
            : [normalized, ...current];
          queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, next);
          try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(next));
          } catch {}
        }

        // 3. Optionally flush server-side cache before refetching
        if (purgeServerCache) {
          await purgeProductCacheInDb().catch(() => {});
        }

        // 4. Mark all ['products'] queries stale and force an immediate refetch against live MongoDB Atlas
        await queryClient.invalidateQueries({
          queryKey: PRODUCTS_QUERY_KEY,
          refetchType: 'active',
        });
        await queryClient.refetchQueries({
          queryKey: PRODUCTS_QUERY_KEY,
          type: 'active',
        });

        return queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY) || [];
      } finally {
        setIsSyncingCache(false);
      }
    },
    [queryClient]
  );

  return {
    invalidateAndRefetchProducts,
    isSyncingCache,
  };
}
