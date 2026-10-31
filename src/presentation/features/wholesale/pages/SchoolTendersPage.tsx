import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  Truck,
  MessageCircle,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';
import { formatPrice } from '@/types/store';

export const SchoolTendersPage: React.FC = () => {
  const { storeConfig, language } = useStore();
  const currency = storeConfig.currencySymbol || 'TSh';

  // Calculator inputs
  const [studentCount, setStudentCount] = useState<number>(250);
  const [levelTier, setLevelTier] = useState<'primary' | 'secondary' | 'highschool'>('secondary');
  const [schoolName, setSchoolName] = useState<string>('');
  const [schoolRegion, setSchoolRegion] = useState<string>('Mwanza');

  // Multiplier defaults based on level
  const booksPerStudent = levelTier === 'primary' ? 8 : levelTier === 'secondary' ? 10 : 12;
  const totalExerciseBooks = studentCount * booksPerStudent;
  const cartonsExercise = Math.ceil(totalExerciseBooks / 120);

  // Counter books for teachers and administration
  const counterBooksNeeded = levelTier === 'primary' ? 36 : levelTier === 'secondary' ? 72 : 96;
  const cartonsCounter = Math.ceil(counterBooksNeeded / 36);

  // Examination reams
  const examReamsNeeded = Math.ceil(studentCount / 50);

  // Price estimations
  const exerciseCartonRate = 48000;
  const counterCartonRate = 57000;
  const examReamRate = 18000;

  const totalGross =
    cartonsExercise * exerciseCartonRate +
    cartonsCounter * counterCartonRate +
    examReamsNeeded * examReamRate;

  // 15% - 20% institutional tender discount
  const discountRate = studentCount >= 500 ? 0.2 : 0.15;
  const savings = Math.round(totalGross * discountRate);
  const netEstimatedTotal = totalGross - savings;

  const tenderWhatsappUrl = `https://wa.me/255624265480?text=${encodeURIComponent(
    `*OMEGA OFFICIAL SCHOOL TENDER INQUIRY*\n` +
    `----------------------------------------\n` +
    `School: ${schoolName.trim() || 'School Procurement Board'}\n` +
    `Region: ${schoolRegion}\n` +
    `Student Enrollment: ${studentCount} Students (${levelTier.toUpperCase()})\n` +
    `Required Exercise Books: ${totalExerciseBooks} Books (~${cartonsExercise} Cartons)\n` +
    `Required Q3 Counter Books: ${counterBooksNeeded} Books (~${cartonsCounter} Cartons)\n` +
    `Exam Ruled Paper Reams: ${examReamsNeeded} Reams\n` +
    `Estimated Net Total: ${currency} ${netEstimatedTotal.toLocaleString()} (incl. ${Math.round(discountRate * 100)}% Tender Discount)\n` +
    `----------------------------------------\n` +
    `Please issue an official stamped Proforma Invoice for our School Board.`
  )}`;

  return (
    <div className="bg-[#F7F7F7] min-h-screen text-[#111113]">
      <SEOHead
        title="School Booklist Tenders & Bulk Educational Procurement | OMEGA Tanzania"
        description="Official school tender portal for Tanzanian primary and secondary schools. Calculate exercise books, counter books, and exam pads with up to 20% tender discounts."
      />

      {/* ==================== 1. HERO HEADER ==================== */}
      <section className="relative overflow-hidden w-full bg-[#1B1B1E] text-white py-14 lg:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 brightness-110 contrast-105 pointer-events-none"
          style={{ backgroundImage: 'url(/hero-desk-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/75 via-[#111113]/50 to-[#111113]/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-[#F9F8F6]/15 to-white/25 mix-blend-soft-light pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.22),transparent_65%)] pointer-events-none" />

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#111113]/70 backdrop-blur-xs text-white border border-white/25 text-[10px] font-bold font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Official School Procurement &amp; Syllabi Booklists</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-xs">
              {language === 'sw' ? (
                <>
                  Zabuni za <span className="text-[#DC2626]">Shule</span> &amp; Madaftari
                </>
              ) : (
                <>
                  Better <span className="text-[#DC2626]">School Tender</span> Experiences
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#F4F4F5] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Portal rasmi ya wakuu wa shule, wahasibu na bodi za manunuzi Tanzania. Hesabu idadi ya madaftari ya wanafunzi, pata punguzo la hadi 20% la zabuni, na uletewe mizigo moja kwa moja shuleni kupitia mabasi ya mikoani.'
                : 'Dedicated procurement portal for school headmasters, bursars, and academic committees. Estimate termly exercise and counter book allocations with direct factory tender discounts up to 20%.'}
            </p>
          </div>
        </div>
      </section>

      {/* Full-Width Crimson Red Callout Strip with White Upward Triangle Notch */}
      <section className="relative w-full bg-[#D62828] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h2 className="font-heading text-lg sm:text-xl font-extrabold uppercase tracking-wide text-white">
              {language === 'sw' ? 'ZABUNI ZA SHULE & VYUO TANZANIA' : 'INSTITUTIONAL SCHOOL BOOKLIST TENDERS'}
            </h2>
            <p className="text-xs text-white/90">
              {language === 'sw'
                ? 'Stakabadhi rasmi za TRA EFD, mshono wa uzi usiochanika na punguzo la hadi 20% kwa shule.'
                : 'NECTA 8mm compliant ruling, TRA EFD fiscal tax invoices, and up to 20% institutional savings.'}
            </p>
          </div>
          <a
            href={tenderWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-[2px] bg-white text-[#111113] hover:bg-neutral-100 font-sans font-bold text-[11px] uppercase tracking-wider shrink-0"
          >
            {language === 'sw' ? 'OMBA PROFORMA SASA' : 'GET PROFORMA'}
          </a>
        </div>
        <div className="max-w-[1180px] mx-auto relative">
          <div className="absolute -bottom-10 left-6 sm:left-10 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[16px] border-b-[#F7F7F7] z-20 pointer-events-none flex items-end justify-center">
            <span className="text-[#9CA3AF] text-[10px] leading-none translate-y-[14px] font-sans">⌄</span>
          </div>
        </div>
      </section>

      {/* ==================== 2. INTERACTIVE TENDER CALCULATOR ==================== */}
      <section className="py-14 lg:py-20 bg-paper-base text-charcoal-ink">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input Form Studio */}
            <div className="lg:col-span-7 bg-white rounded-[2px] p-6 sm:p-8 border border-[#E7E5E0] space-y-6 text-left">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B91C1C] font-mono block">
                  STEP 1: ENROLLMENT &amp; DETAILS
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-ink">
                  School Specification Calculator
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-ink uppercase">School Name</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Alliance Boys High School"
                    className="w-full px-3.5 py-2.5 text-xs bg-paper-base border border-[#E7E5E0] rounded-[2px] text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-ink uppercase">Delivery Region</label>
                  <select
                    value={schoolRegion}
                    onChange={(e) => setSchoolRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-paper-base border border-[#E7E5E0] rounded-[2px] text-charcoal-ink focus:outline-none focus:border-[#DC2626] cursor-pointer"
                  >
                    {[
                      'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Kilimanjaro (Moshi)',
                      'Tanga', 'Morogoro', 'Tabora', 'Kigoma', 'Iringa', 'Ruvuma (Songea)', 'Kagera (Bukoba)',
                      'Shinyanga', 'Mara (Musoma)', 'Manyara', 'Singida', 'Zanzibar (Unguja)',
                    ].map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Education Level Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-charcoal-ink uppercase">Educational Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'primary', label: 'Primary (Std 1–7)', note: '8 books/student' },
                    { key: 'secondary', label: 'O-Level (Form 1–4)', note: '10 books/student' },
                    { key: 'highschool', label: 'A-Level (Form 5–6)', note: '12 books/student' },
                  ].map((tier) => (
                    <button
                      key={tier.key}
                      type="button"
                      onClick={() => setLevelTier(tier.key as any)}
                      className={`p-3 rounded-[2px] border text-left transition-all cursor-pointer ${
                        levelTier === tier.key
                          ? 'bg-[#DC2626] text-white border-[#DC2626] font-bold shadow-xs'
                          : 'bg-paper-base text-charcoal-ink border-[#E7E5E0] hover:border-[#111113]'
                      }`}
                    >
                      <div className="text-xs font-bold">{tier.label}</div>
                      <div className="text-[10px] mt-0.5">{tier.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Population Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-charcoal-ink uppercase">Student Population:</label>
                  <span className="font-mono font-extrabold text-sm text-[#B91C1C]">
                    {studentCount} Students
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full accent-[#DC2626] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#3F3F46] font-mono">
                  <span>50 Students</span>
                  <span>500 Students (20% Discount)</span>
                  <span>1,500+ Students</span>
                </div>
              </div>
            </div>

            {/* Right: Calculated Summary & Proforma Generator */}
            <div className="lg:col-span-5 bg-white text-charcoal-ink rounded-[2px] border border-[#E7E5E0] p-6 sm:p-8 space-y-5 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E0]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B91C1C]">
                  Tender Proforma Estimate
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#111113] text-white rounded-[2px] font-bold">
                  {Math.round(discountRate * 100)}% Institutional Saving
                </span>
              </div>

              {/* Estimated Book Breakdown */}
              <div className="space-y-2.5 text-xs text-charcoal-ink">
                <div className="flex justify-between text-[#3F3F46]">
                  <span>Student Exercise Books:</span>
                  <span className="font-mono font-bold text-charcoal-ink">
                    {totalExerciseBooks.toLocaleString()} pcs ({cartonsExercise} Boxes)
                  </span>
                </div>
                <div className="flex justify-between text-[#3F3F46]">
                  <span>Teachers &amp; Ledger Counter Books:</span>
                  <span className="font-mono font-bold text-charcoal-ink">
                    {counterBooksNeeded} pcs ({cartonsCounter} Boxes)
                  </span>
                </div>
                <div className="flex justify-between text-[#3F3F46]">
                  <span>Examination Ruled Paper:</span>
                  <span className="font-mono font-bold text-charcoal-ink">
                    {examReamsNeeded} Reams
                  </span>
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="p-4 bg-[#111113] text-white rounded-[2px] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#E4E4E7]">
                  <span>Standard Retail Total:</span>
                  <span className="line-through">{formatPrice(totalGross, currency)}</span>
                </div>
                <div className="flex justify-between text-[#F87171] font-bold">
                  <span>Tender Volume Savings:</span>
                  <span>- {formatPrice(savings, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/15">
                  <span>Estimated Net Proforma:</span>
                  <span className="text-[#F87171] text-base font-black">
                    {formatPrice(netEstimatedTotal, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href={tenderWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Request Official Stamped Proforma</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. FOUR INSTITUTIONAL GUARANTEES ==================== */}
      <section className="py-14 bg-paper-base border-t border-[#E7E5E0] text-charcoal-ink">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 border border-[#E7E5E0] text-left">
            <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-[#E7E5E0] space-y-2 hover:bg-paper-base transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#DC2626]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-ink">NECTA Syllabus Standard</h4>
              <p className="text-[11px] text-charcoal-ink">Approved 8mm ruling and margin guides compliant with Tanzanian primary and secondary exams.</p>
            </div>

            <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-[#E7E5E0] space-y-2 hover:bg-paper-base transition-colors">
              <Package className="w-6 h-6 text-[#DC2626]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-ink">Reinforced Carton Packs</h4>
              <p className="text-[11px] text-charcoal-ink">Packed in heavy-duty OMEGA 5-ply cartons with water-resistant strapping to prevent transit losses.</p>
            </div>

            <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-[#E7E5E0] space-y-2 hover:bg-paper-base transition-colors">
              <Truck className="w-6 h-6 text-[#DC2626]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-ink">Direct Bus Parcel Drop-off</h4>
              <p className="text-[11px] text-charcoal-ink">Waybill receipts sent via WhatsApp with same-day drop-off at your region's bus terminal.</p>
            </div>

            <div className="p-6 bg-white space-y-2 hover:bg-paper-base transition-colors">
              <FileText className="w-6 h-6 text-[#DC2626]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-ink">TRA EFD Invoicing</h4>
              <p className="text-[11px] text-charcoal-ink">Official fiscal receipts with school TIN/VRN compliance for government audit satisfaction.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default SchoolTendersPage;
