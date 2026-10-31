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

export const useProductsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchLiveProducts({ forceRefresh: true });
      if (res && res.length > 0) {
        try {
          localStorage.setItem('omega_products_v2', JSON.stringify(res));
        } catch {}
        return res;
      }
      return INITIAL_PRODUCTS;
    },
    placeholderData: () => {
      try {
        const saved = localStorage.getItem('omega_products_v2');
        if (saved) return JSON.parse(saved);
      } catch {}
      return undefined;
    },
    staleTime: 5000, // 5 seconds fresh, then always refetch from MongoDB
    gcTime: 1000 * 60 * 15, // 15 Minutes cache
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
        localStorage.setItem('omega_products_v2', JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem('omega_products_v2', JSON.stringify(context.previousProducts));
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
        localStorage.setItem('omega_products_v2', JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem('omega_products_v2', JSON.stringify(context.previousProducts));
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
        localStorage.setItem('omega_products_v2', JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem('omega_products_v2', JSON.stringify(context.previousProducts));
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
        localStorage.setItem('omega_products_v2', JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem('omega_products_v2', JSON.stringify(context.previousProducts));
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
        localStorage.setItem('omega_products_v2', JSON.stringify(next));
      } catch {}

      return { previousProducts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
        try {
          localStorage.setItem('omega_products_v2', JSON.stringify(context.previousProducts));
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
