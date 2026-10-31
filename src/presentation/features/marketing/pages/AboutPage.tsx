import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Feather,
  Layers,
  Compass,
  Factory,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';

export const AboutPage: React.FC = () => {
  const { language } = useStore();
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
    <div className="bg-[#FFFFFF] min-h-screen text-[#111113]">
      <SEOHead
        title="About OMEGA Writing Notebooks & Stationery Tanzania | Our Heritage & Standards"
        description="Learn about OMEGA, Tanzania's benchmark manufacturer of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper goods since 1998."
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
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#DC2626] text-white text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Soweto SIDO Mbeya &amp; Kariakoo Hub · Est. 1998</span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-white leading-[1.12] tracking-tight">
              {language === 'sw' ? 'Historia na Ubora wa' : '28 Years of Precision'} <br />
              <span className="text-[#DC2626]">
                {language === 'sw' ? 'Madaftari ya OMEGA Tanzania' : 'Paper Engineering in Tanzania'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal max-w-2xl">
              {language === 'sw'
                ? 'Tangu mwaka 1998, OMEGA imekuwa ikiongoza katika utengenezaji na usambazaji wa vitabu vya majalada magumu (Counter Books), madaftari ya mazoezi ya shule, na bahasha nzito za kraft zenye uimara usiomomonyoka.'
                : 'Founded in Mbeya in 1998, OMEGA has set the gold standard for durable student exercise books, professional accounting ledgers, and institutional stationery across East Africa.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                to="/catalog"
                className="px-7 py-3.5 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-[11px] uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-colors"
              >
                <span>{language === 'sw' ? 'TAZAMA BIDHAA' : 'EXPLORE CATALOGUE'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-[2px] bg-transparent hover:bg-white hover:text-[#111113] text-white text-[11px] font-bold uppercase tracking-[0.14em] transition-colors border border-white/80"
              >
                <span>{language === 'sw' ? 'WASILIANA NASI' : 'CONTACT DISPATCH'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Crimson Red Callout Strip with Upward White Triangle Notch */}
      <section className="relative bg-[#D62828] text-white py-9 sm:py-11">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl text-left">
            <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-white">
              ISO-GRADE THREAD-SEWN BINDING &amp; 70 GSM PURE WOOD-FREE BOND
            </h2>
            <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed">
              Engineered at Soweto SIDO Industrial Estate in Mbeya and distributed nationwide through our Kariakoo commercial hub in Dar es Salaam.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/wholesale"
              className="px-6 py-3 bg-white text-[#111113] hover:bg-zinc-100 text-[11px] font-bold uppercase tracking-[0.14em] rounded-[2px] transition-colors shadow-xs"
            >
              WHOLESALE RATES
            </Link>
            <Link
              to="/school-tenders"
              className="px-6 py-3 bg-transparent border border-white/85 text-white hover:bg-white hover:text-[#111113] text-[11px] font-bold uppercase tracking-[0.14em] rounded-[2px] transition-colors"
            >
              SCHOOL TENDERS
            </Link>
          </div>
        </div>

        {/* Bottom-left white upward-pointing triangle notch */}
        <div className="absolute -bottom-[1px] left-12 sm:left-24 lg:left-36 w-0 h-0 border-l-[26px] border-l-transparent border-r-[26px] border-r-transparent border-b-[18px] border-b-white">
          <span className="absolute -left-1.5 top-1.5 text-[10px] text-zinc-400 font-bold leading-none select-none">
            ⌄
          </span>
        </div>
      </section>

      {/* 3. Scale & Trust Metrics */}
      <section className="bg-white py-12 border-b border-[#EEEEEE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-[#EEEEEE] text-left">
            <div className="p-6 sm:p-8 bg-white border-r border-b border-[#EEEEEE]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111113] block">
                28 Years
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113] mt-1.5">
                Continuous Heritage
              </h4>
              <p className="text-xs text-[#77767B] mt-1">Manufacturing in Tanzania since 1998</p>
            </div>

            <div className="p-6 sm:p-8 bg-white border-r border-b border-[#EEEEEE]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#DC2626] block">
                500,000+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113] mt-1.5">
                Annual Book Volume
              </h4>
              <p className="text-xs text-[#77767B] mt-1">Supplied to schools and enterprises</p>
            </div>

            <div className="p-6 sm:p-8 bg-white border-r border-b border-[#EEEEEE]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111113] block">
                1,200+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113] mt-1.5">
                Partner Schools &amp; Tenders
              </h4>
              <p className="text-xs text-[#77767B] mt-1">Direct carton dispatch every term</p>
            </div>

            <div className="p-6 sm:p-8 bg-white border-r border-b border-[#EEEEEE]">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#DC2626] block">
                31 Regions
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113] mt-1.5">
                Nationwide Delivery
              </h4>
              <p className="text-xs text-[#77767B] mt-1">Daily bus parcel waybill logistics</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four Manufacturing Pillars */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DC2626] block">
              OUR CRAFTSMANSHIP
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111113] tracking-tight">
              {language === 'sw' ? 'Viwango Vinavyotutofautisha' : 'The Four OMEGA Quality Standards'}
            </h2>
            <p className="text-xs sm:text-sm text-[#77767B]">
              {language === 'sw'
                ? 'Kila daftari linalotoka kiwandani kwetu linapitia hatua madhubuti za ubora ili kuhakikisha kumbukumbu zako zinadumu maisha yote.'
                : 'Every batch produced at our Mbeya works undergoes rigorous pull-testing, ink-retention trials, and moisture tests.'}
            </p>
            <div className="pt-1 flex justify-center text-[#111113]">
              <svg className="w-16 h-3" viewBox="0 0 60 8" fill="none">
                <path d="M0 4 Q 5 0, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#EEEEEE] text-left">
            {standards.map((std, idx) => {
              const Icon = std.icon;
              return (
                <div
                  key={idx}
                  className="p-7 bg-white border-r border-b border-[#EEEEEE] space-y-3 hover:bg-[#FAFAFA] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-[2px] bg-[#F7F7F7] text-[#111113] group-hover:bg-[#DC2626] group-hover:text-white flex items-center justify-center font-bold transition-colors">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#DC2626] block">
                    {std.spec}
                  </span>
                  <h3 className="font-bold text-base text-[#111113]">
                    {std.title}
                  </h3>
                  <p className="text-xs text-[#77767B] leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Heritage & Timeline */}
      <section className="py-16 lg:py-24 bg-[#F7F7F7] border-y border-[#EEEEEE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DC2626] block">
              CHRONOLOGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111113] tracking-tight">
              {language === 'sw' ? 'Safari ya OMEGA Tanzania' : 'Milestones in Our Journey'}
            </h2>
            <p className="text-xs sm:text-sm text-[#77767B] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Kutoka karakana ndogo ya Mbeya hadi kuwa chapa inayoaminika zaidi kwa elimu na biashara nchini.'
                : 'From a humble Mbeya paper workshop into Tanzania’s national benchmark for institutional stationery.'}
            </p>
          </div>

          <div className="relative border-l-2 border-[#E5E7EB] ml-4 md:ml-32 space-y-10 pl-6 md:pl-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 bg-white border-2 border-[#DC2626] group-hover:bg-[#DC2626] transition-colors" />

                <div className="space-y-1 bg-white p-5 border border-[#EEEEEE]">
                  <span className="font-mono text-sm font-bold text-[#DC2626] tracking-wider block">
                    {m.year}
                  </span>
                  <h3 className="font-bold text-lg text-[#111113]">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77767B] leading-relaxed max-w-2xl">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Factory & Dispatch Locations */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DC2626] block">
              OPERATIONS &amp; LOGISTICS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111113] tracking-tight">
              {language === 'sw' ? 'Vituo Vyetu Rasmi' : 'Our Facilities & Dispatch Hubs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#EEEEEE]">
            {/* Facility 1 */}
            <div className="p-8 bg-white border-r border-b border-[#EEEEEE] space-y-4">
              <div className="w-12 h-12 rounded-[2px] bg-[#F7F7F7] text-[#DC2626] flex items-center justify-center font-bold">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#DC2626] block">
                  CENTRAL WORKS &amp; BINDERY
                </span>
                <h3 className="font-bold text-xl text-[#111113] mt-1">
                  Soweto SIDO Industrial Estate
                </h3>
                <p className="text-xs text-[#77767B] mt-1 font-mono">
                  Mbeya City, Southern Highlands, Tanzania
                </p>
              </div>
              <p className="text-xs text-[#77767B] leading-relaxed">
                Home to our heavy-duty Smyth thread-sewing lines, precision guillotine cutters, and carton bundling depot. Supplies upcountry tenders and regional bulk orders.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#111113] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626]" /> Factory direct carton pickups &amp; school tenders
              </div>
            </div>

            {/* Facility 2 */}
            <div className="p-8 bg-white border-r border-b border-[#EEEEEE] space-y-4">
              <div className="w-12 h-12 rounded-[2px] bg-[#F7F7F7] text-[#DC2626] flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#DC2626] block">
                  COMMERCIAL DISPATCH &amp; WAREHOUSE
                </span>
                <h3 className="font-bold text-xl text-[#111113] mt-1">
                  Kariakoo Commercial District
                </h3>
                <p className="text-xs text-[#77767B] mt-1 font-mono">
                  Dar es Salaam, Coastal Region, Tanzania
                </p>
              </div>
              <p className="text-xs text-[#77767B] leading-relaxed">
                Our national distribution hub handling rapid bus parcel waybills to all 31 regions via Shabiby, BM Coach, Abood, New Force, and Saibaba.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#111113] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626]" /> Same-day bus parcel waybill drop-offs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-16 bg-[#D62828] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {language === 'sw'
              ? 'Weka Oda ya Madaftari ya OMEGA Leo'
              : 'Equip Your Students & Accountants with OMEGA'}
          </h2>
          <p className="text-xs sm:text-sm text-white/85 max-w-xl mx-auto">
            {language === 'sw'
              ? 'Pata punguzo la moja kwa moja la bei za jumla kutoka kiwandani na usafirishaji wa haraka mkoani kwako.'
              : 'Direct factory pricing, dedicated bus parcel tracking, and guaranteed thread-sewn durability.'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              to="/wholesale"
              className="bg-white text-[#111113] hover:bg-zinc-100 px-8 py-3.5 rounded-[2px] text-[11px] uppercase tracking-[0.14em] font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>{language === 'sw' ? 'HESABU BEI YA JUMLA' : 'WHOLESALE CARTON CALCULATOR'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-[2px] bg-transparent hover:bg-white hover:text-[#111113] text-white text-[11px] font-bold uppercase tracking-[0.14em] transition-colors border border-white/85"
            >
              <span>{language === 'sw' ? 'WASILIANA NASI' : 'SPEAK WITH SALES'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AboutPage;
