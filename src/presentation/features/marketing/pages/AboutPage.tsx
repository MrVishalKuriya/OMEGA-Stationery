import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Feather,
  Truck,
  CheckCircle2,
  ArrowRight,
  Layers,
  Compass,
  Factory,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import {
  HaikeiWaveDivider,
  HaikeiBlobGlow,
  HaikeiPaperLines,
} from '@/components/HaikeiBackgrounds';

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
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] transition-colors duration-200">
      <SEOHead
        title="About OMEGA Writing Notebooks & Stationery Tanzania | Our Heritage & Standards"
        description="Learn about OMEGA, Tanzania's benchmark manufacturer of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper goods since 1998."
      />

      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative overflow-hidden w-full bg-[var(--surface-1)] text-[var(--text)] py-16 lg:py-24 border-b border-[var(--border)]">
        <HaikeiBlobGlow color="mixed" position="top-right" size="lg" className="opacity-30" />
        <HaikeiPaperLines opacity={0.05} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--gold)] bg-[var(--surface-2)] border border-[var(--border)] backdrop-blur-md font-mono shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Soweto SIDO Mbeya &amp; Kariakoo Hub · Est. 1998</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[var(--text)] leading-[1.12] tracking-tight">
              {language === 'sw' ? 'Historia na Ubora wa' : '28 Years of Precision'} <br />
              <span className="font-bold text-[var(--red)]">
                {language === 'sw' ? 'Madaftari ya OMEGA Tanzania.' : 'Paper Engineering in Tanzania.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Tangu mwaka 1998, OMEGA imekuwa ikiongoza katika utengenezaji na usambazaji wa vitabu vya majalada magumu (Counter Books), madaftari ya mazoezi ya shule, na bahasha nzito za kraft zenye uimara usiomomonyoka.'
                : 'Founded in Mbeya in 1998, OMEGA has set the gold standard for durable student exercise books, professional accounting ledgers, and institutional stationery across East Africa.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/catalog"
                  className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-mono font-bold inline-flex items-center gap-2 group shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  <span>{language === 'sw' ? 'TAZAMA BIDHAA' : 'EXPLORE CATALOGUE'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface-1)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--gold)] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>{language === 'sw' ? 'WASILIANA NASI' : 'CONTACT DISPATCH'}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== 2. SCALE & TRUST METRICS ==================== */}
      <section className="bg-[var(--surface-1)] border-b border-[var(--border)] py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-heading block">
                28 Years
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mt-1 font-mono">
                Continuous Heritage
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Manufacturing in Tanzania since 1998</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--red)] font-heading block">
                500,000+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)] mt-1 font-mono">
                Annual Book Volume
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Supplied to schools and enterprises</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-heading block">
                1,200+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mt-1 font-mono">
                Partner Schools &amp; Tenders
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Direct carton dispatch every term</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-heading block">
                31 Regions
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)] mt-1 font-mono">
                Nationwide Delivery
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Daily bus parcel waybill logistics</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 3. FOUR MANUFACTURING PILLARS ==================== */}
      <section className="py-14 lg:py-20 bg-[var(--bg)] border-b border-[var(--border)] relative overflow-hidden transition-colors duration-200">
        <HaikeiBlobGlow color="gold" position="bottom-right" size="lg" className="opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 max-w-2xl mx-auto"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)] font-mono block">
              OUR CRAFTSMANSHIP
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
              {language === 'sw' ? 'Viwango Vinavyotutofautisha' : 'The Four OMEGA Quality Standards'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              {language === 'sw'
                ? 'Kila daftari linalotoka kiwandani kwetu linapitia hatua madhubuti za ubora ili kuhakikisha kumbukumbu zako zinadumu maisha yote.'
                : 'Every batch produced at our Mbeya works undergoes rigorous pull-testing, ink-retention trials, and moisture tests.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((std, idx) => {
              const Icon = std.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Icon Left + Text Right Header */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[var(--surface-2)] text-[var(--red)] flex items-center justify-center font-bold shrink-0 border border-zinc-200/80 shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C7355] block truncate">
                          {std.spec}
                        </span>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-zinc-900 leading-tight truncate">
                          {std.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed text-left">
                      {std.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 4. HERITAGE & TIMELINE ==================== */}
      <section className="py-14 lg:py-20 bg-[var(--surface-1)] border-b border-[var(--border)] relative overflow-hidden transition-colors duration-200">
        <HaikeiBlobGlow color="red" position="center" size="lg" className="opacity-15" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)] font-mono block">
              CHRONOLOGY
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
              {language === 'sw' ? 'Safari ya OMEGA Tanzania' : 'Milestones in Our Journey'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Kutoka karakana ndogo ya Mbeya hadi kuwa chapa inayoaminika zaidi kwa elimu na biashara nchini.'
                : 'From a humble Mbeya paper workshop into Tanzania’s national benchmark for institutional stationery.'}
            </p>
          </motion.div>

          <div className="relative border-l-2 border-[var(--border)] ml-4 md:ml-32 space-y-10 pl-6 md:pl-10">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[var(--surface-2)] border-2 border-[var(--red)] group-hover:bg-[var(--red)] transition-colors" />

                <div className="space-y-1">
                  <span className="font-mono text-sm font-bold text-[var(--gold)] tracking-wider block">
                    {m.year}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-[var(--text)]">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. FACTORY & DISPATCH LOCATIONS ==================== */}
      <section className="py-14 lg:py-20 bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)] font-mono block">
              OPERATIONS &amp; LOGISTICS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
              {language === 'sw' ? 'Vituo Vyetu Rasmi' : 'Our Facilities & Dispatch Hubs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Facility 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-[var(--red)] flex items-center justify-center font-bold border border-zinc-200 shrink-0 shadow-2xs">
                  <Factory className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C7355] block truncate">
                    CENTRAL WORKS &amp; BINDERY
                  </span>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-zinc-900 mt-0.5 truncate">
                    Soweto SIDO Industrial Estate
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono truncate">
                    Mbeya City, Southern Highlands, Tanzania
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed text-left">
                Home to our heavy-duty Smyth thread-sewing lines, precision guillotine cutters, and carton bundling depot. Supplies upcountry tenders and regional bulk orders.
              </p>
              <div className="pt-2 text-xs font-semibold text-zinc-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Factory direct carton pickups &amp; school tenders</span>
              </div>
            </motion.div>

            {/* Facility 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-[var(--red)] flex items-center justify-center font-bold border border-zinc-200 shrink-0 shadow-2xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C7355] block truncate">
                    COMMERCIAL DISPATCH &amp; WAREHOUSE
                  </span>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-zinc-900 mt-0.5 truncate">
                    Kariakoo Commercial District
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono truncate">
                    Dar es Salaam, Coastal Region, Tanzania
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed text-left">
                Our national distribution hub handling rapid bus parcel waybills to all 31 regions via Shabiby, BM Coach, Abood, New Force, and Saibaba.
              </p>
              <div className="pt-2 text-xs font-semibold text-zinc-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Same-day bus parcel waybill drop-offs</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 6. CALL TO ACTION BANNER ==================== */}
      <section className="py-14 bg-[var(--surface-1)] text-[var(--text)] border-t border-[var(--border)] transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
            {language === 'sw'
              ? 'Weka Oda ya Madaftari ya OMEGA Leo'
              : 'Equip Your Students & Accountants with OMEGA'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            {language === 'sw'
              ? 'Pata punguzo la moja kwa moja la bei za jumla kutoka kiwandani na usafirishaji wa haraka mkoani kwako.'
              : 'Direct factory pricing, dedicated bus parcel tracking, and guaranteed thread-sewn durability.'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/wholesale"
                className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer"
              >
                <span>{language === 'sw' ? 'HESABU BEI YA JUMLA' : 'WHOLESALE CARTON CALCULATOR'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface-1)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--gold)] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>{language === 'sw' ? 'WASILIANA NASI' : 'SPEAK WITH SALES'}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Haikei Wave to Footer */}
      <HaikeiWaveDivider fill="var(--bg)" secondaryFill="rgba(214, 58, 58, 0.05)" />
    </div>
  );
};
