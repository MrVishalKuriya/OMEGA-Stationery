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
    <div className="bg-[#F9F8F6] min-h-screen text-[#111113]">
      <SEOHead
        title="Nationwide Bus Parcel Shipping Guide & Waybill Tracking | OMEGA Tanzania"
        description="Comprehensive guide to OMEGA stationery bus parcel dispatch across all 31 regions of Tanzania via Shabiby, BM Coach, Abood, New Force, and Saibaba."
      />

      {/* 1. Hero Header */}
      <section className="relative overflow-hidden w-full bg-[#111113] text-[#F9F8F6] py-14 lg:py-20 border-b border-[#E7E5E0]/15 shadow-sm">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-[#8C7355] text-white text-xs font-bold font-mono shadow-xs">
              <span>Nationwide Regional Logistics Directory</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#F9F8F6] leading-tight">
              {language === 'sw' ? 'Mwongozo wa Usafirishaji wa' : 'Nationwide Bus Parcel Dispatch &'} <br />
              <span className="text-[#C8A27A]">
                {language === 'sw' ? 'Mizigo Mikoani Tanzania.' : 'Waybill Logistics Directory.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A39E93] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Jinsi OMEGA inavyofikisha katoni zako za madaftari katika mkoa wowote Tanzania ndani ya saa 24–48 kwa usalama, stakabadhi rasmi ya waybill, na mawasiliano ya dereva.'
                : 'Direct factory carton dispatch from Mbeya Works and Kariakoo Commercial Hub to your local town bus terminal. Fast, secure, and fully tracked via bus waybill SMS.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. 4-Step Dispatch Workflow */}
      <section className="py-12 bg-white border-b border-[#E7E5E0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7355] font-heading block">
              THE WAYBILL PROCEDURE
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#111113]">
              How Your Order Moves from Factory to Your Hands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-[#8C7355]">STEP 01</span>
              <h3 className="font-heading font-bold text-sm text-[#111113]">Packing &amp; Strapping</h3>
              <p className="text-xs text-[#6E6B66]">Cartons are wrapped in waterproof protective tape with bold consignee labeling.</p>
            </div>

            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-[#8C7355]">STEP 02</span>
              <h3 className="font-heading font-bold text-sm text-[#111113]">Bus Terminal Drop-off</h3>
              <p className="text-xs text-[#6E6B66]">Delivered directly to Shabiby, BM Coach, Abood, or New Force dispatch offices.</p>
            </div>

            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-[#8C7355]">STEP 03</span>
              <h3 className="font-heading font-bold text-sm text-[#111113]">Waybill Photo on WhatsApp</h3>
              <p className="text-xs text-[#6E6B66]">You receive instant photo proof of the bus parcel receipt and tracking code.</p>
            </div>

            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-[#8C7355]">STEP 04</span>
              <h3 className="font-heading font-bold text-sm text-[#111113]">Collection at Terminal</h3>
              <p className="text-xs text-[#6E6B66]">Present your ID and SMS tracking number at your town's bus office to claim your parcel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Regional Terminal Directory */}
      <section className="py-14 bg-[#F9F8F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7355] font-heading block">
                31 REGIONS COVERED
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#111113]">
                Regional Transit Times &amp; Terminals
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#7D685E] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search region or town..."
                className="w-full pl-9 pr-4 py-2 bg-white text-xs text-[#26130F] focus:outline-none shadow-2xs"
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
                className={`px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                  selectedZone === tab.id
                    ? 'bg-[#9E3618] text-white shadow-xs'
                    : 'bg-white text-[#26130F] hover:bg-[#FAF6F0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRegions.map((region, idx) => (
              <div
                key={idx}
                className="p-5 bg-white shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-[#26130F]">
                    {region.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#FAF6F0] text-[#9E3618]">
                    {region.zone}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#7D685E]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9E3618] shrink-0 mt-0.5" />
                    <span className="leading-snug text-[#26130F]">{region.terminal}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#7D685E] shrink-0" />
                    <span>{region.buses}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#9E3618] shrink-0" />
                    <span className="font-semibold text-[#9E3618]">{region.transit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Need Help With Dispatch */}
      <section className="py-12 bg-[#6B140B] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold">Have a Custom Delivery Destination?</h2>
          <p className="text-xs sm:text-sm text-white/90">
            Our dispatch coordinator will pair your order with the fastest regional bus line to your nearest town.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="bg-[#9E3618] hover:bg-[#852512] px-7 py-3 text-xs font-bold font-mono uppercase tracking-wider inline-flex items-center gap-2 shadow-xs transition-colors"
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
