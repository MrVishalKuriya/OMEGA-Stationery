import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  Phone,
  Truck,
  CreditCard,
  Building,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerOrderInput, DemoOrderRecord } from '../types/store';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

export const CartAndCheckoutPage: React.FC = () => {
  const {
    detailedCart,
    subtotal,
    estimatedDelivery,
    storeConfig,
    language,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    recordDemoOrder,
  } = useStore();

  const t = TRANSLATIONS[language];

  const [selectedWhatsAppNumber, setSelectedWhatsAppNumber] = useState<string>('255715268391');

  const [formData, setFormData] = useState<CustomerOrderInput>({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    fulfillmentType: 'Home Delivery',
    paymentPreference: 'Mobile Money (M-Pesa / Tigo / Airtel)',
    orderNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedOrderRecord, setGeneratedOrderRecord] = useState<DemoOrderRecord | null>(
    null
  );

  const effectiveDeliveryFee =
    formData.fulfillmentType === 'In-Store Pickup' ? 0 : estimatedDelivery;
  const finalTotal = subtotal + effectiveDeliveryFee;

  const readableOrderSummary = useMemo(() => {
    const lines: string[] = [
      `*${storeConfig.businessName} — Order Request*`,
      `----------------------------------------`,
      `Customer Name: ${formData.customerName.trim() || '[Customer Name]'}`,
      `Contact Phone: ${formData.phoneNumber.trim() || '[Phone Number]'}`,
      `Delivery Type: ${formData.fulfillmentType}`,
      `Delivery Location: ${
        formData.fulfillmentType === 'In-Store Pickup'
          ? `In-Store Pickup (${storeConfig.shopAddress})`
          : formData.deliveryAddress.trim() || '[Location / City]'
      }`,
      `Payment Preference: ${formData.paymentPreference}`,
      `----------------------------------------`,
      `*Products Ordered:*`,
    ];

    const currency = storeConfig.currencySymbol || 'TSh';

    detailedCart.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.product.name} (${item.product.sku})`,
        `   Qty: ${item.quantity} × ${currency} ${item.effectiveUnitPrice.toLocaleString()} = ${currency} ${item.lineTotal.toLocaleString()}`
      );
    });

    lines.push(
      `----------------------------------------`,
      `Subtotal: ${currency} ${subtotal.toLocaleString()}`,
      `Delivery Fee: ${effectiveDeliveryFee === 0 ? 'Free / In-Store' : `${currency} ${effectiveDeliveryFee.toLocaleString()}`}`,
      `*Total Amount: ${currency} ${finalTotal.toLocaleString()}*`
    );

    if (formData.orderNotes.trim()) {
      lines.push(`Notes / School: ${formData.orderNotes.trim()}`);
    }

    lines.push(
      `----------------------------------------`,
      `Please confirm availability, wholesale discounts, and delivery time.`
    );

    return lines.join('\n');
  }, [
    storeConfig.businessName,
    storeConfig.shopAddress,
    formData,
    detailedCart,
    subtotal,
    effectiveDeliveryFee,
    finalTotal,
  ]);

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (formData.customerName.trim().length < 2) {
      nextErrors.customerName = language === 'sw'
        ? 'Tafadhali weka jina lako kamili.'
        : 'Please enter your full name (at least 2 characters).';
    }

    const digitsOnly = formData.phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      nextErrors.phoneNumber = language === 'sw'
        ? 'Tafadhali weka namba sahihi ya simu / WhatsApp.'
        : 'Please enter a valid phone or WhatsApp number.';
    }

    if (
      formData.fulfillmentType !== 'In-Store Pickup' &&
      formData.deliveryAddress.trim().length < 4
    ) {
      nextErrors.deliveryAddress = language === 'sw'
        ? 'Tafadhali weka eneo, mji au stendi ya kupokelea mzigo.'
        : 'Please specify your delivery address, city, or regional bus terminal.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const whatsappOrderUrl = `https://wa.me/${selectedWhatsAppNumber}?text=${encodeURIComponent(
    readableOrderSummary
  )}`;

  const handlePrepareOrderSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const rec = recordDemoOrder(formData);
    setGeneratedOrderRecord(rec);
    if (typeof window !== 'undefined') {
      window.open(whatsappOrderUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (detailedCart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <SEOHead
          title="Shopping Cart &amp; WhatsApp Order — OMEGA"
          description="View items in your order and submit directly to OMEGA sales team via WhatsApp."
        />
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {language === 'sw' ? 'Kikapu Chako Kiko Wazi' : 'Your Order List is Empty'}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {language === 'sw'
            ? 'Bofya kitufe hapa chini kutazama madaftari yetu ya OMEGA Quire 2, 3, 4 na bahasha.'
            : 'Explore our catalog to add OMEGA writing notebooks, counter books, and stationery.'}
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0f2342] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#1e3a8a] transition-all shadow-sm"
        >
          <span>{t.exploreCatalog}</span>
        </Link>
      </div>
    );
  }

  const currency = storeConfig.currencySymbol || 'TSh';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-hidden">
      <SEOHead
        title="Review Order &amp; WhatsApp Checkout — OMEGA"
        description="Submit your writing notebooks and stationery order directly to OMEGA sales specialists in Tanzania."
      />

      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'sw' ? 'Kikapu & Oda ya WhatsApp' : 'Cart & WhatsApp Checkout'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'sw'
              ? 'Kagua bidhaa ulizochagua kisha tuma oda moja kwa moja kwa wauzaji wetu kupitia WhatsApp.'
              : 'Review your items and send your order directly to our sales desk on WhatsApp.'}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider"
        >
          {language === 'sw' ? 'Futa Yote' : 'Clear All'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {detailedCart.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {language === 'sw' && item.product.nameSw ? item.product.nameSw : item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span>{item.product.sku}</span>
                    {item.product.quire && (
                      <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                        {item.product.quire}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-800 font-mono-tabular mt-1">
                    {currency} {item.effectiveUnitPrice.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900 font-mono-tabular">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-slate-900 font-mono-tabular">
                    {currency} {item.lineTotal.toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 mt-1 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Endelea Kuangalia Bidhaa Zingine' : 'Continue Shopping Other Products'}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Customer Info & WhatsApp Order Generator */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handlePrepareOrderSummary}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
          >
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>{t.whatsAppOrderingTitle}</span>
            </h2>

            {/* Choose WhatsApp Sales Desk (1 of 3) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.choosePhone}
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    digits: '255715268391',
                    label: 'KANTI BHAI K. HALAI: +255 715 268 391',
                    desc: 'Co-Founder & Managing Director (Executive Desk 01)',
                  },
                  {
                    digits: '255624265480',
                    label: 'VIJESH K. HALAI: +255 624 265 480',
                    desc: 'Co-Founder & Managing Director (Wholesale Desk 02)',
                  },
                  {
                    digits: '255746268391',
                    label: 'Mbeya Branch: +255 746 268 391',
                    desc: 'Mbeya Branch (Soweto SIDO Factory Depot)',
                  },
                  {
                    digits: '255699032777',
                    label: 'Mwanza Branch: +255 699 032 777',
                    desc: 'Mwanza Branch & Lake Zone Regional Desk',
                  },
                ].map((d) => (
                  <label
                    key={d.digits}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedWhatsAppNumber === d.digits
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sales_desk"
                      value={d.digits}
                      checked={selectedWhatsAppNumber === d.digits}
                      onChange={() => setSelectedWhatsAppNumber(d.digits)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{d.label}</p>
                      <p className="text-[11px] text-slate-500">{d.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.fullName} *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Juma Rashid / St. Joseph School"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              {errors.customerName && (
                <p className="text-xs text-rose-600 font-semibold">{errors.customerName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.phoneNumber} *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g. +255 712 345 678"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-rose-600 font-semibold">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Delivery Option */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.deliveryOptions}
              </label>
              <select
                value={formData.fulfillmentType}
                onChange={(e) =>
                  setFormData({ ...formData, fulfillmentType: e.target.value as any })
                }
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Home Delivery">{t.homeDelivery}</option>
                <option value="In-Store Pickup">{t.pickupStore}</option>
                <option value="Upcountry Bus Parcel (Mikoani)">{t.mikoaniParcel}</option>
              </select>
            </div>

            {/* Delivery Location */}
            {formData.fulfillmentType !== 'In-Store Pickup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {t.deliveryLocation} *
                </label>
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  placeholder="e.g. Kariakoo / Sinza / Mwanza (Nyegezi Terminal)"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                {errors.deliveryAddress && (
                  <p className="text-xs text-rose-600 font-semibold">{errors.deliveryAddress}</p>
                )}
              </div>
            )}

            {/* Payment Preference */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.paymentMethod}
              </label>
              <select
                value={formData.paymentPreference}
                onChange={(e) =>
                  setFormData({ ...formData, paymentPreference: e.target.value as any })
                }
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Mobile Money (M-Pesa / Tigo / Airtel)">{t.mobileMoney}</option>
                <option value="Cash on Delivery (COD)">{t.cashOnDelivery}</option>
                <option value="Bank Transfer (CRDB/NMB)">{t.bankTransfer}</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.orderNotes}
              </label>
              <textarea
                rows={2}
                value={formData.orderNotes}
                onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                placeholder="Optional notes or instructions..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Order Totals Summary */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{language === 'sw' ? 'Jumla ya Bidhaa:' : 'Items Subtotal:'}</span>
                <span className="font-bold text-slate-900 font-mono-tabular">
                  {currency} {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'sw' ? 'Gharama ya Usafiri:' : 'Delivery Charges:'}</span>
                <span className="font-bold text-slate-900 font-mono-tabular">
                  {effectiveDeliveryFee === 0 ? 'Free / Pickup' : `${currency} ${effectiveDeliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>{language === 'sw' ? 'Jumla Kuu ya Kulipa:' : 'Total Payable:'}</span>
                <span className="font-mono-tabular text-red-700 text-lg font-black">
                  {currency} {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{t.sendWhatsAppBtn}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
