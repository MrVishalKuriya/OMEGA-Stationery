import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { CustomerOrderInput, DemoOrderRecord } from '@/types/store';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import { CartEmptyState } from '../components/CartEmptyState';
import { CartItemList } from '../components/CartItemList';
import { CheckoutForm } from '../components/CheckoutForm';

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
    paymentPreference: 'Mobile Money (M-Pesa / Mixx by Yas / Airtel Money)',
    orderNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setGeneratedOrderRecord] = useState<DemoOrderRecord | null>(null);

  const effectiveDeliveryFee =
    formData.fulfillmentType === 'In-Store Pickup' ? 0 : estimatedDelivery;
  const finalTotal = subtotal + effectiveDeliveryFee;
  const currency = storeConfig.currencySymbol || 'TSh';

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
    currency,
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
    return <CartEmptyState language={language} exploreCatalogText={t.exploreCatalog} />;
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen text-[#111113]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full overflow-hidden text-left">
        <SEOHead
          title="Review Order &amp; WhatsApp Checkout — OMEGA"
          description="Submit your writing notebooks and stationery order directly to OMEGA sales specialists in Tanzania."
        />

        <div className="flex items-center justify-between border-b border-[#E7E5E0] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111113]">
              {language === 'sw' ? 'Kikapu & Oda ya WhatsApp' : 'Cart & WhatsApp Checkout'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6B66] mt-1">
              {language === 'sw'
                ? 'Kagua bidhaa ulizochagua kisha tuma oda moja kwa moja kwa wauzaji wetu kupitia WhatsApp.'
                : 'Review your items and send your order directly to our sales desk on WhatsApp.'}
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-bold uppercase tracking-wider cursor-pointer"
          >
            {language === 'sw' ? 'Futa Yote' : 'Clear All'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <CartItemList
            detailedCart={detailedCart}
            currency={currency}
            language={language}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
          />

          {/* Right Column: Customer Info & WhatsApp Order Generator */}
          <CheckoutForm
            formData={formData}
            setFormData={setFormData}
            selectedWhatsAppNumber={selectedWhatsAppNumber}
            setSelectedWhatsAppNumber={setSelectedWhatsAppNumber}
            errors={errors}
            onSubmit={handlePrepareOrderSummary}
            subtotal={subtotal}
            effectiveDeliveryFee={effectiveDeliveryFee}
            finalTotal={finalTotal}
            currency={currency}
            language={language}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};
export default CartAndCheckoutPage;
