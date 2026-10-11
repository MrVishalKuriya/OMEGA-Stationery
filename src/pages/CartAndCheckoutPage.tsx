import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  MessageSquare,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerOrderInput, DemoOrderRecord } from '../types/store';
import { SEOHead } from '../components/SEOHead';

export const CartAndCheckoutPage: React.FC = () => {
  const {
    detailedCart,
    subtotal,
    estimatedDelivery,
    storeConfig,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    recordDemoOrder,
  } = useStore();

  const [formData, setFormData] = useState<CustomerOrderInput>({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    fulfillmentType: 'Home Delivery',
    paymentPreference: 'Cash on Delivery (COD)',
    orderNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedOrderRecord, setGeneratedOrderRecord] = useState<DemoOrderRecord | null>(
    null
  );

  const effectiveDeliveryFee =
    formData.fulfillmentType === 'In-Store Pickup' ? 0 : estimatedDelivery;
  const finalTotal = subtotal + effectiveDeliveryFee;
  const amountForFreeDelivery = Math.max(0, storeConfig.freeDeliveryThreshold - subtotal);

  const readableOrderSummary = useMemo(() => {
    const lines: string[] = [
      `*${storeConfig.businessName} — Order Request*`,
      `----------------------------------------`,
      `Customer Name: ${formData.customerName.trim() || '[Enter Name]'}`,
      `Contact Number: ${formData.phoneNumber.trim() || '[Enter Phone Number]'}`,
      `Order Type: ${formData.fulfillmentType}`,
      `Delivery Address: ${
        formData.fulfillmentType === 'In-Store Pickup'
          ? `In-Store Counter Pickup (${storeConfig.shopAddress})`
          : formData.deliveryAddress.trim() || '[Enter Delivery Address]'
      }`,
      `Payment Preference: ${formData.paymentPreference}`,
      `----------------------------------------`,
      `*Ordered Products:*`,
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
      `Items Subtotal: ${currency} ${subtotal.toLocaleString()}`,
      `Delivery Charges: ${effectiveDeliveryFee === 0 ? 'Free' : `${currency} ${effectiveDeliveryFee.toLocaleString()}`}`,
      `*Total Amount Payable: ${currency} ${finalTotal.toLocaleString()}*`
    );

    if (formData.orderNotes.trim()) {
      lines.push(`Customer Notes: ${formData.orderNotes.trim()}`);
    }

    lines.push(
      `----------------------------------------`,
      `Please confirm availability and expected pickup/delivery time.`
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
      nextErrors.customerName = 'Please enter your full name (at least 2 characters).';
    }

    const digitsOnly = formData.phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      nextErrors.phoneNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (
      formData.fulfillmentType === 'Home Delivery' &&
      formData.deliveryAddress.trim().length < 8
    ) {
      nextErrors.deliveryAddress =
        'Please enter your complete street address, landmark, and pincode for delivery.';
    }

    setErrors(nextErrors);
  };

  const handlePrepareOrderSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const rec = recordDemoOrder(formData);
    setGeneratedOrderRecord(rec);
    if (typeof window !== 'undefined') {
      window.open(whatsappOrderUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const whatsappOrderUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    readableOrderSummary
  )}`;

  if (detailedCart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <SEOHead
          title="Shopping Cart"
          description="Review your selected exercise books, notebooks, and stationery items and place your order via WhatsApp."
        />
        <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Browse our catalog of OMEGA exercise books, hardcover registers, pens, and school stationery to start building your order list.
          </p>
        </div>
        <div>
          <Link
            to="/catalog"
            className="px-6 py-3 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={`Shopping Cart (${detailedCart.length} Items) & WhatsApp Ordering`}
        description="Review your stationery cart, calculate delivery charges, and generate a formatted WhatsApp order summary."
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            Shopping Cart &amp; Ordering
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Review quantities, enter your contact details, and generate a readable order summary for WhatsApp verification.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/catalog"
            className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs sm:text-sm font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 space-y-8">
          {/* Free Delivery Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-xs sm:text-sm text-stone-700 flex items-center justify-between gap-4">
            {amountForFreeDelivery > 0 ? (
              <span>
                Add{' '}
                <strong className="font-mono-tabular text-stone-900">
                  {storeConfig.currencySymbol || 'TSh'} {amountForFreeDelivery.toLocaleString()}
                </strong>{' '}
                more to qualify for{' '}
                <strong className="text-stone-900">
                  Free Local Delivery (Orders {storeConfig.currencySymbol || 'TSh'} {storeConfig.freeDeliveryThreshold.toLocaleString()}+)
                </strong>
                , or choose free In-Store Pickup.
              </span>
            ) : (
              <span className="font-medium text-emerald-800">
                Your order qualifies for Free Local Delivery (Subtotal {storeConfig.currencySymbol || 'TSh'}{' '}
                {storeConfig.freeDeliveryThreshold.toLocaleString()}+).
              </span>
            )}
          </div>

          {/* Cart Table */}
          <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
            <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-600 uppercase tracking-wider">
              <span>Selected Stationery Items ({detailedCart.length})</span>
              <span>Subtotal (INR)</span>
            </div>

            <div className="divide-y divide-stone-200">
              {detailedCart.map(({ product, quantity, effectiveUnitPrice, lineTotal }) => (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <Link
                      to={`/product/${product.id}`}
                      className="w-20 h-16 rounded-md overflow-hidden border border-stone-200 bg-stone-100 shrink-0"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="space-y-1">
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm sm:text-base font-semibold text-stone-900 hover:text-red-700 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{product.sku}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular font-medium text-stone-700">
                          {storeConfig.currencySymbol || 'TSh'} {effectiveUnitPrice.toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {/* Stepper */}
                    <div className="inline-flex items-center border border-stone-300 rounded-md bg-white">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className="p-2 text-stone-600 hover:text-stone-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs sm:text-sm font-semibold font-mono-tabular text-stone-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                        className="p-2 text-stone-600 hover:text-stone-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[72px]">
                      <p className="text-sm sm:text-base font-bold text-stone-900 font-mono-tabular">
                        {storeConfig.currencySymbol || 'TSh'} {lineTotal.toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="p-1.5 text-stone-400 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details Form */}
          <form
            onSubmit={handlePrepareOrderSummary}
            noValidate
            className="border border-stone-200 rounded-lg p-5 sm:p-6 bg-white space-y-5"
          >
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-lg font-bold text-stone-900">
                Customer &amp; Delivery Details
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Enter your details below to populate the WhatsApp order summary. No online payment card details are collected.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="customerName"
                  className="block text-xs font-semibold text-stone-800"
                >
                  Full Name <span className="text-red-700">*</span>
                </label>
                <input
                  id="customerName"
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, customerName: e.target.value }));
                    if (errors.customerName) {
                      setErrors((prev) => ({ ...prev, customerName: '' }));
                    }
                  }}
                  placeholder="e.g., Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:border-red-700"
                />
                {errors.customerName && (
                  <p className="text-xs text-red-700">{errors.customerName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-semibold text-stone-800"
                >
                  Phone / WhatsApp Number <span className="text-red-700">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }));
                    if (errors.phoneNumber) {
                      setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                    }
                  }}
                  placeholder="e.g., 9876543210"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 font-mono-tabular focus:outline-none focus:border-red-700"
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-700">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="fulfillmentType"
                  className="block text-xs font-semibold text-stone-800"
                >
                  Order Fulfillment Option
                </label>
                <select
                  id="fulfillmentType"
                  value={formData.fulfillmentType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fulfillmentType: e.target.value as CustomerOrderInput['fulfillmentType'],
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:border-red-700"
                >
                  <option value="Home Delivery">Home Delivery</option>
                  <option value="In-Store Pickup">In-Store Counter Pickup (₹0 Fee)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="paymentPreference"
                  className="block text-xs font-semibold text-stone-800"
                >
                  Payment Preference (Offline / On Delivery)
                </label>
                <select
                  id="paymentPreference"
                  value={formData.paymentPreference}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentPreference:
                        e.target.value as CustomerOrderInput['paymentPreference'],
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:border-red-700"
                >
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  <option value="UPI on Delivery">UPI Scan on Delivery / Pickup</option>
                  <option value="Pay at Store Counter">Pay Cash/UPI at Store Counter</option>
                </select>
              </div>
            </div>

            {formData.fulfillmentType === 'Home Delivery' && (
              <div className="space-y-1.5">
                <label
                  htmlFor="deliveryAddress"
                  className="block text-xs font-semibold text-stone-800"
                >
                  Complete Delivery Address <span className="text-red-700">*</span>
                </label>
                <textarea
                  id="deliveryAddress"
                  rows={3}
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }));
                    if (errors.deliveryAddress) {
                      setErrors((prev) => ({ ...prev, deliveryAddress: '' }));
                    }
                  }}
                  placeholder="House/Flat No., Building Name, Street, Landmark, City & Pincode"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:border-red-700"
                />
                {errors.deliveryAddress && (
                  <p className="text-xs text-red-700">{errors.deliveryAddress}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="orderNotes"
                className="block text-xs font-semibold text-stone-800"
              >
                Special Instructions / School Grade Notes (Optional)
              </label>
              <input
                id="orderNotes"
                type="text"
                value={formData.orderNotes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, orderNotes: e.target.value }))
                }
                placeholder="e.g., Please pack single-line books separately for Class 6"
                className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:border-red-700"
              />
            </div>

            <div className="pt-2 sm:hidden">
              <button
                type="submit"
                className="w-full px-5 py-3.5 bg-[#25D366] text-white text-base font-bold rounded-lg hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Order via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 Columns */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="border border-stone-200 rounded-lg p-6 bg-stone-50 space-y-5">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">
              Order Calculation ({storeConfig.currencySymbol || 'TSh'})
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Products Subtotal</span>
                <span className="font-mono-tabular font-semibold text-stone-900">
                  {storeConfig.currencySymbol || 'TSh'} {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>
                  Estimated Delivery ({formData.fulfillmentType})
                </span>
                <span className="font-mono-tabular font-semibold text-stone-900">
                  {effectiveDeliveryFee === 0
                    ? 'Free (TSh 0)'
                    : `${storeConfig.currencySymbol || 'TSh'} ${effectiveDeliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-stone-900">Total Amount</span>
                <span className="text-2xl font-bold text-[#4a121c] font-mono-tabular">
                  {storeConfig.currencySymbol || 'TSh'} {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* WhatsApp Order Button Only */}
            <div className="pt-3">
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!validateForm()) {
                    e.preventDefault();
                  } else {
                    const rec = recordDemoOrder(formData);
                    setGeneratedOrderRecord(rec);
                  }
                }}
                className="w-full px-6 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-base font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.99]"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
