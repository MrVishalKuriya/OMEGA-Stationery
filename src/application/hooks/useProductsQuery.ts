import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, StockStatus } from '@/types/store';
import { INITIAL_PRODUCTS } from '@/data/products';
import {
  fetchLiveProducts,
  createProductInDb,
  updateProductInDb,
  updateProductPriceInDb,
  updateProductStockInDb,
  deleteProductFromDb,
} from '@/services/api';

const PRODUCTS_QUERY_KEY = ['products'];
const STORAGE_KEY = 'omega_products_v6';

function getCategoryFallbackImage(item: Partial<Product>): string {
  const text = `${item.name || ''} ${item.category || ''} ${item.quire || ''}`.toLowerCase();
  if (text.includes('q2') || text.includes('192')) {
    return '/products/omega-hardcover-counter-book-q2-192-pages-1200.webp';
  }
  if (text.includes('q4') || text.includes('384')) {
    return '/products/omega-hardcover-counter-book-q4-384-pages-1200.webp';
  }
  if (text.includes('counter') || text.includes('q3') || text.includes('288')) {
    return '/products/omega-hardcover-counter-book-q3-288-pages-1200.webp';
  }
  if (text.includes('bahasha') || text.includes('envelope')) {
    return '/products/omega-heavy-kraft-bahasha-envelopes-a4-pack-of-50-1200.webp';
  }
  if (text.includes('exercise')) {
    return '/products/omega-exercise-book-200-pages-single-line-sl-1200.webp';
  }
  if (text.includes('register') || text.includes('attendance') || text.includes('visitor')) {
    return '/products/omega-security-gate-visitors-register-executive-foil-1200.webp';
  }
  return '/products/omega-hardcover-counter-book-q3-288-pages-1200.webp';
}

function normalizeLiveImage(liveImage: any, fallbackImage: any): any {
  const rawStr = typeof liveImage === 'string' ? liveImage : liveImage?.src || '';
  if (!rawStr) return fallbackImage;
  if (rawStr.includes('/uploads/')) {
    const fname = rawStr.split('/uploads/').pop();
    if (fname) return `/uploads/${fname}`;
  }
  return liveImage;
}

function canonicalizeProducts(liveList: Product[]): Product[] {
  if (!Array.isArray(liveList) || liveList.length === 0) {
    return INITIAL_PRODUCTS;
  }

  const canonicalById = new Map<string, Product>();
  for (const canonical of INITIAL_PRODUCTS) {
    canonicalById.set(canonical.id, canonical);
  }

  const seenIds = new Set<string>();
  const merged: Product[] = [];

  for (const live of liveList) {
    if (!live || !live.id || seenIds.has(live.id)) continue;
    seenIds.add(live.id);

    const canonical = canonicalById.get(live.id);
    if (canonical) {
      merged.push({
        ...canonical,
        ...live,
        price: Number(live.price ?? canonical.price),
        discountPrice:
          live.discountPrice !== undefined && live.discountPrice !== null
            ? Number(live.discountPrice)
            : undefined,
        wholesalePrice:
          live.wholesalePrice !== undefined && live.wholesalePrice !== null
            ? Number(live.wholesalePrice)
            : canonical.wholesalePrice,
        stockStatus: live.stockStatus || canonical.stockStatus,
        stockQuantity:
          live.stockQuantity !== undefined && live.stockQuantity !== null
            ? Number(live.stockQuantity)
            : canonical.stockQuantity,
        image: normalizeLiveImage(live.image, canonical.image),
      });
    } else {
      merged.push({
        ...live,
        price: Number(live.price || 0),
        image: normalizeLiveImage(live.image, getCategoryFallbackImage(live)),
      });
    }
  }

  return merged.length > 0 ? merged : INITIAL_PRODUCTS;
}

function getInitialProducts(): Product[] {
  try {
    localStorage.removeItem('omega_products_v2');
    localStorage.removeItem('omega_products_v3');
    localStorage.removeItem('omega_products_v4');
    localStorage.removeItem('omega_products_v5');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return canonicalizeProducts(parsed);
      }
    }
  } catch {}
  return INITIAL_PRODUCTS;
}

export const useProductsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchLiveProducts({ forceRefresh: true, retries: 1 });
      if (res && res.length > 0) {
        const canonicalized = canonicalizeProducts(res);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(canonicalized));
        } catch {}
        return canonicalized;
      }
      return getInitialProducts();
    },
    initialData: getInitialProducts,
    staleTime: 1000 * 15,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Optimistic Product Create Mutation
  const createProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      return await createProductInDb(product);
    },
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY) || [];

      const next = [newProduct, ...previousProducts.filter((p) => p.id !== newProduct.id)];
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(context.previousProducts));
        } catch {}
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  // Optimistic Product Update Mutation
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      return await updateProductInDb(product.id, product);
    },
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY) || [];

      // Optimistically update cache instantly
      const next = previousProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(context.previousProducts));
        } catch {}
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  // Optimistic Stock Update Mutation
  const updateStockMutation = useMutation({
    mutationFn: async ({
      id,
      stockStatus,
      stockQuantity,
    }: {
      id: string;
      stockStatus: StockStatus;
      stockQuantity?: number;
    }) => {
      return await updateProductStockInDb(id, stockStatus, stockQuantity);
    },
    onMutate: async ({ id, stockStatus, stockQuantity }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY) || [];

      const next = previousProducts.map((p) =>
        p.id === id
          ? {
              ...p,
              stockStatus,
              ...(stockQuantity !== undefined ? { stockQuantity } : {}),
            }
          : p
      );
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(context.previousProducts));
        } catch {}
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  // Optimistic Price Update Mutation
  const updatePriceMutation = useMutation({
    mutationFn: async ({
      id,
      price,
      discountPrice,
      wholesalePrice,
    }: {
      id: string;
      price: number;
      discountPrice?: number;
      wholesalePrice?: number;
    }) => {
      return await updateProductPriceInDb(id, price, discountPrice, wholesalePrice);
    },
    onMutate: async ({ id, price, discountPrice, wholesalePrice }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY) || [];

      const next = previousProducts.map((p) =>
        p.id === id
          ? {
              ...p,
              price,
              ...(discountPrice !== undefined ? { discountPrice } : {}),
              ...(wholesalePrice !== undefined ? { wholesalePrice } : {}),
            }
          : p
      );
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(context.previousProducts));
        } catch {}
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  // Optimistic Delete Mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteProductFromDb(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY) || [];

      const next = previousProducts.filter((p) => p.id !== id);
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(context.previousProducts));
        } catch {}
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });

  return {
    products: query.data || INITIAL_PRODUCTS,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    updateStock: updateStockMutation.mutateAsync,
    updatePrice: updatePriceMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
  };
};
