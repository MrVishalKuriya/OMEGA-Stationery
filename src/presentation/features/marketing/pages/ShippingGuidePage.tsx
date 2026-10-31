import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  MapPin,
  Clock,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';

export const ShippingGuidePage: React.FC = () => {
  const { language } = useStore();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regionsData = [
    { name: 'Dar es Salaam', zone: 'coastal', terminal: 'Magufuli Bus Terminal / Kariakoo', buses: 'Direct Courier / Daily Boda', transit: 'Same-Day (2–4 Hours)' },
    { name: 'Mbeya', zone: 'highlands', terminal: 'Soweto SIDO Central Works / Nanenane', buses: 'Factory Direct Pickup', transit: 'Instant Pickup' },
    { name: 'Arusha', zone: 'northern', terminal: 'Arusha Central Bus Stand', buses: 'BM Coach, Tilisho, Shabiby', transit: '24 Hours' },
    { name: 'Mwanza', zone: 'lake', terminal: 'Nyegezi Bus Stand', buses: 'Shabiby, Ally’s Star, BM Coach', transit: '24–36 Hours' },
    { name: 'Dodoma', zone: 'central', terminal: 'Nane Nane Bus Terminal', buses: 'Shabiby, BM Coach, Kimbinyiko', transit: 'Same-Day / 12 Hours' },
    { name: 'Kilimanjaro (Moshi)', zone: 'northern', terminal: 'Moshi Central Bus Stand', buses: 'Tilisho, BM Coach, Extra Luxury', transit: '24 Hours' },
    { name: 'Morogoro', zone: 'coastal', terminal: 'Msamvu Bus Terminal', buses: 'Abood, BM Coach, Shabiby', transit: 'Same-Day (4–6 Hours)' },
    { name: 'Tanga', zone: 'coastal', terminal: 'Kange Bus Stand', buses: 'Simba Mtoto, Tahmeed, BM Coach', transit: '24 Hours' },
    { name: 'Iringa', zone: 'highlands', terminal: 'Igumbilo Bus Terminal', buses: 'New Force, Rungwe Express, Saibaba', transit: '12 Hours' },
    { name: 'Ruvuma (Songea)', zone: 'highlands', terminal: 'Songea Central Stand', buses: 'Super Feo, New Force', transit: '24 Hours' },
    { name: 'Shinyanga', zone: 'lake', terminal: 'Shinyanga Bus Stand', buses: 'Ally’s Star, Shabiby', transit: '24 Hours' },
    { name: 'Tabora', zone: 'western', terminal: 'Tabora Central Stand', buses: 'Al Saedy, Shabiby', transit: '24 Hours' },
    { name: 'Kigoma', zone: 'western', terminal: 'Mwanga Bus Stand', buses: 'Adventure, Saratoga', transit: '36–48 Hours' },
    { name: 'Kagera (Bukoba)', zone: 'lake', terminal: 'Bukoba Central Stand', buses: 'Frester, Ally’s Star', transit: '36 Hours' },
    { name: 'Mara (Musoma)', zone: 'lake', terminal: 'Musoma Bus Stand', buses: 'Zakaria, Ally’s Star', transit: '36 Hours' },
    { name: 'Zanzibar (Unguja)', zone: 'islands', terminal: 'Malindi Port Ferry Cargo', buses: 'Azam Marine Cargo Ferry', transit: 'Same-Day / 24 Hours' },
    { name: 'Mtwara', zone: 'southern', terminal: 'Mangamba Bus Stand', buses: 'Machame, Butiama', transit: '24 Hours' },
    { name: 'Njombe', zone: 'highlands', terminal: 'Njombe Central Stand', buses: 'New Force, Rungwe Express', transit: '12 Hours' },
    { name: 'Songwe (Vwawa/Tunduma)', zone: 'highlands', terminal: 'Tunduma Border Terminal', buses: 'Local Courier / Rungwe Express', transit: 'Same-Day (3 Hours)' },
  ];

  const filteredRegions = regionsData.filter((r) => {
    const matchesZone = selectedZone === 'all' || r.zone === selectedZone;
    const matchesQuery = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.terminal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesQuery;
  });

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#111113]">
      <SEOHead
        title="Nationwide Bus Parcel Shipping Guide & Waybill Tracking | OMEGA Tanzania"
        description="Comprehensive guide to OMEGA stationery bus parcel dispatch across all 31 regions of Tanzania via Shabiby, BM Coach, Abood, New Force, and Saibaba."
      />

      {/* 1. Photographic Hero with Reduced Dark Filter & Warm Light Filter */}
      <section className="relative overflow-hidden w-full bg-[#1B1B1E] text-white py-16 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 brightness-110 contrast-105 pointer-events-none"
          style={{ backgroundImage: `url('/hero-desk-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/65 via-[#111113]/45 to-[#111113]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-[#F9F8F6]/15 to-white/25 mix-blend-soft-light pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.22),transparent_65%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-[2px] bg-[#DC2626] text-white text-[11px] font-bold uppercase tracking-widest">
              <span>Nationwide Regional Logistics Directory</span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {language === 'sw' ? 'Mwongozo wa Usafirishaji wa' : 'Nationwide Bus Parcel Dispatch &'} <br />
              <span className="text-[#DC2626]">
                {language === 'sw' ? 'Mizigo Mikoani Tanzania.' : 'Waybill Logistics Directory.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal max-w-2xl">
              {language === 'sw'
                ? 'Jinsi OMEGA inavyofikisha katoni zako za madaftari katika mkoa wowote Tanzania ndani ya saa 24–48 kwa usalama, stakabadhi rasmi ya waybill, na mawasiliano ya dereva.'
                : 'Direct factory carton dispatch from Mbeya Works and Kariakoo Commercial Hub to your local town bus terminal. Fast, secure, and fully tracked via bus waybill SMS.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Crimson Red Callout Strip with Upward White Triangle Notch */}
      <section className="relative bg-[#D62828] text-white py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl text-left">
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white">
              ALL 31 REGIONS SERVED DAILY VIA REGISTERED BUS PARCEL WAYBILLS
            </h2>
            <p className="text-xs text-white/85 leading-relaxed">
              Every carton is strapped in heavy waterproof film and booked with instant WhatsApp waybill photo confirmation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/tracking"
              className="px-6 py-2.5 bg-white text-[#111113] hover:bg-zinc-100 text-[11px] font-bold uppercase tracking-[0.14em] rounded-[2px] transition-colors"
            >
              TRACK WAYBILL
            </Link>
          </div>
        </div>

        <div className="absolute -bottom-[1px] left-12 sm:left-24 lg:left-36 w-0 h-0 border-l-[26px] border-l-transparent border-r-[26px] border-r-transparent border-b-[18px] border-b-white">
          <span className="absolute -left-1.5 top-1.5 text-[10px] text-zinc-400 font-bold leading-none select-none">
            ⌄
          </span>
        </div>
      </section>

      {/* 3. 4-Step Dispatch Workflow */}
      <section className="py-14 bg-white border-b border-[#EEEEEE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DC2626] block">
              THE WAYBILL PROCEDURE
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111113]">
              How Your Order Moves from Factory to Your Hands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-l border-[#EEEEEE]">
            <div className="p-6 bg-white border-r border-b border-[#EEEEEE] space-y-2">
              <span className="text-xs font-mono font-bold text-[#DC2626]">STEP 01</span>
              <h3 className="font-bold text-sm text-[#111113]">Packing &amp; Strapping</h3>
              <p className="text-xs text-[#77767B]">Cartons are wrapped in waterproof protective tape with bold consignee labeling.</p>
            </div>

            <div className="p-6 bg-white border-r border-b border-[#EEEEEE] space-y-2">
              <span className="text-xs font-mono font-bold text-[#DC2626]">STEP 02</span>
              <h3 className="font-bold text-sm text-[#111113]">Bus Terminal Drop-off</h3>
              <p className="text-xs text-[#77767B]">Delivered directly to Shabiby, BM Coach, Abood, or New Force dispatch offices.</p>
            </div>

            <div className="p-6 bg-white border-r border-b border-[#EEEEEE] space-y-2">
              <span className="text-xs font-mono font-bold text-[#DC2626]">STEP 03</span>
              <h3 className="font-bold text-sm text-[#111113]">Waybill Photo on WhatsApp</h3>
              <p className="text-xs text-[#77767B]">You receive instant photo proof of the bus parcel receipt and tracking code.</p>
            </div>

            <div className="p-6 bg-white border-r border-b border-[#EEEEEE] space-y-2">
              <span className="text-xs font-mono font-bold text-[#DC2626]">STEP 04</span>
              <h3 className="font-bold text-sm text-[#111113]">Collection at Terminal</h3>
              <p className="text-xs text-[#77767B]">Present your ID and SMS tracking number at your town's bus office to claim your parcel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Regional Terminal Directory */}
      <section className="py-16 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DC2626] block">
                31 REGIONS COVERED
              </span>
              <h2 className="text-2xl font-extrabold text-[#111113]">
                Regional Transit Times &amp; Terminals
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#77767B] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search region or town..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] focus:border-[#DC2626] rounded-[2px] text-xs text-[#111113] focus:outline-none"
              />
            </div>
          </div>

          {/* Zone Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Regions' },
              { id: 'lake', label: 'Lake Zone' },
              { id: 'northern', label: 'Northern Zone' },
              { id: 'highlands', label: 'Southern Highlands' },
              { id: 'coastal', label: 'Coastal Zone' },
              { id: 'central', label: 'Central Zone' },
              { id: 'western', label: 'Western Zone' },
              { id: 'islands', label: 'Zanzibar' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedZone(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer ${
                  selectedZone === tab.id
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-white text-[#111113] border border-[#E5E7EB] hover:border-[#111113]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#EEEEEE]">
            {filteredRegions.map((region, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border-r border-b border-[#EEEEEE] space-y-3 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#111113]">
                    {region.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#F7F7F7] border border-[#E5E7EB] text-[#DC2626] rounded-[2px]">
                    {region.zone}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#77767B]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                    <span className="leading-snug text-[#111113] font-medium">{region.terminal}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#77767B] shrink-0" />
                    <span>{region.buses}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                    <span className="font-bold text-[#DC2626]">{region.transit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Need Help With Dispatch */}
      <section className="py-14 bg-[#D62828] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-extrabold">Have a Custom Delivery Destination?</h2>
          <p className="text-xs sm:text-sm text-white/85">
            Our dispatch coordinator will pair your order with the fastest regional bus line to your nearest town.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="bg-white text-[#111113] hover:bg-zinc-100 px-7 py-3 rounded-[2px] text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors"
            >
              <span>Speak with Dispatch Coordinator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ShippingGuidePage;
