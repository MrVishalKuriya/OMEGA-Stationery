import React, { useState } from 'react';
import { Scale, X, ShoppingBag, CheckCircle2, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductIds?: string[];
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  initialProductIds = ['counter-book-q2-192p', 'counter-book-q3-288p', 'counter-book-q4-384p'],
}) => {
  const { products, addToCart, storeConfig } = useStore();

  const [selectedIds, setSelectedIds] = useState<string[]>(initialProductIds.slice(0, 3));

  if (!isOpen) return null;

  const comparedProducts = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const currency = storeConfig.currencySymbol || 'TZS';

  const handleSelectProduct = (index: number, newId: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = newId;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#fafafa] rounded-2xl shadow-2xl border border-[#e4e4e7] flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#111113] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#dc2626]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-bold text-white tracking-wide">
                  Notebook &amp; Stationery Comparison
                </h3>
                <span className="heimplanet-tag text-[9px] border-white/30 text-stone-200">
                  [ SIDE-BY-SIDE MATRIX ]
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Compare Quires, Pages, GSM paper grade, ruling, and packaging counts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Matrix Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-white rounded-2xl border border-[#e4e4e7] overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e4e4e7] bg-[#fafafa]">
                  <th className="p-3 sm:p-4 text-stone-500 font-bold uppercase tracking-wider text-[11px] w-1/4">
                    Specification
                  </th>
                  {comparedProducts.map((p, idx) => (
                    <th key={p.id} className="p-3 sm:p-4 w-1/4 align-top">
                      <select
                        value={p.id}
                        onChange={(e) => handleSelectProduct(idx, e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-[#e4e4e7] bg-white text-xs font-bold text-[#111113] focus:outline-none mb-2"
                      >
                        {products.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                      <div className="aspect-[4/3] rounded-lg bg-[#fafafa] border border-[#e4e4e7] p-2 flex items-center justify-center mb-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-bold text-[#14182B] truncate">{p.name}</p>
                      <p className="font-mono text-sm font-black text-[#111113] mt-1">
                        {currency} {(p.discountPrice || p.price).toLocaleString()}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7]">
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-stone-600 bg-[#fafafa]/50">
                    Category
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 sm:p-4 text-stone-800 font-medium">
                      {p.category}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 sm:p-4 font-bold text-stone-600 bg-[#fafafa]/50">
                    Quire / Page Count
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 sm:p-4 font-mono font-bold text-[#111113]">
                      {p.quire ? `${p.quire} (${p.pageCount || '—'})` : p.pageCount || 'Standard'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 sm:p-4 font-bold text-stone-600 bg-[#fafafa]/50">
                    Packaging (Box Count)
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 sm:p-4 font-semibold text-emerald-800">
                      {p.packaging || 'Factory Standard'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 sm:p-4 font-bold text-stone-600 bg-[#fafafa]/50">
                    Binding &amp; Cover
                  </td>
                  {comparedProducts.map((p) => {
                    const bind = p.specifications.find((s) => s.label.toLowerCase().includes('bind'))?.value || p.binding || 'Thread Sewn';
                    return (
                      <td key={p.id} className="p-3 sm:p-4 text-stone-700">
                        {bind}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 sm:p-4 font-bold text-stone-600 bg-[#fafafa]/50">
                    Paper Grade &amp; GSM
                  </td>
                  {comparedProducts.map((p) => {
                    const paper = p.specifications.find((s) => s.label.toLowerCase().includes('paper'))?.value || p.paperType || '70 GSM High Opacity';
                    return (
                      <td key={p.id} className="p-3 sm:p-4 text-stone-700">
                        {paper}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="p-3 sm:p-4 font-bold text-stone-600 bg-[#fafafa]/50">
                    Wholesale Price
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 sm:p-4 font-mono font-bold text-[#2A9D8F]">
                      {p.wholesalePrice ? `${currency} ${p.wholesalePrice.toLocaleString()}` : 'Contact Desk'}
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#fafafa]/30">
                  <td className="p-3 sm:p-4 font-bold text-stone-600">Action</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 sm:p-4">
                      <button
                        type="button"
                        onClick={() => addToCart(p.id, 1)}
                        className="w-full py-2 px-3 rounded-lg btn-indra-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all aardvark-btn-spring"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
