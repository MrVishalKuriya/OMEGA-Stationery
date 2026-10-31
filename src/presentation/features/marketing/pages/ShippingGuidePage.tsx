import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  MapPin,
  Clock,
  Package,
  ShieldCheck,
  CheckCircle2,
  Search,
  Phone,
  MessageCircle,
  ArrowRight,
  AlertCircle,
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
    <div className="bg-[#fafafa] min-h-screen text-[#18181b]">
      <SEOHead
        title="Nationwide Bus Parcel Shipping Guide & Waybill Tracking | OMEGA Tanzania"
        description="Comprehensive guide to OMEGA stationery bus parcel dispatch across all 31 regions of Tanzania via Shabiby, BM Coach, Abood, New Force, and Saibaba."
      />

      {/* ==================== 1. HERO HEADER ==================== */}
      <section className="relative overflow-hidden w-full bg-[#111113] text-white py-14 lg:py-20 border-b border-[#18181b]">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#dc2626]/18 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 font-mono shadow-xs">
              <span>Nationwide Regional Logistics Directory</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-light text-white leading-tight">
              {language === 'sw' ? 'Mwongozo wa Usafirishaji wa' : 'Nationwide Bus Parcel Dispatch &'} <br />
              <span className="font-bold text-[#dc2626] bg-gradient-to-r from-[#dc2626] via-white to-[#dc2626] bg-clip-text text-transparent">
                {language === 'sw' ? 'Mizigo Mikoani Tanzania.' : 'Waybill Logistics Directory.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Jinsi OMEGA inavyofikisha katoni zako za madaftari katika mkoa wowote Tanzania ndani ya saa 24–48 kwa usalama, stakabadhi rasmi ya waybill, na mawasiliano ya dereva.'
                : 'Direct factory carton dispatch from Mbeya Works and Kariakoo Commercial Hub to your local town bus terminal. Fast, secure, and fully tracked via bus waybill SMS.'}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 2. 4-STEP DISPATCH WORKFLOW ==================== */}
      <section className="py-12 bg-white border-b border-[#e4e4e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-heading block">
              THE WAYBILL PROCEDURE
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#18181b]">
              How Your Order Moves from Factory to Your Hands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7] space-y-2">
              <span className="text-xs font-mono font-bold text-[#dc2626]">STEP 01</span>
              <h3 className="font-heading font-bold text-sm text-[#18181b]">Packing &amp; Strapping</h3>
              <p className="text-xs text-[#71717a]">Cartons are wrapped in waterproof protective tape with bold consignee labeling.</p>
            </div>

            <div className="p-5 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7] space-y-2">
              <span className="text-xs font-mono font-bold text-[#dc2626]">STEP 02</span>
              <h3 className="font-heading font-bold text-sm text-[#18181b]">Bus Terminal Drop-off</h3>
              <p className="text-xs text-[#71717a]">Delivered directly to Shabiby, BM Coach, Abood, or New Force dispatch offices.</p>
            </div>

            <div className="p-5 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7] space-y-2">
              <span className="text-xs font-mono font-bold text-[#dc2626]">STEP 03</span>
              <h3 className="font-heading font-bold text-sm text-[#18181b]">Waybill Photo on WhatsApp</h3>
              <p className="text-xs text-[#71717a]">You receive instant photo proof of the bus parcel receipt and tracking code.</p>
            </div>

            <div className="p-5 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7] space-y-2">
              <span className="text-xs font-mono font-bold text-[#dc2626]">STEP 04</span>
              <h3 className="font-heading font-bold text-sm text-[#18181b]">Collection at Terminal</h3>
              <p className="text-xs text-[#71717a]">Present your ID and SMS tracking number at your town's bus office to claim your parcel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. REGIONAL TERMINAL DIRECTORY ==================== */}
      <section className="py-14 bg-[#fafafa] border-b border-[#e4e4e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-heading block">
                31 REGIONS COVERED
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#18181b]">
                Regional Transit Times &amp; Terminals
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search region or town..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-full border border-[#e4e4e7] text-xs focus:ring-1 focus:ring-[#111113] focus:outline-none"
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedZone === tab.id
                    ? 'bg-[#111113] text-white shadow-xs'
                    : 'bg-white text-[#71717a] border border-[#e4e4e7] hover:bg-[#f5f4f4]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRegions.map((region, idx) => (
              <div
                key={idx}
                className="p-5 rounded-[16px] bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-[#18181b]">
                    {region.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#f5f4f4] text-[#111113] border border-[#e4e4e7]">
                    {region.zone}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#71717a]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#dc2626] shrink-0 mt-0.5" />
                    <span className="leading-snug">{region.terminal}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#111113] shrink-0" />
                    <span>{region.buses}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2A9D8F] shrink-0" />
                    <span className="font-semibold text-[#2A9D8F]">{region.transit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. NEED HELP WITH DISPATCH? ==================== */}
      <section className="py-12 bg-[#111113] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold">Have a Custom Delivery Destination?</h2>
          <p className="text-xs sm:text-sm text-stone-200">
            Our dispatch coordinator will pair your order with the fastest regional bus line to your nearest town.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="btn-ledup-copper px-7 py-3 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>Speak with Dispatch Coordinator</span>
              <ArrowRight className="w-3.5 h-3.5 ledup-arrow-icon" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
