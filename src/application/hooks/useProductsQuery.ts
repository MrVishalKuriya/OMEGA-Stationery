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
const STORAGE_KEY = 'omega_products_v4';

function canonicalizeProducts(liveList: Product[]): Product[] {
  if (!Array.isArray(liveList) || liveList.length === 0) {
    return INITIAL_PRODUCTS;
  }

  const liveById = new Map<string, Product>();
  for (const item of liveList) {
    if (item && item.id) {
      liveById.set(item.id, item);
    }
  }

  const canonicalIds = new Set<string>();
  const merged: Product[] = INITIAL_PRODUCTS.map((canonical) => {
    canonicalIds.add(canonical.id);
    const live = liveById.get(canonical.id);
    if (!live) return canonical;

    const liveImgStr =
      typeof live.image === 'string' ? live.image : live.image?.src || '';
    const hasCustomUpload =
      liveImgStr.includes('/uploads/') || liveImgStr.startsWith('http');

    return {
      ...live,
      ...canonical,
      image: hasCustomUpload ? live.image : canonical.image,
      stockStatus: live.stockStatus || canonical.stockStatus,
      stockQuantity:
        live.stockQuantity !== undefined
          ? live.stockQuantity
          : canonical.stockQuantity,
    };
  });

  // Append any newly created custom products not in INITIAL_PRODUCTS
  for (const item of liveList) {
    if (item && item.id && !canonicalIds.has(item.id)) {
      merged.push(item);
    }
  }

  return merged;
}

export const useProductsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      try {
        localStorage.removeItem('omega_products_v2');
        localStorage.removeItem('omega_products_v3');
      } catch {}
      const res = await fetchLiveProducts({ forceRefresh: true });
      if (res && res.length > 0) {
        const canonicalized = canonicalizeProducts(res);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(canonicalized));
        } catch {}
        return canonicalized;
      }
      return INITIAL_PRODUCTS;
    },
    placeholderData: () => {
      try {
        localStorage.removeItem('omega_products_v2');
        localStorage.removeItem('omega_products_v3');
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return canonicalizeProducts(parsed);
          }
        }
      } catch {}
      return INITIAL_PRODUCTS;
    },
    staleTime: 5000,
    gcTime: 1000 * 60 * 15,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
