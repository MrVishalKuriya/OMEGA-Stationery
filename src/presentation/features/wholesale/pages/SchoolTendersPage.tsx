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
    <div className="bg-[#F9F8F6] min-h-screen text-[#111113]">
      <SEOHead
        title="School Booklist Tenders & Bulk Educational Procurement | OMEGA Tanzania"
        description="Official school tender portal for Tanzanian primary and secondary schools. Calculate exercise books, counter books, and exam pads with up to 20% tender discounts."
      />

      {/* ==================== 1. HERO HEADER ==================== */}
      <section className="relative overflow-hidden w-full bg-[#111113] text-[#F9F8F6] py-14 lg:py-20 border-b border-[#E7E5E0]/15">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#8C7355] text-white text-xs font-bold font-mono shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Official School Procurement &amp; Syllabi Booklists</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#F9F8F6] leading-tight">
              {language === 'sw' ? 'Zabuni za Shule na' : 'Institutional School Tenders &'} <br />
              <span className="text-[#C8A27A]">
                {language === 'sw' ? 'Manunuzi ya Madaftari ya Shule' : 'Direct Factory Booklists'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A39E93] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Portal rasmi ya wakuu wa shule, wahasibu na bodi za manunuzi Tanzania. Hesabu idadi ya madaftari ya wanafunzi, pata punguzo la hadi 20% la zabuni, na uletewe mizigo moja kwa moja shuleni kupitia mabasi ya mikoani.'
                : 'Dedicated procurement portal for school headmasters, bursars, and academic committees. Estimate termly exercise and counter book allocations with direct factory tender discounts up to 20%.'}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 2. INTERACTIVE TENDER CALCULATOR ==================== */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Input Form Studio */}
            <div className="lg:col-span-7 bg-white rounded-lg p-6 sm:p-8 shadow-xs border border-[#E7E5E0] space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E3618] font-heading block">
                  STEP 1: ENROLLMENT &amp; DETAILS
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#26130F]">
                  School Specification Calculator
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26130F] uppercase">School Name</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Alliance Boys High School"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] text-[#26130F] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26130F] uppercase">Delivery Region</label>
                  <select
                    value={schoolRegion}
                    onChange={(e) => setSchoolRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] text-[#26130F] focus:outline-none cursor-pointer"
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
                <label className="text-xs font-bold text-[#26130F] uppercase">Educational Level</label>
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
                      className={`p-3 text-left transition-all cursor-pointer ${
                        levelTier === tier.key
                          ? 'bg-[#9E3618] text-white font-bold shadow-xs'
                          : 'bg-[#FAF6F0] text-[#26130F] hover:bg-[#D8C3A5]'
                      }`}
                    >
                      <div className="text-xs font-bold">{tier.label}</div>
                      <div className="text-[10px] mt-0.5 opacity-80">{tier.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Population Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-[#26130F] uppercase">Student Population:</label>
                  <span className="font-mono font-extrabold text-sm text-[#9E3618]">
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
                  className="w-full accent-[#9E3618] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#7D685E] font-mono">
                  <span>50 Students</span>
                  <span>500 Students (20% Discount)</span>
                  <span>1,500+ Students</span>
                </div>
              </div>
            </div>

            {/* Right: Calculated Summary & Proforma Generator */}
            <div className="lg:col-span-5 bg-white text-[#26130F] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF6F0]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E3618]">
                  Tender Proforma Estimate
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#E9A858] text-[#26130F] font-bold shadow-2xs">
                  {Math.round(discountRate * 100)}% Institutional Saving
                </span>
              </div>

              {/* Estimated Book Breakdown */}
              <div className="space-y-2.5 text-xs text-[#26130F]">
                <div className="flex justify-between text-[#7D685E]">
                  <span>Student Exercise Books:</span>
                  <span className="font-mono font-bold text-[#26130F]">
                    {totalExerciseBooks.toLocaleString()} pcs ({cartonsExercise} Boxes)
                  </span>
                </div>
                <div className="flex justify-between text-[#7D685E]">
                  <span>Teachers &amp; Ledger Counter Books:</span>
                  <span className="font-mono font-bold text-[#26130F]">
                    {counterBooksNeeded} pcs ({cartonsCounter} Boxes)
                  </span>
                </div>
                <div className="flex justify-between text-[#7D685E]">
                  <span>Examination Ruled Paper:</span>
                  <span className="font-mono font-bold text-[#26130F]">
                    {examReamsNeeded} Reams
                  </span>
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="p-4 bg-[#FAF6F0] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#7D685E]">
                  <span>Standard Retail Total:</span>
                  <span className="line-through">{formatPrice(totalGross, currency)}</span>
                </div>
                <div className="flex justify-between text-[#9E3618] font-bold">
                  <span>Tender Volume Savings:</span>
                  <span>- {formatPrice(savings, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#26130F] pt-2 border-t border-[#D8C3A5]/40">
                  <span>Estimated Net Proforma:</span>
                  <span className="text-[#9E3618] text-base font-black">
                    {formatPrice(netEstimatedTotal, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href={tenderWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
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
      <section className="py-12 bg-white border-t border-[#E7E5E0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#8C7355]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113]">NECTA Syllabus Standard</h4>
              <p className="text-[11px] text-[#6E6B66]">Approved 8mm ruling and margin guides compliant with Tanzanian primary and secondary exams.</p>
            </div>

            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <Package className="w-6 h-6 text-[#8C7355]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113]">Reinforced Carton Packs</h4>
              <p className="text-[11px] text-[#6E6B66]">Packed in heavy-duty OMEGA 5-ply cartons with water-resistant strapping to prevent transit losses.</p>
            </div>

            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <Truck className="w-6 h-6 text-[#8C7355]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113]">Direct Bus Parcel Drop-off</h4>
              <p className="text-[11px] text-[#6E6B66]">Waybill receipts sent via WhatsApp with same-day drop-off at your region's bus terminal.</p>
            </div>

            <div className="p-5 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
              <FileText className="w-6 h-6 text-[#8C7355]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111113]">TRA EFD Invoicing</h4>
              <p className="text-[11px] text-[#6E6B66]">Official fiscal receipts with school TIN/VRN compliance for government audit satisfaction.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default SchoolTendersPage;
