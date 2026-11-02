import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, MessageCircle, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { SEOHead } from '@/components/SEOHead';

interface CartEmptyStateProps {
  language: string;
  exploreCatalogText: string;
}

export const CartEmptyState: React.FC<CartEmptyStateProps> = ({
  language,
  exploreCatalogText,
}) => {
  const quickCategories = [
    { label: 'Counter Books (Q1-Q6)', href: '/catalog?category=Counter+Books' },
    { label: 'Exercise Books', href: '/catalog?category=Exercise+Books' },
    { label: 'Kraft Bahasha', href: '/catalog?category=Bahasha+%26+Envelopes' },
    { label: 'Office Registers', href: '/catalog?category=Registers' },
    { label: 'Wholesale Cartons (20% OFF)', href: '/wholesale' },
  ];

  return (
    <div className="bg-[var(--bg)] min-h-[75vh] flex items-center justify-center relative overflow-hidden py-16 px-4">
      {/* Ambient Radial Pedestal Glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[var(--red)]/15 via-[var(--gold)]/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10 w-full">
        <SEOHead
          title="Shopping Cart &amp; WhatsApp Order — OMEGA"
          description="View items in your order and submit directly to OMEGA sales team via WhatsApp."
        />

        {/* Central High-Contrast Emblem Icon */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 rounded-3xl bg-[var(--surface-1)] border border-[var(--gold)]/40 shadow-xl flex items-center justify-center mx-auto text-[var(--gold)]"
        >
          <ShoppingBag className="w-10 h-10 stroke-[1.75]" />
        </motion.div>

        {/* Editorial Heading */}
        <div className="space-y-2">
          <span className="text-[10.5px] font-mono tracking-widest uppercase text-[var(--gold)] font-bold block">
            {language === 'sw' ? 'KIKAPU KIKO WAZI' : 'SHOPPING CART'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            {language === 'sw' ? 'Kikapu Chako Kiko Wazi' : 'Your Shopping Cart is Empty'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed font-sans">
            {language === 'sw'
              ? 'Hujaweka bidhaa yoyote bado. Chunguza madaftari yetu bora ya OMEGA, vitabu vya leja na bahasha thabiti.'
              : 'You have not added any stationery yet. Explore Tanzania’s benchmark Smyth-sewn counter books, classroom exercise books, and heavy kraft mailers.'}
          </p>
        </div>

        {/* Primary Action Button (Solid Red Pill) */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#D63A3A] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider rounded-full shadow-xl shadow-red-950/40 transition-all cursor-pointer group"
            style={{ backgroundColor: '#D63A3A', color: '#FFFFFF' }}
          >
            <span>{exploreCatalogText || 'Explore Catalogue'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Quick Category Jump Chips */}
        <div className="pt-4 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block font-bold">
            {language === 'sw' ? 'AU ANZA NA AINA HIZI:' : 'OR EXPLORE POPULAR COLLECTIONS:'}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickCategories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.href}
                className="px-3.5 py-1.5 rounded-full bg-[var(--surface-1)] hover:bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)] text-xs font-mono font-bold text-[var(--text)] transition-colors shadow-2xs"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-3.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] flex items-center gap-3">
            <Truck className="w-5 h-5 text-[var(--gold)] shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-[var(--text)]">31 Regions Cargo</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Daily bus parcel waybills</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[var(--gold)] shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-[var(--text)]">70 GSM Pure Bond</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Smyth-sewn 180° lay-flat</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-[var(--text)]">Direct Sales Desk</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">+255 746 268 391</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
