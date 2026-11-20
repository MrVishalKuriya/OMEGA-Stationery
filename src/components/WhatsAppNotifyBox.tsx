import React, { useState, useEffect } from 'react';
import {
  BellRing,
  CheckCircle2,
  MessageCircle,
  Phone,
  User,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/store';
import {
  subscribeStockAlertInDb,
  isProductSubscribedForAlert,
  StockAlertSubscription,
} from '@/services/api';

interface WhatsAppNotifyBoxProps {
  product: Product;
  quantity?: number;
  language?: string;
  storeWhatsappDigits?: string;
  compact?: boolean;
  autoFocusInput?: boolean;
  onSubscribed?: (sub: StockAlertSubscription) => void;
}

export const WhatsAppNotifyBox: React.FC<WhatsAppNotifyBoxProps> = ({
  product,
  quantity = 1,
  language = 'en',
  storeWhatsappDigits = '255715268391',
  compact = false,
  autoFocusInput = false,
  onSubscribed,
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [desiredQty, setDesiredQty] = useState<number>(quantity || 1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [existingSub, setExistingSub] = useState<StockAlertSubscription | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);

  useEffect(() => {
    setDesiredQty(quantity || 1);
  }, [quantity]);

  useEffect(() => {
    const sub = isProductSubscribedForAlert(product.id);
    setExistingSub(sub);
    setIsEditingExisting(false);
    setErrorText('');
    if (sub) {
      setWhatsappNumber(sub.whatsappNumber || '');
      setCustomerName(sub.customerName || '');
    }
  }, [product.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!whatsappNumber.trim()) {
      setErrorText(
        language === 'sw'
          ? 'Tafadhali weka namba yako ya WhatsApp (mfano: 0715 268 391)'
          : 'Please enter your WhatsApp number (e.g. 0715 268 391 or +255 715 268 391)'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeStockAlertInDb({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        whatsappNumber: whatsappNumber.trim(),
        customerName: customerName.trim(),
        desiredQuantity: desiredQty,
      });

      if (!res.success) {
        setErrorText(res.message);
        toast.error(res.message);
        return;
      }

      if (res.data) {
        setExistingSub(res.data);
        setIsEditingExisting(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('omega-stock-alert-updated', { detail: res.data })
          );
        }
        onSubscribed?.(res.data);
      }

      toast.success(
        language === 'sw'
          ? 'Taarifa ya WhatsApp imesajiliwa!'
          : 'WhatsApp Back-in-Stock Alert Active!',
        {
          description:
            language === 'sw'
              ? `Tutakutumia ujumbe kwenye ${res.data?.whatsappNumber || whatsappNumber} bidhaa ikirudi.`
              : `We will automatically notify ${res.data?.whatsappNumber || whatsappNumber} as soon as ${product.name} is restocked.`,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const factoryFollowUpMsg = [
    `*OMEGA Stationery Tanzania — Back-in-Stock Priority Request*`,
    `----------------------------------------`,
    `*Product:* ${product.name}`,
    `*SKU:* ${product.sku}`,
    `*Customer WhatsApp:* ${existingSub?.whatsappNumber || whatsappNumber}`,
    existingSub?.customerName ? `*Customer:* ${existingSub.customerName}` : null,
    `*Requested Qty:* ${existingSub?.desiredQuantity || desiredQty} Units`,
    `----------------------------------------`,
    `Please notify me on WhatsApp as soon as this item is back in stock at the factory.`,
  ]
    .filter(Boolean)
    .join('\n');

  const factoryFollowUpUrl = `https://wa.me/${storeWhatsappDigits}?text=${encodeURIComponent(
    factoryFollowUpMsg
  )}`;

  if (existingSub && !isEditingExisting) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                {language === 'sw' ? 'TAARIFA YA WHATSAPP IMEWASHWA' : 'WHATSAPP RESTOCK ALERT ACTIVE'}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5">
                {language === 'sw'
                  ? `Utapokea ujumbe kwenye ${existingSub.whatsappNumber}`
                  : `Automated WhatsApp alert set for ${existingSub.whatsappNumber}`}
              </h4>
              <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
                {language === 'sw'
                  ? 'Mfumo wetu utakutumia taarifa moja kwa moja pindi tu bidhaa hii itakapoingia ghalani.'
                  : `You will receive an automated notification as soon as ${product.name} is back in stock (${existingSub.desiredQuantity || 1} units requested).`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingExisting(true)}
            className="text-[11px] font-mono font-semibold text-emerald-800 hover:text-zinc-900 underline shrink-0 cursor-pointer"
          >
            {language === 'sw' ? 'Badili' : 'Edit'}
          </button>
        </div>

        <div className="pt-2 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10.5px] font-mono text-emerald-800">
            Ref: {existingSub.alertId || 'ACTIVE'}
          </span>
          <a
            href={factoryFollowUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[11px] font-mono font-bold uppercase tracking-wider transition-all shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>
              {language === 'sw' ? 'Uliza Kiwanda Moja kwa Moja' : 'Message Factory Desk'}
            </span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/40 p-4 sm:p-5 space-y-3.5 text-left shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#15803d] flex items-center justify-center shrink-0">
          <BellRing className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
              {language === 'sw' ? 'BIDHAA IMEISHA KWA SASA' : 'CURRENTLY OUT OF STOCK — NOTIFY ME'}
            </span>
            {existingSub && (
              <button
                type="button"
                onClick={() => setIsEditingExisting(false)}
                className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5">
            {language === 'sw'
              ? 'Pata Taarifa ya Moja kwa Moja Kupitia WhatsApp Ikirudi'
              : 'Get an Automated WhatsApp Alert When Back in Stock'}
          </h4>
          {!compact && (
            <p className="text-[11.5px] text-zinc-600 mt-0.5 leading-relaxed">
              {language === 'sw'
                ? 'Weka namba yako ya WhatsApp hapa chini ili upokee ujumbe wa haraka pindi bidhaa hii itakapopatikana.'
                : 'Enter your WhatsApp number below to receive an instant automated restock notification as soon as new cartons arrive from our factory.'}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* WhatsApp Phone Input */}
          <div className="sm:col-span-7 relative">
            <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => {
                setWhatsappNumber(e.target.value);
                if (errorText) setErrorText('');
              }}
              autoFocus={autoFocusInput}
              placeholder={
                language === 'sw'
                  ? 'Namba ya WhatsApp (mf: +255 715 268 391)'
                  : 'WhatsApp Number (e.g. +255 715 268 391)'
              }
              aria-label="WhatsApp phone number for back in stock notification"
              className="w-full pl-8.5 pr-3 py-2.5 rounded-xl bg-white border border-zinc-200 focus:border-[#25D366] focus:outline-none text-xs font-mono text-zinc-900 placeholder:text-zinc-400 transition-colors"
            />
          </div>

          {/* Optional Customer / Business Name */}
          <div className="sm:col-span-5 relative">
            <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={language === 'sw' ? 'Jina / Duka (Hiari)' : 'Your Name / Shop (Optional)'}
              aria-label="Customer or business name"
              className="w-full pl-8.5 pr-3 py-2.5 rounded-xl bg-white border border-zinc-200 focus:border-zinc-900 focus:outline-none text-xs font-sans text-zinc-900 placeholder:text-zinc-400 transition-colors"
            />
          </div>
        </div>

        {errorText && (
          <p className="text-[11px] font-medium text-red-600 font-sans">{errorText}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,211,102,0.28)] transition-all cursor-pointer active:scale-98"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{language === 'sw' ? 'Inasajili...' : 'Registering Alert...'}</span>
            </>
          ) : (
            <>
              <BellRing className="w-4 h-4" />
              <span>
                {language === 'sw'
                  ? 'Nijulishe Kupitia WhatsApp Ikirudi'
                  : 'Notify Me on WhatsApp When Back in Stock'}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default WhatsAppNotifyBox;
