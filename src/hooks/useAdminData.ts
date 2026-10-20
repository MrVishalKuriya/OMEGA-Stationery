import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLiveOrders, updateOrderStatusInDb, deleteOrderFromDb } from '../services/api';

export const ADMIN_QUERY_KEYS = {
  orders: ['admin', 'orders'] as const,
  products: ['admin', 'products'] as const,
  health: ['admin', 'health'] as const,
};

/**
 * Hook for live orders querying with background refetch & auto-deduplication
 */
export function useAdminOrders(enabled = true) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.orders,
    queryFn: async ({ signal }) => {
      const data = await fetchLiveOrders(signal);
      return data || [];
    },
    enabled,
    staleTime: 1000 * 15, // 15s stale window
    refetchInterval: 1000 * 30, // 30s background poll
    refetchOnWindowFocus: true,
  });
}

/**
 * Optimistic mutation for order status update
 */
export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await updateOrderStatusInDb(orderId, { status });
      if (!res.success) throw new Error(res.message || 'Status update failed');
      return res;
    },
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_QUERY_KEYS.orders });
      const previousOrders = queryClient.getQueryData<any[]>(ADMIN_QUERY_KEYS.orders) || [];

      // Optimistic update (0ms immediate response)
      queryClient.setQueryData<any[]>(ADMIN_QUERY_KEYS.orders, (old) => {
        if (!old) return [];
        return old.map((o) => {
          const match = o.orderId === orderId || o._id === orderId || o.orderReference === orderId;
          return match ? { ...o, status } : o;
        });
      });

      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ADMIN_QUERY_KEYS.orders, context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.orders });
    },
  });
}

/**
 * Optimistic mutation for order waybill & notes
 */
export function useUpdateOrderTrackingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      trackingNumber,
      adminNotes,
    }: {
      orderId: string;
      trackingNumber: string;
      adminNotes: string;
    }) => {
      const res = await updateOrderStatusInDb(orderId, { trackingNumber, adminNotes });
      if (!res.success) throw new Error(res.message || 'Tracking update failed');
      return res;
    },
    onMutate: async ({ orderId, trackingNumber, adminNotes }) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_QUERY_KEYS.orders });
      const previousOrders = queryClient.getQueryData<any[]>(ADMIN_QUERY_KEYS.orders) || [];

      queryClient.setQueryData<any[]>(ADMIN_QUERY_KEYS.orders, (old) => {
        if (!old) return [];
        return old.map((o) => {
          const match = o.orderId === orderId || o._id === orderId || o.orderReference === orderId;
          return match ? { ...o, trackingNumber, adminNotes } : o;
        });
      });

      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ADMIN_QUERY_KEYS.orders, context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.orders });
    },
  });
}

/**
 * Optimistic mutation for order deletion
 */
export function useDeleteOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await deleteOrderFromDb(orderId);
      if (!res.success) throw new Error(res.message || 'Deletion failed');
      return res;
    },
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_QUERY_KEYS.orders });
      const previousOrders = queryClient.getQueryData<any[]>(ADMIN_QUERY_KEYS.orders) || [];

      queryClient.setQueryData<any[]>(ADMIN_QUERY_KEYS.orders, (old) => {
        if (!old) return [];
        return old.filter(
          (o) => !(o.orderId === orderId || o._id === orderId || o.orderReference === orderId)
        );
      });

      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ADMIN_QUERY_KEYS.orders, context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.orders });
    },
  });
}
