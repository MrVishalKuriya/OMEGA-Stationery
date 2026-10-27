import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  ShieldCheck,
  Feather,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Compass,
  Factory,
  MapPin,
  Clock,
  Check,
  FileText,
  Users,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';

export const AboutPage: React.FC = () => {
  const { storeConfig, language } = useStore();
  const t = TRANSLATIONS[language];

  const milestones = [
    {
      year: '1998',
      title: language === 'sw' ? 'Mwanzo wa Kiwanda Mbeya' : 'Founding in Mbeya',
      desc: language === 'sw'
        ? 'Kuanzishwa kwa karakana ya kwanza ya madaftari katika eneo la viwanda la Soweto SIDO, Mbeya, kwa lengo la kuzalisha madaftari imara ya bei nafuu.'
        : 'Established our primary manufacturing facility at Soweto SIDO Industrial Estate, Mbeya, dedicated to precision hardcover notebook binding.',
    },
    {
      year: '2008',
      title: language === 'sw' ? 'Ubunifu wa Kushona kwa Nyuzi (Smyth Binding)' : 'Smyth Thread-Sewing Revolution',
      desc: language === 'sw'
        ? 'Tulibadilisha mfumo mzima wa majalada magumu kuwa wa kushona kwa nyuzi mbili (double-sewn), kuondoa kabisa tatizo la kurasa kuchanika au kudondoka.'
        : 'Pioneered double-threaded Smyth sewing across all Quire 2, 3, and 4 ledgers, establishing our signature 180° flat-opening durability.',
    },
    {
      year: '2016',
      title: language === 'sw' ? 'Kituo cha Usambazaji Kariakoo' : 'Kariakoo Wholesale Hub',
      desc: language === 'sw'
        ? 'Tulifungua kituo kikuu cha usambazaji wa haraka jijini Dar es Salaam ili kurahisisha usafirishaji wa katoni za jumla mikoani kote Tanzania.'
        : 'Expanded dispatch capabilities with our Kariakoo commercial hub in Dar es Salaam, enabling same-day bus parcel waybills to all regions.',
    },
    {
      year: '2026',
      title: language === 'sw' ? 'Zaidi ya Vitabu 500,000 Kila Mwaka' : '500,000+ Annual Distribution',
      desc: language === 'sw'
        ? 'Leo OMEGA ndio chapa inayoaminika na zaidi ya shule 1,200, ofisi za wahasibu, na maduka ya jumla katika mikoa yote 31 ya Tanzania.'
        : 'Trusted by over 1,200 primary/secondary academies, certified audit firms, and wholesale stockists across all 31 Tanzanian regions.',
    },
  ];

  const standards = [
    {
      icon: ShieldCheck,
      title: language === 'sw' ? 'Kushona kwa Nyuzi (Smyth Sewn)' : 'Double Thread-Sewn Spine',
      spec: '180° Lay-Flat Standard',
      desc: language === 'sw'
        ? 'Hakuna gundi ya kawaida au vibanio vinavyolegea. Kila kijitabu kimeshonwa kwa nyuzi imara za pamba zinazofanya daftari lisanifuwe vizuri mezani.'
        : 'Zero cheap spine glue or fragile staples. Every signature is machine-stitched with high-tensile thread, opening completely flat on any work surface.',
    },
    {
      icon: Feather,
      title: language === 'sw' ? 'Karatasi ya 70 GSM Isiyopenyeza Wino' : '70 GSM Bleed-Proof Bond',
      spec: 'Zero Ink Ghosting',
      desc: language === 'sw'
        ? 'Fiber za karatasi zenye msongamano mkubwa zinazozuia wino wa kalamu za wino mzito, jeli au fountain usitokee upande wa pili wa ukurasa.'
        : 'High-density calendered wood fiber prevents ink strike-through and feathering, engineered for fountain pens, gel ink, and permanent markers.',
    },
    {
      icon: Layers,
      title: language === 'sw' ? 'Jalada Gumu la 1.8mm Laminated' : '1.8mm Laminated Hardcover',
      spec: 'Moisture & Scuff Resistant',
      desc: language === 'sw'
        ? 'Greyboard nzito iliyofungashwa na filamu ya kulinda unyevunyevu. Hukinga kumbukumbu za kiofisi na madaftari ya wanafunzi kwa miaka mingi.'
        : 'Heavy greyboard core encased in moisture-resistant matt lamination, shielding student syllabus notes and financial ledgers across years of handling.',
    },
    {
      icon: Compass,
      title: language === 'sw' ? 'Mistari Sahihi ya Indigo & Margin' : 'Precision Indigo Ruling',
      spec: 'NECTA Syllabus Compliance',
      desc: language === 'sw'
        ? 'Mistari safi ya rangi ya indigo ya 8mm pamoja na mistari ya pembeni (margin) iliyopimwa kwa viwango rasmi vya Baraza la Mitihani la Taifa.'
        : 'Crisp 8mm feint lines with soft red margin guides calibrated strictly to Tanzanian National Examination Council (NECTA) curriculum guidelines.',
    },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#18181b]">
      <SEOHead
        title="About OMEGA Writing Notebooks & Stationery Tanzania | Our Heritage & Standards"
        description="Learn about OMEGA, Tanzania's benchmark manufacturer of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper goods since 1998."
      />

      {/* ==================== 1. HERO SECTION (LEDUP #111113 MOCHA) ==================== */}
      <section className="relative overflow-hidden w-full bg-[#111113] text-white py-16 lg:py-24 border-b border-[#18181b]">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#dc2626]/18 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] bg-[#b91c1c]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 backdrop-blur-md font-mono shadow-xs">
              <span>Soweto SIDO Mbeya &amp; Kariakoo Hub · Est. 1998</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-5xl font-light text-white leading-[1.12] tracking-tight">
              {language === 'sw' ? 'Historia na Ubora wa' : '28 Years of Precision'} <br />
              <span className="font-bold text-[#dc2626] bg-gradient-to-r from-[#dc2626] via-white to-[#dc2626] bg-clip-text text-transparent">
                {language === 'sw' ? 'Madaftari ya OMEGA Tanzania.' : 'Paper Engineering in Tanzania.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Tangu mwaka 1998, OMEGA imekuwa ikiongoza katika utengenezaji na usambazaji wa vitabu vya majalada magumu (Counter Books), madaftari ya mazoezi ya shule, na bahasha nzito za kraft zenye uimara usiomomonyoka.'
                : 'Founded in Mbeya in 1998, OMEGA has set the gold standard for durable student exercise books, professional accounting ledgers, and institutional stationery across East Africa.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/catalog"
                className="btn-ledup-copper px-7 py-3.5 rounded-lg text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 group shadow-lg"
              >
                <span>{language === 'sw' ? 'TAZAMA BIDHAA' : 'EXPLORE CATALOGUE'}</span>
                <ArrowRight className="w-4 h-4 ledup-arrow-icon" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all"
              >
                <span>{language === 'sw' ? 'WASILIANA NASI' : 'CONTACT DISPATCH'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. SCALE & TRUST METRICS ==================== */}
      <section className="bg-white border-b border-[#e4e4e7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111113] font-heading block">
                28 Years
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181b] mt-1">
                Continuous Heritage
              </h4>
              <p className="text-[11px] text-[#71717a] mt-0.5">Manufacturing in Tanzania since 1998</p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#dc2626] font-heading block">
                500,000+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181b] mt-1">
                Annual Book Volume
              </h4>
              <p className="text-[11px] text-[#71717a] mt-0.5">Supplied to schools and enterprises</p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111113] font-heading block">
                1,200+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181b] mt-1">
                Partner Schools &amp; Tenders
              </h4>
              <p className="text-[11px] text-[#71717a] mt-0.5">Direct carton dispatch every term</p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e4e4e7]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2A9D8F] font-heading block">
                31 Regions
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181b] mt-1">
                Nationwide Delivery
              </h4>
              <p className="text-[11px] text-[#71717a] mt-0.5">Daily bus parcel waybill logistics</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. FOUR MANUFACTURING PILLARS ==================== */}
      <section className="py-14 lg:py-20 bg-[#fafafa] border-b border-[#e4e4e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-heading block">
              OUR CRAFTSMANSHIP
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#18181b] tracking-tight">
              {language === 'sw' ? 'Viwango Vinavyotutofautisha' : 'The Four OMEGA Quality Standards'}
            </h2>
            <p className="text-xs sm:text-sm text-[#71717a]">
              {language === 'sw'
                ? 'Kila daftari linalotoka kiwandani kwetu linapitia hatua madhubuti za ubora ili kuhakikisha kumbukumbu zako zinadumu maisha yote.'
                : 'Every batch produced at our Mbeya works undergoes rigorous pull-testing, ink-retention trials, and moisture tests.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((std, idx) => {
              const Icon = std.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-[20px] bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all space-y-3 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-[14px] bg-[#111113] text-[#dc2626] flex items-center justify-center font-bold shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2A9D8F] block">
                    {std.spec}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#18181b]">
                    {std.title}
                  </h3>
                  <p className="text-xs text-[#71717a] leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 4. HERITAGE & TIMELINE ==================== */}
      <section className="py-14 lg:py-20 bg-white border-b border-[#e4e4e7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-heading block">
              CHRONOLOGY
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#18181b] tracking-tight">
              {language === 'sw' ? 'Safari ya OMEGA Tanzania' : 'Milestones in Our Journey'}
            </h2>
            <p className="text-xs sm:text-sm text-[#71717a] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Kutoka karakana ndogo ya Mbeya hadi kuwa chapa inayoaminika zaidi kwa elimu na biashara nchini.'
                : 'From a humble Mbeya paper workshop into Tanzania’s national benchmark for institutional stationery.'}
            </p>
          </div>

          <div className="relative border-l-2 border-[#e4e4e7] ml-4 md:ml-32 space-y-10 pl-6 md:pl-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#fafafa] border-2 border-[#dc2626] group-hover:bg-[#dc2626] transition-colors" />

                <div className="space-y-1">
                  <span className="font-mono text-sm font-bold text-[#dc2626] tracking-wider block">
                    {m.year}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-[#18181b]">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed max-w-2xl">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. FACTORY & DISPATCH LOCATIONS ==================== */}
      <section className="py-14 lg:py-20 bg-[#fafafa] border-b border-[#e4e4e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-heading block">
              OPERATIONS &amp; LOGISTICS
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#18181b] tracking-tight">
              {language === 'sw' ? 'Vituo Vyetu Rasmi' : 'Our Facilities & Dispatch Hubs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Facility 1 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-[14px] bg-[#111113] text-[#dc2626] flex items-center justify-center font-bold">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2A9D8F] block">
                  CENTRAL WORKS &amp; BINDERY
                </span>
                <h3 className="font-heading font-bold text-xl text-[#18181b] mt-1">
                  Soweto SIDO Industrial Estate
                </h3>
                <p className="text-xs text-[#71717a] mt-1 font-mono">
                  Mbeya City, Southern Highlands, Tanzania
                </p>
              </div>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Home to our heavy-duty Smyth thread-sewing lines, precision guillotine cutters, and carton bundling depot. Supplies upcountry tenders and regional bulk orders.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#111113] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" /> Factory direct carton pickups &amp; school tenders
              </div>
            </div>

            {/* Facility 2 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-[14px] bg-[#111113] text-[#dc2626] flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#dc2626] block">
                  COMMERCIAL DISPATCH &amp; WAREHOUSE
                </span>
                <h3 className="font-heading font-bold text-xl text-[#18181b] mt-1">
                  Kariakoo Commercial District
                </h3>
                <p className="text-xs text-[#71717a] mt-1 font-mono">
                  Dar es Salaam, Coastal Region, Tanzania
                </p>
              </div>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Our national distribution hub handling rapid bus parcel waybills to all 31 regions via Shabiby, BM Coach, Abood, New Force, and Saibaba.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#111113] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" /> Same-day bus parcel waybill drop-offs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. CALL TO ACTION BANNER ==================== */}
      <section className="py-14 bg-[#111113] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {language === 'sw'
              ? 'Weka Oda ya Madaftari ya OMEGA Leo'
              : 'Equip Your Students & Accountants with OMEGA'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-xl mx-auto">
            {language === 'sw'
              ? 'Pata punguzo la moja kwa moja la bei za jumla kutoka kiwandani na usafirishaji wa haraka mkoani kwako.'
              : 'Direct factory pricing, dedicated bus parcel tracking, and guaranteed thread-sewn durability.'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              to="/wholesale"
              className="btn-ledup-copper px-8 py-3.5 rounded-lg text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 shadow-lg"
            >
              <span>{language === 'sw' ? 'HESABU BEI YA JUMLA' : 'WHOLESALE CARTON CALCULATOR'}</span>
              <ArrowRight className="w-4 h-4 ledup-arrow-icon" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all"
            >
              <span>{language === 'sw' ? 'WASILIANA NASI' : 'SPEAK WITH SALES'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
