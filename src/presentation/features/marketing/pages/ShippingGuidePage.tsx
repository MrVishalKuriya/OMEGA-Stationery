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
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)]">
      <SEOHead
        title="Nationwide Bus Parcel Shipping Guide & Waybill Tracking | OMEGA Tanzania"
        description="Comprehensive guide to OMEGA stationery bus parcel dispatch across all 31 regions of Tanzania via Shabiby, BM Coach, Abood, New Force, and Saibaba."
      />

      {/* ==================== 1. HERO HEADER ==================== */}
      <section className="relative overflow-hidden w-full bg-[var(--surface-1)] text-[var(--text)] py-14 lg:py-20 border-b border-[var(--border)]">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[var(--red)]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--gold)] bg-[var(--surface-2)] border border-[var(--gold)]/30 font-mono shadow-xs">
              <span>Nationwide Regional Logistics Directory</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-light text-[var(--text)] leading-tight">
              {language === 'sw' ? 'Mwongozo wa Usafirishaji wa' : 'Nationwide Bus Parcel Dispatch &'} <br />
              <span className="font-bold text-[var(--red)]">
                {language === 'sw' ? 'Mizigo Mikoani Tanzania.' : 'Waybill Logistics Directory.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Jinsi OMEGA inavyofikisha katoni zako za madaftari katika mkoa wowote Tanzania ndani ya saa 24–48 kwa usalama, stakabadhi rasmi ya waybill, na mawasiliano ya dereva.'
                : 'Direct factory carton dispatch from Mbeya Works and Kariakoo Commercial Hub to your local town bus terminal. Fast, secure, and fully tracked via bus waybill SMS.'}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 2. 4-STEP DISPATCH WORKFLOW ==================== */}
      <section className="py-12 bg-[var(--surface-1)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--red)] font-heading block">
              THE WAYBILL PROCEDURE
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--text)]">
              How Your Order Moves from Factory to Your Hands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--red)]">STEP 01</span>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">Packing &amp; Strapping</h3>
              <p className="text-xs text-[var(--text-muted)]">Cartons are wrapped in waterproof protective tape with bold consignee labeling.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--red)]">STEP 02</span>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">Bus Terminal Drop-off</h3>
              <p className="text-xs text-[var(--text-muted)]">Delivered directly to Shabiby, BM Coach, Abood, or New Force dispatch offices.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--red)]">STEP 03</span>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">Waybill Photo on WhatsApp</h3>
              <p className="text-xs text-[var(--text-muted)]">You receive instant photo proof of the bus parcel receipt and tracking code.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-bold text-[var(--red)]">STEP 04</span>
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">Collection at Terminal</h3>
              <p className="text-xs text-[var(--text-muted)]">Present your ID and SMS tracking number at your town's bus office to claim your parcel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. REGIONAL TERMINAL DIRECTORY ==================== */}
      <section className="py-14 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--red)] font-heading block">
                31 REGIONS COVERED
              </span>
              <h2 className="font-heading text-2xl font-bold text-[var(--text)]">
                Regional Transit Times &amp; Terminals
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search region or town..."
                className="w-full pl-9 pr-4 py-2 bg-[var(--surface-1)] text-[var(--text)] rounded-full border border-[var(--border)] text-xs focus:ring-1 focus:ring-[var(--red)] focus:outline-none"
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedZone === tab.id
                    ? 'bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--gold)]/40 shadow-xs'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
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
                className="p-5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)]/50 transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-[var(--text)]">
                    {region.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]">
                    {region.zone}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--red)] shrink-0 mt-0.5" />
                    <span className="leading-snug">{region.terminal}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[var(--text)] shrink-0" />
                    <span>{region.buses}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-emerald-500">{region.transit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. NEED HELP WITH DISPATCH? ==================== */}
      <section className="py-12 bg-[var(--surface-1)] border-b border-[var(--border)] text-[var(--text)]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold">Have a Custom Delivery Destination?</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Our dispatch coordinator will pair your order with the fastest regional bus line to your nearest town.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="bg-[var(--red)] hover:opacity-90 text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md cursor-pointer"
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
