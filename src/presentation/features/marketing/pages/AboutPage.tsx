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
    <div className="bg-[#FAF6F0] min-h-screen text-[#26130F]">
      <SEOHead
        title="About OMEGA Writing Notebooks & Stationery Tanzania | Our Heritage & Standards"
        description="Learn about OMEGA, Tanzania's benchmark manufacturer of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper goods since 1998."
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden w-full bg-[#111113] text-[#F9F8F6] py-14 lg:py-20 border-b border-[#E7E5E0]/15 shadow-sm">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#8C7355] text-white text-xs font-bold font-mono shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Soweto SIDO Mbeya &amp; Kariakoo Hub · Est. 1998</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-5xl font-black text-[#F9F8F6] leading-[1.12] tracking-tight">
              {language === 'sw' ? 'Historia na Ubora wa' : '28 Years of Precision'} <br />
              <span className="text-[#C8A27A]">
                {language === 'sw' ? 'Madaftari ya OMEGA Tanzania' : 'Paper Engineering in Tanzania'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A39E93] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Tangu mwaka 1998, OMEGA imekuwa ikiongoza katika utengenezaji na usambazaji wa vitabu vya majalada magumu (Counter Books), madaftari ya mazoezi ya shule, na bahasha nzito za kraft zenye uimara usiomomonyoka.'
                : 'Founded in Mbeya in 1998, OMEGA has set the gold standard for durable student exercise books, professional accounting ledgers, and institutional stationery across East Africa.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/catalog"
                className="px-6 py-3 rounded-md bg-[#8C7355] hover:bg-[#725c42] text-white font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>{language === 'sw' ? 'TAZAMA BIDHAA' : 'EXPLORE CATALOGUE'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-white/20"
              >
                <span>{language === 'sw' ? 'WASILIANA NASI' : 'CONTACT DISPATCH'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Scale & Trust Metrics */}
      <section className="bg-white py-8 border-b border-[#E7E5E0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111113] font-heading block">
                28 Years
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113] mt-1">
                Continuous Heritage
              </h4>
              <p className="text-[11px] text-[#7D685E] mt-0.5">Manufacturing in Tanzania since 1998</p>
            </div>

            <div className="p-5 bg-[#FAF6F0] shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#9E3618] font-heading block">
                500,000+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#26130F] mt-1">
                Annual Book Volume
              </h4>
              <p className="text-[11px] text-[#7D685E] mt-0.5">Supplied to schools and enterprises</p>
            </div>

            <div className="p-5 bg-[#FAF6F0] shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#6B140B] font-heading block">
                1,200+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#26130F] mt-1">
                Partner Schools &amp; Tenders
              </h4>
              <p className="text-[11px] text-[#7D685E] mt-0.5">Direct carton dispatch every term</p>
            </div>

            <div className="p-5 bg-[#FAF6F0] shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#9E3618] font-heading block">
                31 Regions
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#26130F] mt-1">
                Nationwide Delivery
              </h4>
              <p className="text-[11px] text-[#7D685E] mt-0.5">Daily bus parcel waybill logistics</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Manufacturing Pillars */}
      <section className="py-14 lg:py-20 bg-[#F9F8F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7355] font-heading block">
              OUR CRAFTSMANSHIP
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#111113] tracking-tight">
              {language === 'sw' ? 'Viwango Vinavyotutofautisha' : 'The Four OMEGA Quality Standards'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6B66]">
              {language === 'sw'
                ? 'Kila daftari linalotoka kiwandani kwetu linapitia hatua madhubuti za ubora ili kuhakikisha kumbukumbu zako zinadumu maisha yote.'
                : 'Every batch produced at our Mbeya works undergoes rigorous pull-testing, ink-retention trials, and moisture tests.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {standards.map((std, idx) => {
              const Icon = std.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-lg border border-[#E7E5E0] space-y-3 shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center font-bold shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C7355] block">
                    {std.spec}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#111113]">
                    {std.title}
                  </h3>
                  <p className="text-xs text-[#6E6B66] leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Heritage & Timeline */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E3618] font-heading block">
              CHRONOLOGY
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#26130F] tracking-tight">
              {language === 'sw' ? 'Safari ya OMEGA Tanzania' : 'Milestones in Our Journey'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7D685E] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Kutoka karakana ndogo ya Mbeya hadi kuwa chapa inayoaminika zaidi kwa elimu na biashara nchini.'
                : 'From a humble Mbeya paper workshop into Tanzania’s national benchmark for institutional stationery.'}
            </p>
          </div>

          <div className="relative border-l-2 border-[#D8C3A5] ml-4 md:ml-32 space-y-10 pl-6 md:pl-10">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 bg-[#FAF6F0] border-2 border-[#9E3618] group-hover:bg-[#9E3618] transition-colors" />

                <div className="space-y-1">
                  <span className="font-mono text-sm font-bold text-[#9E3618] tracking-wider block">
                    {m.year}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-[#26130F]">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7D685E] leading-relaxed max-w-2xl">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Factory & Dispatch Locations */}
      <section className="py-14 lg:py-20 bg-[#F9F8F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7355] font-heading block">
              OPERATIONS &amp; LOGISTICS
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#111113] tracking-tight">
              {language === 'sw' ? 'Vituo Vyetu Rasmi' : 'Our Facilities & Dispatch Hubs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Facility 1 */}
            <div className="p-8 bg-white rounded-lg border border-[#E7E5E0] space-y-4 shadow-2xs">
              <div className="w-12 h-12 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center font-bold">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C7355] block">
                  CENTRAL WORKS &amp; BINDERY
                </span>
                <h3 className="font-heading font-bold text-xl text-[#111113] mt-1">
                  Soweto SIDO Industrial Estate
                </h3>
                <p className="text-xs text-[#6E6B66] mt-1 font-mono">
                  Mbeya City, Southern Highlands, Tanzania
                </p>
              </div>
              <p className="text-xs text-[#6E6B66] leading-relaxed">
                Home to our heavy-duty Smyth thread-sewing lines, precision guillotine cutters, and carton bundling depot. Supplies upcountry tenders and regional bulk orders.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#111113] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355]" /> Factory direct carton pickups &amp; school tenders
              </div>
            </div>

            {/* Facility 2 */}
            <div className="p-8 bg-white rounded-lg border border-[#E7E5E0] space-y-4 shadow-2xs">
              <div className="w-12 h-12 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C7355] block">
                  COMMERCIAL DISPATCH &amp; WAREHOUSE
                </span>
                <h3 className="font-heading font-bold text-xl text-[#111113] mt-1">
                  Kariakoo Commercial District
                </h3>
                <p className="text-xs text-[#6E6B66] mt-1 font-mono">
                  Dar es Salaam, Coastal Region, Tanzania
                </p>
              </div>
              <p className="text-xs text-[#6E6B66] leading-relaxed">
                Our national distribution hub handling rapid bus parcel waybills to all 31 regions via Shabiby, BM Coach, Abood, New Force, and Saibaba.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#111113] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355]" /> Same-day bus parcel waybill drop-offs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section className="py-14 bg-[#111113] text-[#F9F8F6] border-t border-[#E7E5E0]/15">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#F9F8F6] tracking-tight">
            {language === 'sw'
              ? 'Weka Oda ya Madaftari ya OMEGA Leo'
              : 'Equip Your Students & Accountants with OMEGA'}
          </h2>
          <p className="text-xs sm:text-sm text-[#A39E93] max-w-xl mx-auto">
            {language === 'sw'
              ? 'Pata punguzo la moja kwa moja la bei za jumla kutoka kiwandani na usafirishaji wa haraka mkoani kwako.'
              : 'Direct factory pricing, dedicated bus parcel tracking, and guaranteed thread-sewn durability.'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              to="/wholesale"
              className="bg-[#8C7355] hover:bg-[#725c42] text-white px-8 py-3.5 rounded-md text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>{language === 'sw' ? 'HESABU BEI YA JUMLA' : 'WHOLESALE CARTON CALCULATOR'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors border border-white/20"
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
