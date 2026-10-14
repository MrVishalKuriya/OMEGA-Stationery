import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Edit3, Check, RotateCcw, ArrowRight, ShieldCheck, Feather, Truck, Award, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

export const AboutPage: React.FC = () => {
  const { storeConfig, updateStoreConfig, resetStoreConfigToDefault, language } = useStore();
  const t = TRANSLATIONS[language];
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14 w-full max-w-full overflow-hidden">
      <SEOHead
        title="About OMEGA Writing Notebooks &amp; Stationery Tanzania"
        description="Learn about OMEGA, Tanzania's premier manufacturer and distributor of Counter Books, Exercise Books, Kraft Bahasha, and educational paper goods since 1998."
      />

      {/* Top Header */}
      <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">
            {language === 'sw' ? 'Historia na Ubora Wetu' : 'Heritage & Craftsmanship · Est. 1998'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-serif-luxury">
            {language === 'sw' ? 'Kuhusu OMEGA' : 'About OMEGA Writing Notebooks'}
          </h1>
          <p className="text-base text-stone-600 font-medium">
            {language === 'sw' ? storeConfig.taglineSw : storeConfig.tagline}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="px-4 py-2.5 bg-red-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-red-800 transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Store Story</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-stone-50"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </div>

      {/* Inline Editor Form */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-slate-50 border border-slate-300 rounded-2xl p-6 space-y-5 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Customize Business Story &amp; Details
              </h2>
              <p className="text-xs text-slate-600">
                Update the brand statements, introduction, and values.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetStoreConfigToDefault();
                setIsEditing(false);
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Business Name
              </label>
              <input
                type="text"
                value={draft.businessName}
                onChange={(e) => setDraft({ ...draft, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Tagline
              </label>
              <input
                type="text"
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-slate-700">
              Introduction
            </label>
            <textarea
              rows={3}
              value={draft.aboutIntro}
              onChange={(e) => setDraft({ ...draft, aboutIntro: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0f2342] text-white rounded-xl text-sm font-bold uppercase tracking-wider"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Main Story Hero Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-luxury">
            {language === 'sw'
              ? 'Madaftari Yaliyotengenezwa kwa Ajili ya Viongozi na Wasomi wa Tanzania'
              : 'Crafted for Thinkers, Scholars, and Leaders Across Tanzania'}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {language === 'sw' ? storeConfig.aboutIntroSw : storeConfig.aboutIntro}
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {language === 'sw' ? storeConfig.aboutProductRangeSw : storeConfig.aboutProductRange}
          </p>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-6 shadow-xl text-white space-y-4">
            <img
              src="/omega-products/counter-book-q3-288p.jpeg"
              alt="OMEGA Hardcover Counter Book"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-xl"
            />
            <div className="pt-2 text-center">
              <p className="font-serif-luxury text-lg font-bold text-amber-300">
                OMEGA Q3 Executive Counter Book
              </p>
              <p className="text-xs text-slate-300">
                288 Pages · Stiff Hardboard Binding · Thread Sewn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Quality */}
      <div className="pt-8 border-t border-stone-200 space-y-6">
        <h2 className="text-xl font-black text-stone-900 uppercase tracking-wider font-serif-luxury">
          {language === 'sw' ? 'Misingi 4 ya Ubora wa OMEGA' : 'The 4 Pillars of OMEGA Quality'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
              High-GSM Paper
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Thick, high-opacity paper that prevents fountain and gel pen bleed-through.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Stiff Hardcovers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thread-sewn hardboard covers with reinforced cloth spines designed to last for years.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Indigo Precision
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Crystal-clear feint ruling and left red margins conforming to academic standards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Nationwide Logistics
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prompt dispatch across Dar es Salaam and reliable bus cargo parcel freight upcountry.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Service & Ordering Commitment */}
      <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800 space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            {language === 'sw' ? 'Huduma kwa Wateja & Zabuni' : 'Institutional Supply & Service'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
            {language === 'sw' ? 'Ugavi wa Haraka na Bei Nafuu za Kiwandani' : 'Prompt Factory Supply & Nationwide Delivery'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {language === 'sw' ? storeConfig.aboutCustomerServiceSw : storeConfig.aboutCustomerService}
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>{t.exploreCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors border border-slate-700"
          >
            <span>{t.contact}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
