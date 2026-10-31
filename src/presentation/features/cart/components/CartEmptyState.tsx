import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Language } from '@/types/store';

interface CartEmptyStateProps {
  language?: Language;
  exploreCatalogText?: string;
}

export const CartEmptyState: React.FC<CartEmptyStateProps> = ({
  language = 'en',
  exploreCatalogText,
}) => {
  return (
    <div className="bg-paper-base min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-[4px] border border-[#E7E5E0] p-10 sm:p-12 text-center max-w-lg w-full shadow-sm">
        <div className="w-20 h-20 bg-paper-base border border-[#E7E5E0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#DC2626]">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <h2 className="font-display text-2xl font-bold text-charcoal-ink mb-2">
          {language === 'sw' ? 'Kikapu chako ni tupu' : 'Your shopping bag is empty'}
        </h2>
        <p className="text-[#3F3F46] font-medium mb-8 text-sm leading-relaxed">
          {language === 'sw'
            ? 'Bado hujaongeza madaftari au vifaa vya stationery kwenye kikapu chako. Tembelea katalogi yetu kuchagua bidhaa za OMEGA.'
            : "Looks like you haven't added any stationery or counter books to your order yet. Explore our catalog to find factory-direct OMEGA supplies."}
        </p>
        <Link
          to="/catalog"
          className="px-8 py-4 rounded-[4px] bg-[#DC2626] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#B91C1C] transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <span>{exploreCatalogText || (language === 'sw' ? 'Angalia Katalogi' : 'Browse Product Catalog')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
export default CartEmptyState;
