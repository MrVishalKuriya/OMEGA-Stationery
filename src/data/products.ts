import { Product, StoreConfig } from '../types/store';

// Clean, high-fidelity SVG data URIs that work 100% reliably in Vercel and local environments with zero broken images
export const IMAGES = {
  heroStationery:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
        <rect width="1200" height="675" fill="#f8fafc"/>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
          </pattern>
        </defs>
        <rect width="1200" height="675" fill="url(#grid)" />
        <!-- Stack of Books & Registers -->
        <g transform="translate(180, 160)">
          <!-- Base Register -->
          <rect x="0" y="240" width="440" height="120" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
          <rect x="15" y="248" width="415" height="104" rx="4" fill="#f1f5f9"/>
          <line x1="20" y1="270" x2="420" y2="270" stroke="#cbd5e1" stroke-width="2"/>
          <line x1="20" y1="290" x2="420" y2="290" stroke="#cbd5e1" stroke-width="2"/>
          <line x1="20" y1="310" x2="420" y2="310" stroke="#cbd5e1" stroke-width="2"/>
          <line x1="20" y1="330" x2="420" y2="330" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="0" y="240" width="40" height="120" rx="4" fill="#991b1b"/>
          
          <!-- OMEGA Exercise Book Cover -->
          <rect x="60" y="60" width="380" height="220" rx="6" fill="#b91c1c" stroke="#991b1b" stroke-width="2"/>
          <rect x="80" y="80" width="340" height="180" rx="3" fill="#ffffff"/>
          <rect x="90" y="90" width="320" height="160" fill="none" stroke="#b91c1c" stroke-width="3"/>
          <rect x="120" y="110" width="260" height="70" fill="#ffffff" stroke="#b91c1c" stroke-width="1.5"/>
          <text x="250" y="138" font-family="serif" font-weight="bold" font-size="24" fill="#b91c1c" text-anchor="middle" letter-spacing="4">OMEGA</text>
          <text x="250" y="162" font-family="sans-serif" font-weight="600" font-size="12" fill="#334155" text-anchor="middle">EXERCISE BOOK · SINGLE LINE</text>
          <line x1="130" y1="200" x2="370" y2="200" stroke="#e2e8f0" stroke-width="2"/>
          <line x1="130" y1="220" x2="370" y2="220" stroke="#e2e8f0" stroke-width="2"/>
        </g>
        <!-- Stationery Instruments -->
        <g transform="translate(700, 200)">
          <!-- Geometry Scale -->
          <rect x="20" y="40" width="360" height="48" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" transform="rotate(-15)"/>
          <line x1="50" y1="52" x2="50" y2="70" stroke="#94a3b8" stroke-width="2" transform="rotate(-15)"/>
          <line x1="90" y1="52" x2="90" y2="70" stroke="#94a3b8" stroke-width="2" transform="rotate(-15)"/>
          <line x1="130" y1="52" x2="130" y2="70" stroke="#94a3b8" stroke-width="2" transform="rotate(-15)"/>
          <!-- Fountain Pen -->
          <g transform="translate(140, 100) rotate(25)">
            <rect x="0" y="0" width="22" height="200" rx="6" fill="#0f172a"/>
            <rect x="0" y="70" width="22" height="12" fill="#d97706"/>
            <polygon points="11,-35 2,-2 20,-2" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
            <line x1="11" y1="-25" x2="11" y2="10" stroke="#78350f" stroke-width="1.5"/>
          </g>
          <!-- Graphite Pencil -->
          <g transform="translate(80, 160) rotate(15)">
            <rect x="0" y="0" width="14" height="210" fill="#dc2626"/>
            <polygon points="7,235 0,210 14,210" fill="#fed7aa"/>
            <polygon points="7,235 4,222 10,222" fill="#1e293b"/>
          </g>
        </g>
        <!-- Overlay Badge -->
        <rect x="420" y="560" width="360" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <text x="600" y="592" font-family="sans-serif" font-weight="700" font-size="14" fill="#991b1b" text-anchor="middle" letter-spacing="2">AUTHENTIC SCHOOL &amp; OFFICE SUPPLIES</text>
      </svg>
    `),
  omegaExerciseBook:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <rect width="600" height="450" fill="#fdfbf7"/>
        <g transform="translate(130, 40)">
          <!-- Shadow -->
          <rect x="12" y="12" width="320" height="360" rx="8" fill="#e2e8f0"/>
          <!-- Exercise Book Base Cover -->
          <rect x="0" y="0" width="320" height="360" rx="6" fill="#b91c1c" stroke="#991b1b" stroke-width="2"/>
          <!-- Inner White Framing -->
          <rect x="18" y="18" width="284" height="324" rx="3" fill="#ffffff"/>
          <rect x="26" y="26" width="268" height="308" fill="none" stroke="#b91c1c" stroke-width="3"/>
          <rect x="30" y="30" width="260" height="300" fill="none" stroke="#b91c1c" stroke-width="0.8"/>
          <!-- Spine tape -->
          <rect x="0" y="0" width="24" height="360" rx="2" fill="#7f1d1d"/>
          <!-- Label Box -->
          <rect x="52" y="60" width="216" height="110" fill="#ffffff" stroke="#b91c1c" stroke-width="2"/>
          <rect x="56" y="64" width="208" height="102" fill="none" stroke="#b91c1c" stroke-width="0.75"/>
          <text x="160" y="98" font-family="serif" font-weight="bold" font-size="28" fill="#b91c1c" text-anchor="middle" letter-spacing="5">OMEGA</text>
          <text x="160" y="122" font-family="sans-serif" font-weight="700" font-size="11" fill="#1e293b" text-anchor="middle" letter-spacing="1.5">EXERCISE BOOK</text>
          <text x="160" y="142" font-family="sans-serif" font-weight="500" font-size="10" fill="#64748b" text-anchor="middle">172 PAGES · SINGLE LINE · 64 GSM</text>
          <!-- Student Details Blank Lines -->
          <g transform="translate(60, 200)">
            <text x="0" y="14" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b91c1c">NAME:</text>
            <line x1="45" y1="16" x2="200" y2="16" stroke="#cbd5e1" stroke-width="1.5"/>
            <text x="0" y="38" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b91c1c">STD / DIV:</text>
            <line x1="60" y1="40" x2="200" y2="40" stroke="#cbd5e1" stroke-width="1.5"/>
            <text x="0" y="62" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b91c1c">ROLL NO:</text>
            <line x1="55" y1="64" x2="200" y2="64" stroke="#cbd5e1" stroke-width="1.5"/>
            <text x="0" y="86" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b91c1c">SUBJECT:</text>
            <line x1="55" y1="88" x2="200" y2="88" stroke="#cbd5e1" stroke-width="1.5"/>
          </g>
        </g>
      </svg>
    `),
  hardcoverNotebooks:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <rect width="600" height="450" fill="#f8fafc"/>
        <g transform="translate(140, 50)">
          <!-- Underneath Book -->
          <rect x="35" y="30" width="290" height="340" rx="6" fill="#1e293b"/>
          <rect x="45" y="35" width="275" height="330" fill="#f1f5f9"/>
          <!-- Top Register Notebook -->
          <rect x="0" y="0" width="290" height="340" rx="8" fill="#0f172a" stroke="#020617" stroke-width="2"/>
          <rect x="0" y="0" width="36" height="340" rx="4" fill="#991b1b"/>
          <!-- Gold foil imprint -->
          <rect x="65" y="80" width="180" height="120" rx="4" fill="none" stroke="#d97706" stroke-width="1.5"/>
          <text x="155" y="130" font-family="serif" font-weight="bold" font-size="18" fill="#f59e0b" text-anchor="middle" letter-spacing="3">ACADEMIC</text>
          <text x="155" y="155" font-family="sans-serif" font-weight="600" font-size="12" fill="#d97706" text-anchor="middle" letter-spacing="1">A4 LONG REGISTER</text>
          <text x="155" y="175" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">240 PAGES · SECTION SEWN</text>
          <!-- Bookmark Ribbon -->
          <path d="M 155 340 L 155 385 L 165 375 L 175 385 L 175 340 Z" fill="#dc2626"/>
        </g>
      </svg>
    `),
  pensWritingSet:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <rect width="600" height="450" fill="#fafaf9"/>
        <!-- Ruled notepad background -->
        <rect x="100" y="50" width="400" height="350" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="140" y1="50" x2="140" y2="400" stroke="#fca5a5" stroke-width="1.5"/>
        <line x1="100" y1="110" x2="500" y2="110" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="100" y1="150" x2="500" y2="150" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="100" y1="190" x2="500" y2="190" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="100" y1="230" x2="500" y2="230" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="100" y1="270" x2="500" y2="270" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="100" y1="310" x2="500" y2="310" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="100" y1="350" x2="500" y2="350" stroke="#e2e8f0" stroke-width="1"/>
        <!-- Classic Fountain Pen -->
        <g transform="translate(230, 90) rotate(18)">
          <rect x="0" y="0" width="22" height="230" rx="5" fill="#18181b"/>
          <rect x="0" y="70" width="22" height="14" fill="#eab308"/>
          <polygon points="11,-35 2,-2 20,-2" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
          <line x1="11" y1="-25" x2="11" y2="5" stroke="#854d0e" stroke-width="1.5"/>
        </g>
        <!-- Blue Examination Gel Pen -->
        <g transform="translate(300, 100) rotate(14)">
          <rect x="0" y="0" width="16" height="220" rx="4" fill="#2563eb"/>
          <rect x="0" y="160" width="16" height="40" fill="#1d4ed8"/>
          <polygon points="8,235 2,220 14,220" fill="#93c5fd"/>
        </g>
        <!-- Hexagonal Graphite Pencil -->
        <g transform="translate(360, 110) rotate(10)">
          <rect x="0" y="0" width="14" height="210" fill="#dc2626"/>
          <polygon points="7,232 0,210 14,210" fill="#fde047"/>
          <polygon points="7,232 4,222 10,222" fill="#18181b"/>
          <rect x="0" y="-12" width="14" height="12" fill="#cbd5e1"/>
          <rect x="0" y="-22" width="14" height="10" rx="2" fill="#fda4af"/>
        </g>
      </svg>
    `),
  artOfficeSupplies:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <rect width="600" height="450" fill="#f8fafc"/>
        <g transform="translate(100, 70)">
          <!-- Geometry Tin Box -->
          <rect x="0" y="0" width="400" height="200" rx="14" fill="#0284c7" stroke="#0369a1" stroke-width="3"/>
          <rect x="15" y="15" width="370" height="170" rx="8" fill="#e0f2fe"/>
          <text x="200" y="60" font-family="serif" font-weight="bold" font-size="22" fill="#0369a1" text-anchor="middle" letter-spacing="3">MATHEMATICAL INSTRUMENTS</text>
          <text x="200" y="85" font-family="sans-serif" font-weight="600" font-size="11" fill="#0284c7" text-anchor="middle">PRECISION DIE-CAST COMPASS &amp; DIVIDER SET</text>
          <!-- Set Square & Protractor Inside -->
          <polygon points="80,165 170,165 80,105" fill="none" stroke="#0284c7" stroke-width="2"/>
          <path d="M 230 165 A 40 40 0 0 1 310 165 Z" fill="none" stroke="#0284c7" stroke-width="2"/>
          <!-- Compass Instrument -->
          <line x1="180" y1="120" x2="165" y2="170" stroke="#334155" stroke-width="4"/>
          <line x1="180" y1="120" x2="195" y2="170" stroke="#334155" stroke-width="4"/>
          <circle cx="180" cy="120" r="5" fill="#d97706"/>
        </g>
        <!-- Transparent Scale Ruler in Foreground -->
        <rect x="120" y="290" width="360" height="46" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
        <line x1="150" y1="290" x2="150" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="180" y1="290" x2="180" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="210" y1="290" x2="210" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="240" y1="290" x2="240" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="270" y1="290" x2="270" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="300" y1="290" x2="300" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="330" y1="290" x2="330" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="360" y1="290" x2="360" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="390" y1="290" x2="390" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <line x1="420" y1="290" x2="420" y2="308" stroke="#64748b" stroke-width="1.5"/>
        <text x="285" y="324" font-family="sans-serif" font-weight="700" font-size="11" fill="#475569" text-anchor="middle">30 CM / 12 INCH METRIC SCALE</text>
      </svg>
    `),
};

export const INITIAL_STORE_CONFIG: StoreConfig = {
  businessName: 'Omega Stationery & Books',
  logoText: 'Ω OMEGA',
  tagline: 'Classic Bookstore, Academic Notebooks & Daily Stationery',
  announcementText:
    'DEMO CATALOG PREVIEW: All prices, stock statuses, and store contact details are editable placeholders until official shop verification.',
  phoneNumber: '+91 98765 43210 (Placeholder)',
  whatsappNumber: '919876543210',
  shopAddress: 'Shop No. 14, Saraswati Market Road, Near City High School, Main Bazaar (Editable Address Placeholder)',
  businessHours: 'Monday – Saturday: 9:00 AM – 8:30 PM · Sunday: 10:00 AM – 2:00 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Stationery+and+Book+Store',
  emailAddress: 'orders@omegastationery-demo.example',
  freeDeliveryThreshold: 499,
  standardDeliveryFee: 40,
  aboutIntro:
    'Welcome to our local bookstore and stationery storefront. Established to serve students, parents, teachers, and office professionals, we stock dependable exercise books, notebooks, writing instruments, and classroom essentials at fair everyday prices.',
  aboutProductRange:
    'Our shelves carry the full range of OMEGA-style school exercise books (single-line, four-line, square grid, unruled, and practical notebooks), alongside hardcover registers, fountain and gel pens, geometry boxes, fine art materials, and office filing supplies.',
  aboutCustomerService:
    'Whether you are preparing a complete school booklist at the start of the academic term or restocking office registers, we offer quick in-store pickup and direct WhatsApp order verification so you never waste a trip.',
  aboutValues: [
    'Authentic Paper Quality: High-opacity 60–70 GSM paper that resists ink bleed-through.',
    'Transparent Local Pricing: Fair retail prices in INR with bulk academic set convenience.',
    'Editable Storefront: All store details, products, and WhatsApp order numbers can be updated by the shop owner.',
    'Personal Verification: Every order is reviewed directly with you before dispatch or pickup.',
  ],
  isPlaceholderConfig: true,
};

export const INITIAL_PRODUCTS: Product[] = [
  // ==================== 1. EXERCISE BOOKS (6 Products) ====================
  {
    id: 'prod-omega-ex-01',
    name: 'OMEGA Exercise Book — Single Line (172 Pages)',
    category: 'Exercise Books',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook, IMAGES.heroStationery],
    description:
      'Sample catalog item inspired by the classic red-and-white OMEGA Exercise Book. Features a traditional bordered index label on the front cover, durable center-stitched binding, and smooth 64 GSM single-ruled white writing paper.',
    specifications: [
      { label: 'Ruling Type', value: 'Single Line (8mm spacing) with Red Margin' },
      { label: 'Page Count', value: '172 Pages (Including Cover)' },
      { label: 'Paper Size', value: '18 cm × 24 cm (Crown Quarto)' },
      { label: 'Paper Weight', value: '64 GSM Bright White Paper' },
      { label: 'Binding', value: 'Center-Stapled Pressed Spine' },
    ],
    price: 48,
    discountPrice: 42,
    stockStatus: 'In Stock',
    sku: 'OMG-EX-SL172',
    featured: true,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-omega-ex-02',
    name: 'OMEGA Exercise Book — Single Line (92 Pages)',
    category: 'Exercise Books',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook, IMAGES.heroStationery],
    description:
      'Standard slim OMEGA single-line school exercise book ideal for daily classwork, homework assignments, and unit test preparation. Classic red geometric border with front student name and subject box.',
    specifications: [
      { label: 'Ruling Type', value: 'Single Line with Left Margin' },
      { label: 'Page Count', value: '92 Pages' },
      { label: 'Paper Size', value: '18 cm × 24 cm' },
      { label: 'Paper Weight', value: '60 GSM Smooth Writing Paper' },
    ],
    price: 28,
    discountPrice: 25,
    stockStatus: 'In Stock',
    sku: 'OMG-EX-SL092',
    featured: false,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-omega-ex-03',
    name: 'OMEGA Four-Line English Handwriting Book (120 Pages)',
    category: 'Exercise Books',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook],
    description:
      'Primary school four-line red-and-blue ruled exercise book designed for cursive handwriting practice and early English composition. Features OMEGA protective card cover.',
    specifications: [
      { label: 'Ruling Type', value: 'Four-Line (Red & Blue Guide Lines)' },
      { label: 'Page Count', value: '120 Pages' },
      { label: 'Paper Size', value: '18 cm × 24 cm' },
      { label: 'Target Grade', value: 'Primary Classes (Grades 1–4)' },
    ],
    price: 35,
    stockStatus: 'In Stock',
    sku: 'OMG-EX-4L120',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-omega-ex-04',
    name: 'OMEGA Square Grid Mathematics Exercise Book (172 Pages)',
    category: 'Exercise Books',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook],
    description:
      'Crisp 1/2-inch square box ruling for arithmetic, algebra alignment, and school mathematics classwork. Bound in the signature red-and-white OMEGA exercise cover.',
    specifications: [
      { label: 'Ruling Type', value: 'Square Grid (Medium 10mm Boxes)' },
      { label: 'Page Count', value: '172 Pages' },
      { label: 'Paper Size', value: '18 cm × 24 cm' },
      { label: 'Paper Weight', value: '64 GSM' },
    ],
    price: 48,
    discountPrice: 44,
    stockStatus: 'In Stock',
    sku: 'OMG-EX-SQ172',
    featured: true,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-omega-ex-05',
    name: 'OMEGA Unruled Blank Exercise Book (140 Pages)',
    category: 'Exercise Books',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook],
    description:
      'Plain unruled white pages for geometry diagrams, botany sketches, mind maps, and freehand school notes. Stitched spine lays flat on classroom desks.',
    specifications: [
      { label: 'Ruling Type', value: 'Plain Unruled White' },
      { label: 'Page Count', value: '140 Pages' },
      { label: 'Paper Size', value: '18 cm × 24 cm' },
      { label: 'Paper Weight', value: '68 GSM Drawing-Friendly Stock' },
    ],
    price: 42,
    stockStatus: 'Low Stock',
    sku: 'OMG-EX-UN140',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-omega-ex-06',
    name: 'OMEGA Interleaf Science Practical Book (120 Pages)',
    category: 'Exercise Books',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook],
    description:
      'Alternating blank diagram page on the left and single-ruled observation page on the right. Essential for physics, chemistry, biology, and geography coursework.',
    specifications: [
      { label: 'Ruling Type', value: 'One Side Ruled / One Side Plain (Interleaf)' },
      { label: 'Page Count', value: '120 Pages' },
      { label: 'Cover Type', value: 'Laminated Stiff Card Cover' },
      { label: 'Includes', value: 'Printed Index & Teacher Sign-off Table' },
    ],
    price: 55,
    discountPrice: 50,
    stockStatus: 'In Stock',
    sku: 'OMG-EX-IL120',
    featured: false,
    bestSeller: true,
    isDemoData: true,
  },

  // ==================== 2. NOTEBOOKS (5 Products) ====================
  {
    id: 'prod-nb-01',
    name: 'Hardcover A4 Long Register — 240 Pages',
    category: 'Notebooks',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks, IMAGES.heroStationery],
    description:
      'Heavy-duty section-sewn hardcover A4 register for senior school subjects, college lectures, and shop bookkeeping. Includes ribbon bookmark and numbered pages.',
    specifications: [
      { label: 'Format', value: 'A4 Long (21 cm × 29.7 cm)' },
      { label: 'Page Count', value: '240 Pages' },
      { label: 'Binding', value: 'Hardbound Cloth-Reinforced Spine' },
      { label: 'Paper Weight', value: '70 GSM Ivory-Tinted Paper' },
    ],
    price: 135,
    discountPrice: 120,
    stockStatus: 'In Stock',
    sku: 'NB-REG-A4240',
    featured: true,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-nb-02',
    name: 'Spiral Bound 5-Subject Divider Notebook (300 Pages)',
    category: 'Notebooks',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Twin-wire spiral notebook with 5 repositionable colour tab dividers and micro-perforated ruled sheets. Ideal for coaching classes and university lectures.',
    specifications: [
      { label: 'Format', value: 'B5 / Royal Octavo' },
      { label: 'Page Count', value: '300 Pages (60 Pages × 5 Sections)' },
      { label: 'Binding', value: 'Snag-Free Double Wire Spiral' },
      { label: 'Paper Weight', value: '70 GSM' },
    ],
    price: 185,
    discountPrice: 165,
    stockStatus: 'In Stock',
    sku: 'NB-SPR-5SUB',
    featured: true,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-nb-03',
    name: 'Kraft Cover Stitched Composition Book (160 Pages)',
    category: 'Notebooks',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Natural 350 GSM recycled kraft card cover with contrasting black cloth spine tape. Opens 180 degrees flat for effortless note-taking and journaling.',
    specifications: [
      { label: 'Format', value: 'A5 Medium (14.8 cm × 21 cm)' },
      { label: 'Page Count', value: '160 Pages' },
      { label: 'Ruling', value: 'College Ruled (7mm)' },
      { label: 'Paper Weight', value: '75 GSM Natural Shade' },
    ],
    price: 75,
    stockStatus: 'In Stock',
    sku: 'NB-KRF-A5160',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-nb-04',
    name: 'Pocket Memo Field Notebooks — Pack of 3',
    category: 'Notebooks',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Compact shirt-pocket notebooks for quick daily to-do lists, vocabulary revision, and shopping reminders. Set of 3 stitched booklets.',
    specifications: [
      { label: 'Dimensions', value: '9 cm × 14 cm (Pocket Size)' },
      { label: 'Pack Size', value: '3 Notebooks × 64 Pages Each' },
      { label: 'Ruling', value: 'Dot Grid & Ruled Mix' },
    ],
    price: 90,
    discountPrice: 80,
    stockStatus: 'In Stock',
    sku: 'NB-PKT-3PK',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-nb-05',
    name: 'Executive Hardbound Ruled Journal — Crimson Cover',
    category: 'Notebooks',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks, IMAGES.heroStationery],
    description:
      'Classic textured crimson hardcover journal with elastic closure band, inner document pocket, and fountain-pen friendly 80 GSM cream paper.',
    specifications: [
      { label: 'Format', value: 'A5 (14.5 cm × 21 cm)' },
      { label: 'Page Count', value: '192 Pages' },
      { label: 'Paper Weight', value: '80 GSM Acid-Free Cream Paper' },
      { label: 'Extras', value: 'Elastic Band + Back Pocket + Ribbon Marker' },
    ],
    price: 220,
    discountPrice: 195,
    stockStatus: 'Low Stock',
    sku: 'NB-EXC-CRM192',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },

  // ==================== 3. SCHOOL STATIONERY (5 Products) ====================
  {
    id: 'prod-sch-01',
    name: 'Precision Mathematical Geometry Instrument Tin Box',
    category: 'School Stationery',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies, IMAGES.heroStationery],
    description:
      'Complete metal geometry set in a classic hinged tin case. Includes self-centering compass, divider, 45° and 60° set squares, 180° protractor, 15cm ruler, pencil, eraser, and sharpener.',
    specifications: [
      { label: 'Material', value: 'Die-Cast Metal Compass & High-Clarity Acrylic Scales' },
      { label: 'Contents', value: '9-Piece Complete Exam Set' },
      { label: 'Case Type', value: 'Enameled Hinged Steel Box' },
    ],
    price: 125,
    discountPrice: 110,
    stockStatus: 'In Stock',
    sku: 'SCH-GEO-TIN09',
    featured: true,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-sch-02',
    name: 'Clear Shatterproof 30 cm Long Scale Ruler (Pack of 2)',
    category: 'School Stationery',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      'Beveled-edge transparent metric and inch rulers with UV-resistant dual calibration markings for crisp technical drawing and margin ruling.',
    specifications: [
      { label: 'Length', value: '30 cm / 12 Inches' },
      { label: 'Pack Quantity', value: '2 Rulers per Pack' },
      { label: 'Material', value: 'Break-Resistant Virgin Polymer' },
    ],
    price: 30,
    stockStatus: 'In Stock',
    sku: 'SCH-RUL-30CM2',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-sch-03',
    name: 'Transparent Examination Clipboard Writing Pad',
    category: 'School Stationery',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      'Exam-hall approved clear acrylic writing board with heavy-duty stainless steel spring clip and rounded ergonomic corners. Fits A4 and foolscap answer sheets.',
    specifications: [
      { label: 'Board Size', value: '24 cm × 35 cm (Foolscap & A4 Compatible)' },
      { label: 'Thickness', value: '3mm Rigid Clear Acrylic' },
      { label: 'Clip Mechanism', value: 'Low-Profile Steel Wire Clip with Rubber Grips' },
    ],
    price: 95,
    discountPrice: 85,
    stockStatus: 'In Stock',
    sku: 'SCH-EXM-BRD01',
    featured: false,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-sch-04',
    name: 'Dust-Free White Polymer Erasers — Pack of 10',
    category: 'School Stationery',
    image: IMAGES.pensWritingSet,
    gallery: [IMAGES.pensWritingSet],
    description:
      'Soft, non-abrasive phthalate-free erasers that lift HB and 2B graphite cleanly without smudging or tearing exercise book pages. Residue rolls into a single strand.',
    specifications: [
      { label: 'Pack Quantity', value: '10 Individual Protective-Sleeve Erasers' },
      { label: 'Formulation', value: 'PVC & Latex Free' },
    ],
    price: 50,
    discountPrice: 45,
    stockStatus: 'In Stock',
    sku: 'SCH-ERS-DF10',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-sch-05',
    name: 'Long-Point Metal & Shaving Container Sharpener Set (Pack of 5)',
    category: 'School Stationery',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      'High-carbon steel angled blades that produce a durable long writing point with minimal lead breakage. Translucent body holds pencil shavings neatly during class.',
    specifications: [
      { label: 'Pack Quantity', value: '5 Sharpeners' },
      { label: 'Blade Material', value: 'Tempered German-Style Steel Blade' },
    ],
    price: 45,
    stockStatus: 'In Stock',
    sku: 'SCH-SHP-LP05',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },

  // ==================== 4. PENS AND PENCILS (5 Products) ====================
  {
    id: 'prod-pen-01',
    name: 'Classic Iridium-Nib Fountain Pen with 6 Ink Cartridges',
    category: 'Pens and Pencils',
    image: IMAGES.pensWritingSet,
    gallery: [IMAGES.pensWritingSet, IMAGES.heroStationery],
    description:
      'Balanced school and executive fountain pen featuring a fine iridium-tipped stainless steel nib, converter plunger, and 6 washable royal blue ink cartridges.',
    specifications: [
      { label: 'Nib Grade', value: 'Fine (0.5mm Smooth Iridium Point)' },
      { label: 'Filling System', value: 'Dual Use: Ink Converter + Standard Cartridges' },
      { label: 'Included Ink', value: '6 Washable Royal Blue Cartridges' },
    ],
    price: 160,
    discountPrice: 140,
    stockStatus: 'In Stock',
    sku: 'PEN-FNT-CL01',
    featured: true,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-pen-02',
    name: 'Waterproof 0.5mm Exam Gel Pens — Blue (Pack of 5)',
    category: 'Pens and Pencils',
    image: IMAGES.pensWritingSet,
    gallery: [IMAGES.pensWritingSet],
    description:
      'Quick-drying pigment gel ink pens engineered for high-speed examination writing without hand fatigue or page feathering. Textured matte grip zone.',
    specifications: [
      { label: 'Tip Size', value: '0.5mm Needle-Point Tungsten Carbide Ball' },
      { label: 'Ink Colour', value: 'Archival Exam Blue (Smudge Resistant)' },
      { label: 'Pack Quantity', value: '5 Pens' },
    ],
    price: 60,
    discountPrice: 55,
    stockStatus: 'In Stock',
    sku: 'PEN-GEL-BL05',
    featured: false,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-pen-03',
    name: 'Extra-Dark 2B/HB Hexagonal Graphite Pencils (Box of 10)',
    category: 'Pens and Pencils',
    image: IMAGES.pensWritingSet,
    gallery: [IMAGES.pensWritingSet, IMAGES.heroStationery],
    description:
      'Bonded super-dark graphite core encased in sustainably harvested linden wood for effortless sharpening. Includes complimentary eraser and sharpener inside the box.',
    specifications: [
      { label: 'Lead Grade', value: 'Extra-Dark HB/2B Hybrid' },
      { label: 'Barrel Profile', value: 'Classic Hexagonal Anti-Roll' },
      { label: 'Box Contents', value: '10 Pencils + 1 Eraser + 1 Sharpener' },
    ],
    price: 65,
    discountPrice: 58,
    stockStatus: 'In Stock',
    sku: 'PEN-PCL-HB10',
    featured: true,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-pen-04',
    name: 'Low-Viscosity 0.7mm Ballpoint Pens — Blue & Black (Pack of 10)',
    category: 'Pens and Pencils',
    image: IMAGES.pensWritingSet,
    gallery: [IMAGES.pensWritingSet],
    description:
      'Everyday reliable ballpoint pens with ventilated caps and transparent ink barrels. Contains 7 blue pens, 2 black pens, and 1 red checking pen.',
    specifications: [
      { label: 'Tip Size', value: '0.7mm Fine Ballpoint' },
      { label: 'Assortment', value: '7 Blue + 2 Black + 1 Red' },
      { label: 'Write-Out Length', value: 'Approx. 1,200 Meters per Pen' },
    ],
    price: 80,
    discountPrice: 70,
    stockStatus: 'In Stock',
    sku: 'PEN-BAL-MX10',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-pen-05',
    name: 'Metal-Grip 0.7mm Mechanical Drafting Pencil + Lead Tube',
    category: 'Pens and Pencils',
    image: IMAGES.pensWritingSet,
    gallery: [IMAGES.pensWritingSet, IMAGES.artOfficeSupplies],
    description:
      'Knurled metal lower barrel for steady balance during geometry construction, accounting ledgers, and technical sketching. Includes 1 tube of 12 polymer Hi-2B leads.',
    specifications: [
      { label: 'Lead Diameter', value: '0.7mm' },
      { label: 'Sleeve Type', value: '4mm Fixed Drafting Sleeve' },
      { label: 'Included Refill', value: '1 Tube (12 Leads, 60mm length)' },
    ],
    price: 95,
    stockStatus: 'Low Stock',
    sku: 'PEN-MCH-07DR',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },

  // ==================== 5. ART AND CRAFT SUPPLIES (4 Products) ====================
  {
    id: 'prod-art-01',
    name: '12-Shade Artist Watercolor Tubes Set (12ml Each)',
    category: 'Art and Craft Supplies',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      'Richly pigmented transparent watercolors in collapsible aluminum tubes. Formulated for smooth washes, clean color mixing, and school art competitions.',
    specifications: [
      { label: 'Tube Volume', value: '12 Tubes × 12ml' },
      { label: 'Finish', value: 'Semi-Transparent Matte' },
      { label: 'Safety', value: 'Non-Toxic EN-71 Certified' },
    ],
    price: 175,
    discountPrice: 155,
    stockStatus: 'In Stock',
    sku: 'ART-WTC-12TB',
    featured: true,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-art-02',
    name: 'Synthetic Taklon Round & Flat Paint Brush Set (6 Pieces)',
    category: 'Art and Craft Supplies',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      'Seamless brass ferrules on lacquered birch handles. Retains spring and fine point across watercolor, poster color, and acrylic craft painting.',
    specifications: [
      { label: 'Included Sizes', value: 'Round (#2, #4, #8) & Flat (#4, #8, #12)' },
      { label: 'Bristle Type', value: 'Golden Synthetic Taklon' },
    ],
    price: 120,
    discountPrice: 105,
    stockStatus: 'In Stock',
    sku: 'ART-BRS-6SET',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-art-03',
    name: 'A3 Heavyweight Cartridge Drawing & Sketch Pad (40 Sheets)',
    category: 'Art and Craft Supplies',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Acid-free 140 GSM medium-tooth cartridge paper suitable for pencil shading, charcoal, oil pastels, and light poster paint washes. Top wiro-bound.',
    specifications: [
      { label: 'Paper Size', value: 'A3 (29.7 cm × 42 cm)' },
      { label: 'Sheet Count', value: '40 Perforated Sheets (80 Pages)' },
      { label: 'Paper Weight', value: '140 GSM Acid-Free Cartridge' },
    ],
    price: 165,
    stockStatus: 'In Stock',
    sku: 'ART-SKP-A340',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-art-04',
    name: 'Hexagonal Oil Pastels — 25 Assorted Shades with Scraping Tool',
    category: 'Art and Craft Supplies',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      'Soft-blending hexagonal oil pastels that do not roll off school desks. Includes a sgraffito scraping tool and colour-mixing chart.',
    specifications: [
      { label: 'Shade Count', value: '25 Vibrant Shades' },
      { label: 'Profile', value: 'Hexagonal Easy-Grip' },
    ],
    price: 110,
    discountPrice: 95,
    stockStatus: 'Out of Stock',
    sku: 'ART-OIL-25SH',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },

  // ==================== 6. OFFICE SUPPLIES (4 Products) ====================
  {
    id: 'prod-off-01',
    name: 'Heavy-Duty Lever Arch Box File — A4/Foolscap',
    category: 'Office Supplies',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Rigid polyboard lever arch file with stainless steel arch clip, compressor bar, metal finger pull ring, and replaceable spine index label.',
    specifications: [
      { label: 'Spine Width', value: '75mm (Holds up to 500 Sheets)' },
      { label: 'Document Size', value: 'A4 & Legal / Foolscap' },
      { label: 'Edge Protection', value: 'Reinforced Metal Bottom Edges' },
    ],
    price: 145,
    discountPrice: 130,
    stockStatus: 'In Stock',
    sku: 'OFF-FIL-LA75',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-off-02',
    name: 'All-Steel No. 10 Desk Stapler with 1,000 Staples Box',
    category: 'Office Supplies',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      'Jam-resistant steel mechanism with built-in staple remover and visual reload indicator window. Bundled with 1 box of 1,000 electro-galvanized No. 10 staples.',
    specifications: [
      { label: 'Stapling Capacity', value: 'Up to 20 Sheets (80 GSM)' },
      { label: 'Throat Depth', value: '55mm' },
      { label: 'Included', value: '1 Stapler + 1,000 No. 10 Staples' },
    ],
    price: 95,
    discountPrice: 85,
    stockStatus: 'In Stock',
    sku: 'OFF-STP-N10K',
    featured: false,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-off-03',
    name: 'Repositionable Canary Yellow Sticky Notes Cube (400 Sheets)',
    category: 'Office Supplies',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Clean-removal solvent-free adhesive notes for textbook bookmarking, exam revision tabs, and office desk reminders.',
    specifications: [
      { label: 'Dimensions', value: '76mm × 76mm (3" × 3")' },
      { label: 'Sheet Count', value: '400 Sheets (4 Pads × 100 Sheets)' },
    ],
    price: 85,
    stockStatus: 'In Stock',
    sku: 'OFF-STK-YL400',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-off-04',
    name: 'A4 Display Book Clear Sheet Folder — 40 Non-Glare Pockets',
    category: 'Office Supplies',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Polypropylene portfolio folder with 40 anti-static embossed sleeves for storing academic certificates, project reports, and question papers.',
    specifications: [
      { label: 'Capacity', value: '40 Pockets (80 Viewable Sides)' },
      { label: 'Cover Thickness', value: '700 Micron Matte Polypropylene' },
    ],
    price: 115,
    discountPrice: 100,
    stockStatus: 'In Stock',
    sku: 'OFF-CLR-A440',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },

  // ==================== 7. SCHOOL ESSENTIALS (3 Products) ====================
  {
    id: 'prod-ess-01',
    name: 'Pre-Cut Brown Kraft Book Cover Roll Set + 30 Name Labels',
    category: 'School Essentials',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook, IMAGES.heroStationery],
    description:
      'High-tear-strength ribbed brown laminated kraft rolls to protect school textbooks and OMEGA exercise books throughout the academic year. Includes 30 red-bordered name stickers.',
    specifications: [
      { label: 'Roll Count', value: '3 Rolls (Covers approx. 18–20 Books)' },
      { label: 'Included Stickers', value: '30 Self-Adhesive Red Border Name Labels' },
      { label: 'Material', value: '80 GSM Poly-Coated Moisture-Resistant Kraft' },
    ],
    price: 90,
    discountPrice: 78,
    stockStatus: 'In Stock',
    sku: 'ESS-KRF-RL03',
    featured: true,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-ess-02',
    name: 'Dual-Compartment Heavy Canvas Zippered Pencil Pouch',
    category: 'School Essentials',
    image: IMAGES.pensWritingSet,
    gallery: [IMAGES.pensWritingSet],
    description:
      'Washable 12oz cotton canvas pen case with YKK metal zippers, inner mesh pocket for erasers/cartridges, and elastic loops for fountain pens and 15cm scale.',
    specifications: [
      { label: 'Dimensions', value: '21 cm × 9 cm × 6 cm' },
      { label: 'Material', value: '12oz Woven Canvas with Water-Repellent Lining' },
    ],
    price: 150,
    discountPrice: 135,
    stockStatus: 'In Stock',
    sku: 'ESS-PCH-CNV01',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-ess-03',
    name: 'Food-Grade 304 Stainless Steel School Water Bottle (750 ml)',
    category: 'School Essentials',
    image: IMAGES.heroStationery,
    gallery: [IMAGES.heroStationery],
    description:
      'Leak-proof single-wall stainless steel bottle that fits standard school bag side pockets. Wide mouth for effortless cleaning and hygienic daily hydration.',
    specifications: [
      { label: 'Capacity', value: '750 ml' },
      { label: 'Material', value: '18/8 Rust-Free 304 Grade Stainless Steel' },
      { label: 'Cap Type', value: 'Threaded Flip-Sipper with Carry Loop' },
    ],
    price: 260,
    discountPrice: 235,
    stockStatus: 'Low Stock',
    sku: 'ESS-BTL-SS750',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },

  // ==================== 8. OTHER PRODUCTS (3 Products) ====================
  {
    id: 'prod-oth-01',
    name: 'Concise Student English Dictionary — Revised Academic Edition',
    category: 'Other Products',
    image: IMAGES.hardcoverNotebooks,
    gallery: [IMAGES.hardcoverNotebooks],
    description:
      'Essential desk reference containing over 50,000 headwords, phonetic pronunciation guides, grammar usage notes, and academic essay vocabulary appendices.',
    specifications: [
      { label: 'Binding', value: 'Sewn Paperback with Vinyl Jacket' },
      { label: 'Entries', value: '50,000+ Words, Phrases & Definitions' },
      { label: 'Page Count', value: '680 Pages' },
    ],
    price: 295,
    discountPrice: 265,
    stockStatus: 'In Stock',
    sku: 'OTH-DIC-ENG01',
    featured: false,
    bestSeller: true,
    isDemoData: true,
  },
  {
    id: 'prod-oth-02',
    name: 'Updated School Atlas — India & World Physical/Political + 20 Outline Maps',
    category: 'Other Products',
    image: IMAGES.omegaExerciseBook,
    gallery: [IMAGES.omegaExerciseBook],
    description:
      'Comprehensive cartographic reference covering Indian states, river basins, mineral resources, climate zones, and world continents. Bundled with 20 practice stencil outline maps.',
    specifications: [
      { label: 'Edition', value: 'Latest Secondary Board Curriculum Edition' },
      { label: 'Bonus Included', value: '20 Practice Outline Maps (10 India + 10 World)' },
    ],
    price: 210,
    discountPrice: 185,
    stockStatus: 'In Stock',
    sku: 'OTH-ATL-SCH20',
    featured: false,
    bestSeller: false,
    isDemoData: true,
  },
  {
    id: 'prod-oth-03',
    name: '240-Function Non-Programmable Scientific & Desk Calculator',
    category: 'Other Products',
    image: IMAGES.artOfficeSupplies,
    gallery: [IMAGES.artOfficeSupplies],
    description:
      '2-line natural textbook LCD display for board and university examinations. Performs trigonometric, logarithmic, statistical, and fraction calculations with slide-on hard cover.',
    specifications: [
      { label: 'Functions', value: '240 Scientific & Statistical Functions' },
      { label: 'Display', value: '2-Line Dot Matrix + 10+2 Digit Mantissa' },
      { label: 'Power Source', value: 'Dual Solar + AAA Battery Backup' },
    ],
    price: 450,
    discountPrice: 399,
    stockStatus: 'In Stock',
    sku: 'OTH-CAL-SCI240',
    featured: true,
    bestSeller: false,
    isDemoData: true,
  },
];
