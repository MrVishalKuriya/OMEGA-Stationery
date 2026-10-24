import { Product, StoreConfig } from '../types/store';

// High-fidelity fallback SVGs and decorative assets
export const IMAGES = {
  heroStationery: '/omega-products/counter-book-q3-288p.jpeg',
  heroCuratedShowcase: '/omega-products/catalog-sheet-counter-q2-q3-q4.jpeg',
  editorialDesk: '/omega-products/exercise-book-200p-purple.jpeg',
  giftPackaging: '/omega-products/omega-carton-box-branded.jpeg',
  omegaExerciseBook: '/omega-products/exercise-book-200p-purple.jpeg',
  counterBook: '/omega-products/counter-book-q2-192p.jpeg',
  fountainPen: '/omega-products/oxford-mathematical-set.jpeg',
  artOfficeSupplies: '/omega-products/omega-pvc-spring-file.jpeg',
  geometryInstruments: '/omega-products/oxford-mathematical-set.jpeg',
  hardcoverNotebooks: '/omega-products/counter-book-q2-192p.jpeg',
  pensWritingSet: '/omega-products/oxford-mathematical-set.jpeg',
};

export const INITIAL_STORE_CONFIG: StoreConfig = {
  businessName: 'OMEGA Writing Notebooks & Stationery',
  logoText: 'OMEGA',
  tagline: 'Quality for Every Page',
  taglineSw: 'Ubora kwa Kila Ukurasa',
  brandSubtitle: 'PREMIER TANZANIAN WRITING NOTEBOOKS · EST. 1998',
  brandSubtitleSw: 'MADAFTARI BORA YA UANDISHI TANZANIA · TANGU 1998',
  announcementText:
    'QUALITY FOR EVERY PAGE | WHOLESALE & RETAIL ORDERS ACROSS TANZANIA | OFFICIAL OMEGA DISTRIBUTOR',
  announcementTextSw:
    'UBORA KWA KILA UKURASA | ODA ZA JUMLA NA REJAREJA TANZANIA NZIMA | MSAMBAZAJI HALISI WA OMEGA',
  phoneNumber: '+255 715 268 391',
  secondaryPhone: '+255 624 265 480',
  branchMbeya: '+255 746 268 391',
  branchMwanza: '+255 699 032 777',
  thirdPhone: '+255 746 268 391',
  fourthPhone: '+255 699 032 777',
  phoneNumbers: [
    '+255 715 268 391',
    '+255 624 265 480',
    '+255 746 268 391',
    '+255 699 032 777',
  ],
  whatsappNumber: '255715268391',
  whatsappNumbers: [
    { label: 'KANTI BHAI K. HALAI (Co-Founder & MD)', number: '+255 715 268 391', digits: '255715268391', role: 'Founder & Managing Director' },
    { label: 'VIJESH K. HALAI (Co-Founder & MD)', number: '+255 624 265 480', digits: '255624265480', role: 'Co-Founder & Managing Director' },
    { label: 'Mbeya Branch (Soweto SIDO)', number: '+255 746 268 391', digits: '255746268391', role: 'Mbeya Branch' },
    { label: 'Mwanza Branch Desk', number: '+255 699 032 777', digits: '255699032777', role: 'Mwanza Branch' },
  ],
  shopAddress: 'Plot No. 30, Block F Kilwa Road, Mwanambaya-Mkuranga (Main Factory & HQ) & Soweto SIDO Viwandani (Mbeya Branch), Tanzania',
  shopAddressSw: 'Kiwanja Na. 30, Block F Barabara ya Kilwa, Mwanambaya-Mkuranga (Kiwanda Kikuu) & Soweto SIDO Viwandani (Tawi la Mbeya), Tanzania',
  businessHours: 'Monday – Saturday: 8:00 AM – 6:30 PM · Sunday: Closed',
  businessHoursSw: 'Jumatatu – Jumamosi: Saa 2:00 Asubuhi – Saa 12:30 Jioni · Jumapili: Tumefungwa',
  googleMapsUrl: 'https://maps.google.com/?q=Mwanambaya+Mkuranga+Kilwa+Road+Tanzania',
  emailAddress: 'indigoprinter06423@gmail.com',
  currencySymbol: 'TSh',
  freeDeliveryThreshold: 150000,
  standardDeliveryFee: 5000,
  aboutIntro:
    'OMEGA - Ubora Unaouaminiwa. We manufacture and supply heavy-duty Counter Books, Exercise Books, Registers, and Bahasha envelopes designed for schools, universities, offices, and institutions throughout Tanzania since 1998.',
  aboutIntroSw:
    'OMEGA - Ubora Unaouaminiwa. Tunatengeneza na kusambaza Counter Books zenye majalada magumu, Madaftari ya Mazoezi, Rejesta, na Bahasha nzito kwa ajili ya shule, vyuo, ofisi na taasisi nchini kote Tanzania tangu mwaka 1998.',
  aboutProductRange:
    'Our catalog features Hardcover Counter Books (Q2, Q3, Q4), Exercise Books (32, 80, 100, 200 Pages in Single Line, Double Line, Square Grid), Heavy Kraft Bahasha (A3, A4, A5, A6), PVC & Manila Files, Examination Ruled Paper, and Geometry Mathematical Sets.',
  aboutProductRangeSw:
    'Mkusanyiko wetu unajumuisha Counter Books za jalada gumu (Q2, Q3, Q4), Madaftari ya OMEGA (Kurasa 32, 80, 100, 200 Single Line, Double Line, Square), Bahasha nzito (A3, A4, A5, A6), Mafaili ya PVC na Manila, Karatasi za mitihani na vifaa vya kijiometri.',
  aboutCustomerService:
    'Direct instant ordering via WhatsApp on our 4 official hotlines: Kanti Bhai K. Halai (+255 715 268 391), Vijesh K. Halai (+255 624 265 480), Mbeya Branch (+255 746 268 391), and Mwanza Branch (+255 699 032 777).',
  aboutCustomerServiceSw:
    'Agiza mara moja kupitia WhatsApp kwa namba zetu 4 rasmi: Kanti Bhai K. Halai (+255 715 268 391), Vijesh K. Halai (+255 624 265 480), Tawi la Mbeya (+255 746 268 391), na Tawi la Mwanza (+255 699 032 777).',
  aboutValues: [
    'High-GSM Bleed-Proof Paper: Rigid opacity that resists fountain pen & gel ink bleed.',
    'Stiff & Rigid Hardcovers: Thread-sewn binding built to withstand daily handling for years.',
    'Indigo Precision Ruling: Accurate, clean margins and ruling conforming to educational standards.',
    'Nationwide Delivery: Fast dispatch within Dar es Salaam and reliable bus cargo parcel service to all upcountry regions.',
  ],
  aboutValuesSw: [
    'Ubora wa Hali ya Juu (High-GSM Paper): Karatasi ngumu isiyopenyeza wino wa kalamu au jeli.',
    'Uimara wa Jalada (Stiff Hardcover): Majalada imara ya kushonwa kwa nyuzi yanayodumu miaka mingi.',
    'Mistari Sahihi ya Indigo: Mistari nadhifu iliyonyooka kwa viwango rasmi vya elimu.',
    'Usambazaji Tanzania Nzima: Usafirishaji wa haraka ndani ya Dar es Salaam na huduma ya mabasi mikoani kote.',
  ],
  isPlaceholderConfig: false,
};

import initialProductsJson from './initialProducts.json';

// 44 authentic factory products pre-loaded as offline fallback and optimistic store data
export const INITIAL_PRODUCTS: Product[] = initialProductsJson as unknown as Product[];

