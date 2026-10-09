import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ExternalLink,
  Edit3,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';

export const ContactPage: React.FC = () => {
  const { storeConfig, updateStoreConfig, resetStoreConfigToDefault } = useStore();
  const [isEditingContact, setIsEditingContact] = useState(false);

  const [contactDraft, setContactDraft] = useState({
    phoneNumber: storeConfig.phoneNumber,
    whatsappNumber: storeConfig.whatsappNumber,
    shopAddress: storeConfig.shopAddress,
    businessHours: storeConfig.businessHours,
    googleMapsUrl: storeConfig.googleMapsUrl,
  });

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('School Booklist / Bulk Stationery Inquiry');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const handleOpenEdit = () => {
    setContactDraft({
      phoneNumber: storeConfig.phoneNumber,
      whatsappNumber: storeConfig.whatsappNumber,
      shopAddress: storeConfig.shopAddress,
      businessHours: storeConfig.businessHours,
      googleMapsUrl: storeConfig.googleMapsUrl,
    });
    setIsEditingContact(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig({
      phoneNumber: contactDraft.phoneNumber.trim() || storeConfig.phoneNumber,
      whatsappNumber:
        contactDraft.whatsappNumber.replace(/\D/g, '') || storeConfig.whatsappNumber,
      shopAddress: contactDraft.shopAddress.trim() || storeConfig.shopAddress,
      businessHours: contactDraft.businessHours.trim() || storeConfig.businessHours,
      googleMapsUrl: contactDraft.googleMapsUrl.trim() || storeConfig.googleMapsUrl,
      isPlaceholderConfig: false,
    });
    setIsEditingContact(false);
  };

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const directWhatsappChatUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello ${storeConfig.businessName}, I have a question regarding stationery availability.`
  )}`;

  const formattedInquiryText = [
    `*${storeConfig.businessName} — Customer Inquiry*`,
    `Name: ${inquiryName.trim() || 'Visitor'}`,
    `Contact: ${inquiryPhone.trim() || 'Not provided'}`,
    `Topic: ${inquirySubject}`,
    `Message: ${inquiryMessage.trim() || 'Please share store availability details.'}`,
  ].join('\n');

  const inquiryWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    formattedInquiryText
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEOHead
        title="Contact Us & Store Location"
        description={`Contact ${storeConfig.businessName} via phone or WhatsApp, view business hours, and find directions on Google Maps.`}
      />

      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
            Store Directory · Editable Placeholders
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Contact &amp; Shop Location
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Reach us by phone, send a direct WhatsApp message, or visit our counter during business hours. All contact placeholders below can be updated by the store owner.
          </p>
        </div>

        <div className="shrink-0">
          {!isEditingContact ? (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="px-4 py-2.5 bg-stone-900 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Contact Placeholders</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingContact(false)}
              className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold rounded-md hover:bg-stone-50"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </div>

      {/* Inline Editor */}
      {isEditingContact && (
        <form
          onSubmit={handleSaveContact}
          className="bg-stone-50 border border-stone-300 rounded-lg p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Edit Store Contact &amp; Location Details
              </h2>
              <p className="text-xs text-stone-600">
                Update the placeholder phone number, WhatsApp order number, address, hours, and Google Maps link.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetStoreConfigToDefault();
                setIsEditingContact(false);
              }}
              className="text-xs font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-800">
                Display Phone Number
              </label>
              <input
                type="text"
                value={contactDraft.phoneNumber}
                onChange={(e) =>
                  setContactDraft({ ...contactDraft, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono-tabular"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-800">
                WhatsApp Business Number (Country Code + Digits, e.g. 919876543210)
              </label>
              <input
                type="text"
                value={contactDraft.whatsappNumber}
                onChange={(e) =>
                  setContactDraft({ ...contactDraft, whatsappNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono-tabular"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-800">
              Shop Street Address
            </label>
            <input
              type="text"
              value={contactDraft.shopAddress}
              onChange={(e) =>
                setContactDraft({ ...contactDraft, shopAddress: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-800">
                Business Hours
              </label>
              <input
                type="text"
                value={contactDraft.businessHours}
                onChange={(e) =>
                  setContactDraft({ ...contactDraft, businessHours: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-800">
                Google Maps Share Link
              </label>
              <input
                type="url"
                value={contactDraft.googleMapsUrl}
                onChange={(e) =>
                  setContactDraft({ ...contactDraft, googleMapsUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-red-800 inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>
      )}

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 6 Columns */}
        <div className="lg:col-span-6 space-y-4">
          {/* Phone */}
          <div className="p-6 bg-white border border-stone-200 rounded-lg flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-stone-900">1. Phone Number</h2>
              <p className="text-base font-bold text-stone-900 font-mono-tabular">
                {storeConfig.phoneNumber}
              </p>
              <p className="text-xs text-stone-500">
                Call our shop counter during business hours for immediate stock checks.
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="p-6 bg-white border border-stone-200 rounded-lg flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h2 className="text-sm font-semibold text-stone-900">
                  2. WhatsApp Business Order Desk
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Configured Number:{' '}
                  <span className="font-mono-tabular font-semibold text-stone-900">
                    +{cleanWhatsappDigits}
                  </span>
                </p>
              </div>
              <a
                href={directWhatsappChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-red-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Store on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="p-6 bg-white border border-stone-200 rounded-lg flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-stone-900">3. Shop Address</h2>
              <p className="text-sm text-stone-800 leading-relaxed">
                {storeConfig.shopAddress}
              </p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="p-6 bg-white border border-stone-200 rounded-lg flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-stone-900">4. Business Hours</h2>
              <p className="text-sm text-stone-800 leading-relaxed">
                {storeConfig.businessHours}
              </p>
            </div>
          </div>

          {/* Google Maps Link */}
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-stone-900">
                5. Google Maps Directions
              </h2>
              <p className="text-xs text-stone-600">
                View our location and get turn-by-turn directions on Google Maps.
              </p>
            </div>
            <a
              href={storeConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white border border-stone-300 text-stone-900 text-xs sm:text-sm font-semibold rounded-md hover:bg-stone-100 transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <span>Open Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right 6 Columns */}
        <div className="lg:col-span-6 bg-stone-50 border border-stone-200 rounded-lg p-6 sm:p-8 space-y-5">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="text-xl font-bold text-stone-900">
              Send a Custom Booklist or Stock Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Looking for a specific school book set, bulk OMEGA exercise book cartons, or office stationery quote? Fill in the details below to open a pre-filled WhatsApp message.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="inq-name"
                  className="block text-xs font-semibold text-stone-800"
                >
                  Your Name
                </label>
                <input
                  id="inq-name"
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="inq-phone"
                  className="block text-xs font-semibold text-stone-800"
                >
                  Phone Number
                </label>
                <input
                  id="inq-phone"
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm font-mono-tabular"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="inq-subject"
                className="block text-xs font-semibold text-stone-800"
              >
                Inquiry Category
              </label>
              <select
                id="inq-subject"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm"
              >
                <option value="School Booklist / Bulk Stationery Inquiry">
                  School Booklist / Bulk Stationery Inquiry
                </option>
                <option value="OMEGA Exercise Books Availability">
                  OMEGA Exercise Books Availability
                </option>
                <option value="Office Registers & Supplies Quote">
                  Office Registers &amp; Supplies Quote
                </option>
                <option value="Store Pickup / Timing Question">
                  Store Pickup / Timing Question
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="inq-message"
                className="block text-xs font-semibold text-stone-800"
              >
                Message / Item List
              </label>
              <textarea
                id="inq-message"
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="List the exercise books, notebooks, or stationery items you need..."
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-sm"
              />
            </div>

            <a
              href={inquiryWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-5 py-3 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Inquiry via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
