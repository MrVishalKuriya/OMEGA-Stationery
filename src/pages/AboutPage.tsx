import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Edit3, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES } from '../types/store';
import { SEOHead } from '../components/SEOHead';
import { IMAGES } from '../data/products';

export const AboutPage: React.FC = () => {
  const { storeConfig, updateStoreConfig, resetStoreConfigToDefault, products } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  const [draft, setDraft] = useState({
    businessName: storeConfig.businessName,
    tagline: storeConfig.tagline,
    aboutIntro: storeConfig.aboutIntro,
    aboutProductRange: storeConfig.aboutProductRange,
    aboutCustomerService: storeConfig.aboutCustomerService,
    aboutValuesText: storeConfig.aboutValues.join('\n'),
  });

  const handleOpenEdit = () => {
    setDraft({
      businessName: storeConfig.businessName,
      tagline: storeConfig.tagline,
      aboutIntro: storeConfig.aboutIntro,
      aboutProductRange: storeConfig.aboutProductRange,
      aboutCustomerService: storeConfig.aboutCustomerService,
      aboutValuesText: storeConfig.aboutValues.join('\n'),
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedValues = draft.aboutValuesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    updateStoreConfig({
      businessName: draft.businessName.trim() || storeConfig.businessName,
      tagline: draft.tagline.trim() || storeConfig.tagline,
      aboutIntro: draft.aboutIntro.trim() || storeConfig.aboutIntro,
      aboutProductRange: draft.aboutProductRange.trim() || storeConfig.aboutProductRange,
      aboutCustomerService:
        draft.aboutCustomerService.trim() || storeConfig.aboutCustomerService,
      aboutValues: cleanedValues.length > 0 ? cleanedValues : storeConfig.aboutValues,
      isPlaceholderConfig: false,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <SEOHead
        title="About Our Bookstore & Stationery Shop"
        description={`Learn about ${storeConfig.businessName}, our range of exercise books, notebooks, pens, and school essentials, and our customer service commitment.`}
      />

      {/* Top Header */}
      <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
            About Us · Configurable Store Profile
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
            {storeConfig.businessName}
          </h1>
          <p className="text-base text-stone-600">{storeConfig.tagline}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="px-4 py-2.5 bg-stone-900 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Store Story &amp; Content</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold rounded-md hover:bg-stone-50"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </div>

      {/* Editable Form Panel */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-stone-50 border border-stone-300 rounded-lg p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Customize Official Business Information
              </h2>
              <p className="text-xs text-stone-600">
                Because official business copy has not yet been provided, you can edit all sections below and save them in your browser.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetStoreConfigToDefault();
                setIsEditing(false);
              }}
              className="text-xs font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Placeholders</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-800">
                Store / Business Name
              </label>
              <input
                type="text"
                value={draft.businessName}
                onChange={(e) => setDraft({ ...draft, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-800">
                Store Tagline
              </label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-800">
              1. Shop Introduction
            </label>
            <textarea
              rows={3}
              value={draft.aboutIntro}
              onChange={(e) => setDraft({ ...draft, aboutIntro: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-800">
              2. Product Range Description
            </label>
            <textarea
              rows={3}
              value={draft.aboutProductRange}
              onChange={(e) => setDraft({ ...draft, aboutProductRange: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-800">
              3. Customer Service Information
            </label>
            <textarea
              rows={3}
              value={draft.aboutCustomerService}
              onChange={(e) => setDraft({ ...draft, aboutCustomerService: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-800">
              4. Business Values (One per line)
            </label>
            <textarea
              rows={4}
              value={draft.aboutValuesText}
              onChange={(e) => setDraft({ ...draft, aboutValuesText: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-red-800 inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save About Page Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Introduction & Visual Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900">01. Shop Introduction</h2>
            <p className="text-base text-stone-700 leading-relaxed">
              {storeConfig.aboutIntro}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900">02. Our Product Range</h2>
            <p className="text-base text-stone-700 leading-relaxed">
              {storeConfig.aboutProductRange}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/catalog?category=${encodeURIComponent(cat)}`}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-md text-xs font-semibold text-stone-800 hover:border-red-700 hover:text-red-700 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900">
              03. Customer Service Information
            </h2>
            <p className="text-base text-stone-700 leading-relaxed">
              {storeConfig.aboutCustomerService}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="rounded-lg overflow-hidden border border-stone-200 bg-stone-100 aspect-[4/3]">
            <img
              src={IMAGES.omegaExerciseBook}
              alt="OMEGA Exercise Book product reference"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Branding &amp; Ownership Note</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              The OMEGA Exercise Book design serves as our visual reference for classic red-and-white school stationery. Store logo text, business name, and contact details are fully configurable so the store owner can apply their official identity at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <section className="pt-10 border-t border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">04. Our Business Values</h2>
            <p className="text-sm text-stone-600 mt-1">
              Guiding principles behind our stationery selection and local customer service.
            </p>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1.5"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storeConfig.aboutValues.map((val, idx) => (
            <div
              key={idx}
              className="p-6 bg-white border border-stone-200 rounded-lg flex items-start gap-4"
            >
              <span className="text-sm font-bold text-red-700 font-mono-tabular shrink-0 mt-0.5">
                0{idx + 1}.
              </span>
              <p className="text-sm sm:text-base text-stone-800 leading-relaxed">{val}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
