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
      const res = await fetchLiveProducts();
      if (res && res.length > 0) {
        return res;
      }
      return INITIAL_PRODUCTS;
    },
    initialData: () => {
      try {
        const saved = localStorage.getItem('omega_products_v2');
        if (saved) return JSON.parse(saved);
      } catch {}
      return INITIAL_PRODUCTS;
    },
    staleTime: 1000 * 60, // 1 Minute cache freshness
    gcTime: 1000 * 60 * 15, // 15 Minutes in background memory
    refetchOnWindowFocus: true,
  });

  // Optimistic Product Update Mutation
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      return await updateProductInDb(product.id, product);
    },
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY);

      // Optimistically update cache instantly
      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (old = []) =>
        old.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );

      return { previousProducts };
    },
    onError: (_err, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
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
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY);

      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (old = []) =>
        old.map((p) =>
          p.id === id
            ? {
                ...p,
                stockStatus,
                ...(stockQuantity !== undefined ? { stockQuantity } : {}),
              }
            : p
        )
      );

      return { previousProducts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
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
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY);

      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (old = []) =>
        old.map((p) =>
          p.id === id
            ? {
                ...p,
                price,
                ...(discountPrice !== undefined ? { discountPrice } : {}),
                ...(wholesalePrice !== undefined ? { wholesalePrice } : {}),
              }
            : p
        )
      );

      return { previousProducts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
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
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY);

      queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (old = []) =>
        old.filter((p) => p.id !== id)
      );

      return { previousProducts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
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
    updateProduct: updateProductMutation.mutateAsync,
    updateStock: updateStockMutation.mutateAsync,
    updatePrice: updatePriceMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
  };
};
