import React from 'react';

export const ProductTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3.5 bg-white border border-stone-100 rounded-xl space-x-4"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-stone-200 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-3.5 bg-stone-200 rounded w-1/3" />
              <div className="h-2.5 bg-stone-100 rounded w-1/4" />
            </div>
          </div>
          <div className="hidden sm:block w-24 h-3 bg-stone-100 rounded" />
          <div className="w-20 h-4 bg-stone-200 rounded" />
          <div className="w-16 h-6 bg-stone-100 rounded-full" />
          <div className="w-12 h-6 bg-stone-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export const OrdersGridSkeleton: React.FC<{ cards?: number }> = ({ cards = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="space-y-1">
              <div className="h-3 bg-stone-200 rounded w-24" />
              <div className="h-2 bg-stone-100 rounded w-16" />
            </div>
            <div className="w-24 h-6 bg-stone-200 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-stone-100 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/2" />
            <div className="h-3 bg-stone-100 rounded w-2/3" />
          </div>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div className="h-4 bg-stone-200 rounded w-28" />
            <div className="w-32 h-8 bg-stone-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
