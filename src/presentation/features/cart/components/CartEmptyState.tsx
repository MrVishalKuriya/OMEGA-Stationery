import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

interface CartEmptyStateProps {
  language: string;
  exploreCatalogText: string;
}

export const CartEmptyState: React.FC<CartEmptyStateProps> = ({
  language,
  exploreCatalogText,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
      <SEOHead
        title="Shopping Cart &amp; WhatsApp Order — OMEGA"
        description="View items in your order and submit directly to OMEGA sales team via WhatsApp."
      />
      <div className="w-16 h-16 bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#9E3618] shadow-xs">
        <ShoppingBag className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-[#26130F]">
        {language === 'sw' ? 'Kikapu Chako Kiko Wazi' : 'Your Order List is Empty'}
      </h1>
      <p className="text-sm text-[#7D685E] max-w-md mx-auto">
        {language === 'sw'
          ? 'Bofya kitufe hapa chini kutazama madaftari yetu ya OMEGA Quire 2, 3, 4 na bahasha.'
          : 'Explore our catalog to add OMEGA writing notebooks, counter books, and stationery.'}
      </p>
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#9E3618] hover:bg-[#6B140B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm"
      >
        <span>{exploreCatalogText}</span>
      </Link>
    </div>
  );
};
