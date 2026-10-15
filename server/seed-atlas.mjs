import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://indigoprinteromega07_db_user:OMEGA%407016@omega.ccgcbcy.mongodb.net/omega_stationery?retryWrites=true&w=majority';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameSw: String,
    category: { type: String, required: true },
    image: String,
    gallery: [String],
    description: String,
    descriptionSw: String,
    price: { type: Number, required: true },
    discountPrice: Number,
    wholesalePrice: Number,
    wholesaleMinQty: Number,
    stockStatus: { type: String, default: 'In Stock' },
    stockQuantity: { type: Number, default: 100 },
    sku: String,
    barcode: String,
    quire: String,
    pageCount: String,
    size: String,
    paperType: String,
    binding: String,
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 120 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    specifications: [
      {
        label: String,
        value: String
      }
    ]
  },
  { collection: 'products', timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    accountType: { type: String, default: 'individual' },
    role: { type: String, default: 'CUSTOMER' },
    company: String,
    tinNumber: String
  },
  { collection: 'users', timestamps: true }
);

const ALL_OMEGA_PRODUCTS = [
  {
    id: 'prod-omega-cb-q2',
    name: 'OMEGA Hardcover Counter Book Q2 (192 Pages)',
    nameSw: 'OMEGA Daftari la Kaunta Q2 (Kurasa 192)',
    category: 'Counter Books',
    price: 56000,
    discountPrice: 52000,
    wholesalePrice: 48000,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 450,
    sku: 'OMG-CB-Q2',
    quire: '2 Quire',
    pageCount: '192 Pages',
    size: 'A4',
    paperType: '70 GSM Bleed-Proof',
    binding: 'Thread-Sewn Hardboard with Reinforced Spine',
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviewCount: 384,
    image: '/omega-products/counter-book-q2-192p.jpeg',
    gallery: [
      '/omega-products/counter-book-q2-192p.jpeg',
      '/omega-products/catalog-sheet-counter-q2-q3-q4.jpeg'
    ],
    description: 'Heavyweight OMEGA 2-Quire counter book with 192 numbered pages. Bound in scratch-resistant stiff hardboard with reinforced cloth spine and indexed header label. Perfect for daily office registry, accounting ledger, and academic note-taking.',
    descriptionSw: 'Daftari la kaunta la OMEGA Quire 2 lenye kurasa 192 zilizopangwa kwa ustadi. Jalada gumu lisilopinda kwa matumizi ya biashara na elimu.',
    specifications: [
      { label: 'Page Count', value: '192 Pages (2 Quire)' },
      { label: 'Binding', value: 'Thread-Sewn Hardboard with Reinforced Spine' },
      { label: 'Ruling', value: 'Feint Ruled with Left Red Margin' },
      { label: 'Manufacturer', value: 'OMEGA Indigo Printer · Tanzania' }
    ]
  },
  {
    id: 'prod-omega-cb-q3',
    name: 'OMEGA Hardcover Counter Book Q3 (288 Pages)',
    nameSw: 'OMEGA Daftari la Kaunta Q3 (Kurasa 288)',
    category: 'Counter Books',
    price: 57000,
    discountPrice: 53000,
    wholesalePrice: 49000,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 620,
    sku: 'OMG-CB-Q3',
    quire: '3 Quire',
    pageCount: '288 Pages',
    size: 'A4',
    paperType: '70 GSM Bleed-Proof',
    binding: 'Reinforced Thread-Sewn Hardcover',
    featured: true,
    bestSeller: true,
    rating: 5.0,
    reviewCount: 412,
    image: '/omega-products/counter-book-q3-288p.jpeg',
    gallery: [
      '/omega-products/counter-book-q3-288p.jpeg',
      '/omega-products/catalog-sheet-counter-q2-q3-q4.jpeg'
    ],
    description: 'The national standard 3-Quire archival accounting register with 288 numbered pages. Deep feint ruling with left margin. Stiff rigid cover with protective gloss lamination built to endure years of high-volume office, hospital, or school use.',
    descriptionSw: 'Daftari la kaunta la OMEGA Quire 3 lenye kurasa 288. Ubora wa juu zaidi nchini Tanzania kwa uwekaji wa kumbukumbu za mahesabu na rejesta.',
    specifications: [
      { label: 'Page Count', value: '288 Pages (3 Quire)' },
      { label: 'Binding', value: 'Reinforced Thread-Sewn Hardcover' },
      { label: 'Ruling', value: 'Feint Ruled with Left Red Margin' },
      { label: 'Manufacturer', value: 'OMEGA Indigo Printer · Tanzania' }
    ]
  },
  {
    id: 'prod-omega-cb-q4',
    name: 'OMEGA Hardcover Counter Book Q4 (384 Pages)',
    nameSw: 'OMEGA Daftari la Kaunta Q4 (Kurasa 384)',
    category: 'Counter Books',
    price: 65000,
    discountPrice: 60000,
    wholesalePrice: 56000,
    wholesaleMinQty: 5,
    stockStatus: 'In Stock',
    stockQuantity: 310,
    sku: 'OMG-CB-Q4',
    quire: '4 Quire',
    pageCount: '384 Pages',
    size: 'A4',
    paperType: '70 GSM Archival Bleed-Proof',
    binding: 'Heavy Thread-Sewn Cloth Spine',
    featured: true,
    bestSeller: false,
    rating: 4.95,
    reviewCount: 198,
    image: '/omega-products/counter-book-q4-384p.jpeg',
    gallery: [
      '/omega-products/counter-book-q4-384p.jpeg',
      '/omega-products/catalog-sheet-counter-q2-q3-q4.jpeg'
    ],
    description: 'Massive 384-page archival ledger. Stiff cover survives rigorous daily audit use. Features heavy-duty thread binding and reinforced spine.',
    descriptionSw: 'Daftari kubwa la OMEGA Quire 4 lenye kurasa 384 za kumbukumbu za miaka mingi.',
    specifications: [
      { label: 'Page Count', value: '384 Pages (4 Quire)' },
      { label: 'Ruling', value: 'Feint Ruled with Left Margin' }
    ]
  },
  {
    id: 'prod-omega-ex-200p-purple',
    name: 'OMEGA Student Exercise Book 200 Pages (Single Line)',
    nameSw: 'Daftari la Mazoezi la Wanafunzi OMEGA (Kurasa 200)',
    category: 'Exercise Books',
    price: 36000,
    discountPrice: 33000,
    wholesalePrice: 30000,
    wholesaleMinQty: 20,
    stockStatus: 'In Stock',
    stockQuantity: 1200,
    sku: 'OMG-EX-200-PUR',
    pageCount: '200 Pages',
    size: 'A5 Standard',
    paperType: '60 GSM Smooth White',
    binding: 'Heavy-Duty Saddle Stapled',
    featured: true,
    bestSeller: true,
    rating: 4.85,
    reviewCount: 520,
    image: '/omega-products/exercise-book-200p-purple.jpeg',
    description: 'Long-lasting 200-page exercise book for secondary school and college students across Tanzania. Vibrant purple laminated cover with official student index table.',
    descriptionSw: 'Daftari imara la wanafunzi lenye kurasa 200 kwa masomo ya sekondari na vyuo.',
    specifications: [
      { label: 'Ruling', value: 'Single Line Ruled' },
      { label: 'Page Count', value: '200 Pages' }
    ]
  },
  {
    id: 'prod-omega-ex-100p',
    name: 'OMEGA Primary & Secondary Exercise Book 100 Pages',
    nameSw: 'Daftari la Mazoezi la OMEGA (Kurasa 100)',
    category: 'Exercise Books',
    price: 24000,
    discountPrice: 22000,
    wholesalePrice: 19500,
    wholesaleMinQty: 20,
    stockStatus: 'In Stock',
    stockQuantity: 1800,
    sku: 'OMG-EX-100',
    pageCount: '100 Pages',
    size: 'A5 Standard',
    paperType: '60 GSM Smooth White',
    binding: 'Saddle Stapled',
    featured: false,
    bestSeller: true,
    rating: 4.8,
    reviewCount: 310,
    image: '/omega-products/exercise-book-100p-blue.jpeg',
    description: 'Standard 100-page notebook available in Single Line, Double Line and Square Grid for mathematics and English composition.',
    descriptionSw: 'Daftari la kurasa 100 kwa shule za msingi na sekondari.',
    specifications: [
      { label: 'Pack Quantity', value: 'Bundle of 12 or 24' },
      { label: 'Paper', value: 'Bleed-resistant white paper' }
    ]
  },
  {
    id: 'prod-omega-ex-80p',
    name: 'OMEGA School Exercise Book 80 Pages',
    nameSw: 'Daftari la Wanafunzi OMEGA Kurasa 80',
    category: 'Exercise Books',
    price: 18000,
    discountPrice: 16500,
    wholesalePrice: 14500,
    wholesaleMinQty: 25,
    stockStatus: 'In Stock',
    stockQuantity: 2400,
    sku: 'OMG-EX-80',
    pageCount: '80 Pages',
    size: 'A5',
    paperType: '55 GSM High-Opacity',
    binding: 'Stapled',
    featured: false,
    bestSeller: false,
    rating: 4.7,
    reviewCount: 190,
    image: '/omega-products/exercise-book-80p-green.jpeg',
    description: 'Everyday school exercise book with printed multiplication tables and metric conversion charts on rear cover.',
    descriptionSw: 'Daftari la kawaida la masomo ya kila siku lenye ratiba na majedwali.',
    specifications: [
      { label: 'Page Count', value: '80 Pages' },
      { label: 'Size', value: 'A5' }
    ]
  },
  {
    id: 'prod-omega-ex-32p',
    name: 'OMEGA Early Learning Exercise Book 32 Pages',
    nameSw: 'Daftari la Chekechea / Awali OMEGA (Kurasa 32)',
    category: 'Exercise Books',
    price: 12000,
    discountPrice: 10500,
    wholesalePrice: 9000,
    wholesaleMinQty: 30,
    stockStatus: 'In Stock',
    stockQuantity: 3000,
    sku: 'OMG-EX-32',
    pageCount: '32 Pages',
    size: 'A5',
    paperType: '60 GSM High-Tear Strength',
    binding: 'Dual Stapled',
    featured: false,
    bestSeller: false,
    rating: 4.65,
    reviewCount: 95,
    image: '/omega-products/exercise-book-32p-orange.jpeg',
    description: 'Slim lightweight exercise book for kindergarten and early primary grades. Easy for small children to handle.',
    descriptionSw: 'Daftari la kurasa 32 kwa wanafunzi wa awali na shule za chekechea.',
    specifications: [
      { label: 'Page Count', value: '32 Pages' },
      { label: 'Ruling', value: 'Large Ruled or Square' }
    ]
  },
  {
    id: 'prod-omega-bahasha-a4-pack',
    name: 'OMEGA Heavy Kraft Bahasha Envelopes A4 (Pack of 50)',
    nameSw: 'Bahasha Nzito za OMEGA A4 (Pakiti ya 50)',
    category: 'Bahasha & Envelopes',
    price: 18500,
    discountPrice: 16500,
    wholesalePrice: 14500,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 750,
    sku: 'OMG-BHS-A4-50',
    size: 'A4 Document Size (229 x 324 mm)',
    paperType: '120 GSM Pure Kraft Paper',
    binding: 'Heavy Moisture-Activated Gummed Flap',
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviewCount: 260,
    image: '/omega-products/bahasha-a4-envelope.jpeg',
    description: 'Heavyweight brown kraft envelopes for official company transcripts, tenders, bank vouchers, and court documents. Resists tearing and moisture.',
    descriptionSw: 'Bahasha nzito za khaki zisizopasuka kwa nyaraka rasmi za kiofisi na zabuni.',
    specifications: [
      { label: 'Weight', value: '120 GSM Heavy Kraft' },
      { label: 'Closure', value: 'Peel & Seal / Gummed' }
    ]
  },
  {
    id: 'prod-omega-bahasha-a3',
    name: 'OMEGA Extra-Large Bahasha Envelopes A3 (Pack of 25)',
    nameSw: 'Bahasha Kubwa za OMEGA A3 (Pakiti ya 25)',
    category: 'Bahasha & Envelopes',
    price: 26000,
    discountPrice: 24000,
    wholesalePrice: 21000,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 420,
    sku: 'OMG-BHS-A3-25',
    size: 'A3 Oversize (324 x 458 mm)',
    paperType: '140 GSM Extra-Heavy Kraft',
    binding: 'Peel-and-Seal Self-Adhesive Strip',
    featured: false,
    bestSeller: false,
    rating: 4.85,
    reviewCount: 88,
    image: '/omega-products/bahasha-a3-large.jpeg',
    description: 'Spacious A3 architectural and engineering drawing envelopes. Perfect for blueprints, posters, and unfolded contracts.',
    descriptionSw: 'Bahasha kubwa za ramani, michoro na nyaraka kubwa bila kukunjwa.',
    specifications: [
      { label: 'Dimensions', value: '324 x 458 mm' },
      { label: 'Paper', value: '140 GSM reinforced kraft' }
    ]
  },
  {
    id: 'prod-omega-bahasha-a5',
    name: 'OMEGA Medium Document Bahasha Envelopes A5 (Pack of 50)',
    nameSw: 'Bahasha za Saizi ya Kati OMEGA A5 (Pakiti ya 50)',
    category: 'Bahasha & Envelopes',
    price: 13500,
    discountPrice: 12000,
    wholesalePrice: 10500,
    wholesaleMinQty: 15,
    stockStatus: 'In Stock',
    stockQuantity: 640,
    sku: 'OMG-BHS-A5-50',
    size: 'A5 (162 x 229 mm)',
    paperType: '110 GSM Golden Kraft',
    binding: 'Gummed Flap',
    featured: false,
    bestSeller: false,
    rating: 4.75,
    reviewCount: 110,
    image: '/omega-products/bahasha-a5-medium.jpeg',
    description: 'Versatile envelope for financial receipts, certificates, passports, and official correspondence.',
    descriptionSw: 'Bahasha za kiofisi za ukubwa wa kati kwa risiti na barua.',
    specifications: [
      { label: 'Pack Count', value: '50 Envelopes' }
    ]
  },
  {
    id: 'prod-omega-bahasha-a6',
    name: 'OMEGA Compact Pocket Bahasha Envelopes A6 (Pack of 100)',
    nameSw: 'Bahasha Ndogo za Mfukoni OMEGA A6 (Pakiti ya 100)',
    category: 'Bahasha & Envelopes',
    price: 11000,
    discountPrice: 9500,
    wholesalePrice: 8000,
    wholesaleMinQty: 20,
    stockStatus: 'In Stock',
    stockQuantity: 890,
    sku: 'OMG-BHS-A6-100',
    size: 'A6 / DL Pocket Size',
    paperType: '90 GSM Kraft',
    binding: 'Moisture-Activated Flap',
    featured: false,
    bestSeller: false,
    rating: 4.7,
    reviewCount: 75,
    image: '/omega-products/bahasha-a6-small.jpeg',
    description: 'Compact envelopes suitable for wage payment slips, utility bills, business gift vouchers, and small notes.',
    descriptionSw: 'Bahasha ndogo za mishahara, risiti na vipeperushi.',
    specifications: [
      { label: 'Quantity', value: '100 Pieces per Box' }
    ]
  },
  {
    id: 'prod-omega-school-reg',
    name: 'OMEGA School Student Attendance Register (Hardcover)',
    nameSw: 'Rejesta ya Mahudhurio ya Wanafunzi OMEGA (Jalada Gumu)',
    category: 'Registers',
    price: 38000,
    discountPrice: 35000,
    wholesalePrice: 31000,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 520,
    sku: 'OMG-REG-ATT',
    size: 'Folio Standard (215 x 330 mm)',
    paperType: '80 GSM Ledger Bond',
    binding: 'Thread-Sewn Heavy Stiff Cover',
    featured: true,
    bestSeller: true,
    rating: 4.95,
    reviewCount: 215,
    image: '/omega-products/school-attendance-register.jpeg',
    description: 'Standardized attendance ledger with pre-printed 31-day columns, term totals, summary analytics and student biodata sections.',
    descriptionSw: 'Rejesta rasmi ya mahudhurio ya shule kwa muhula na mwaka mzima.',
    specifications: [
      { label: 'Capacity', value: 'Up to 60 students per page' },
      { label: 'Pages', value: 'Pre-formatted attendance grids' }
    ]
  },
  {
    id: 'prod-omega-visitors-reg',
    name: 'OMEGA Security & Gate Visitors Register (Executive Foil)',
    nameSw: 'Kitabu cha Wageni Getini OMEGA (Jalada la Dhahabu)',
    category: 'Registers',
    price: 32000,
    discountPrice: 29000,
    wholesalePrice: 26000,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 410,
    sku: 'OMG-REG-VIS',
    size: 'Landscape A4 Format',
    paperType: '75 GSM Ledger',
    binding: 'Foil-Stamped Padded Stiff Board',
    featured: false,
    bestSeller: false,
    rating: 4.88,
    reviewCount: 140,
    image: '/omega-products/gate-visitors-register.jpeg',
    description: 'Professional entrance logbook recording date, time in/out, visitor name, vehicle plate number, person visited, and signature.',
    descriptionSw: 'Kitabu cha wageni kwa ajili ya ofisi, mageti na hoteli.',
    specifications: [
      { label: 'Format', value: 'Columns for Date, Time, Name, ID, Signature' }
    ]
  },
  {
    id: 'prod-omega-exam-paper',
    name: 'OMEGA Ruled Examination Paper (Ream of 500 Sheets)',
    nameSw: 'Karatasi za Mitihani za OMEGA (Rimi ya Karatasi 500)',
    category: 'Ruled Paper',
    price: 28000,
    discountPrice: 25500,
    wholesalePrice: 23000,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 950,
    sku: 'OMG-RP-500',
    size: 'A4 Single Sheets (210 x 297 mm)',
    paperType: '70 GSM Pure White Bond',
    binding: 'Shrink-Wrapped Ream',
    featured: true,
    bestSeller: true,
    rating: 4.9,
    reviewCount: 430,
    image: '/omega-products/ruled-exam-paper-ream.jpeg',
    description: 'Precision ruled paper with red left margin, pre-punched binder holes, and header for candidate number, subject, and date.',
    descriptionSw: 'Karatasi rasmi za mitihani na majaribio ya shule na vyuo.',
    specifications: [
      { label: 'Sheet Count', value: '500 Sheets per Ream' }
    ]
  },
  {
    id: 'prod-omega-graph-paper',
    name: 'OMEGA Metric Millimeter Graph Paper (Pad of 100 Sheets)',
    nameSw: 'Karatasi za Grafu za OMEGA (Pedi ya Karatasi 100)',
    category: 'Ruled Paper',
    price: 14000,
    discountPrice: 12500,
    wholesalePrice: 11000,
    wholesaleMinQty: 20,
    stockStatus: 'In Stock',
    stockQuantity: 620,
    sku: 'OMG-GP-100',
    size: 'A4',
    paperType: '80 GSM Cartographic Green/Blue Grid',
    binding: 'Glued Top Pad',
    featured: false,
    bestSeller: false,
    rating: 4.8,
    reviewCount: 160,
    image: '/omega-products/graph-paper-pad.jpeg',
    description: '1mm, 5mm, and 10mm high-accuracy grid lines for physics, chemistry, engineering diagrams, and geography cartography.',
    descriptionSw: 'Karatasi za grafu zenye mistari sahihi ya vipimo vya milimita.',
    specifications: [
      { label: 'Grid', value: '1mm / 5mm / 10mm Metric Grid' }
    ]
  },
  {
    id: 'prod-omega-flipchart',
    name: 'OMEGA Presentation Flipchart Paper (Stack of 50 Sheets)',
    nameSw: 'Karatasi za Flipchart za OMEGA (Pakiti ya 50)',
    category: 'Flipcharts',
    price: 35000,
    discountPrice: 32000,
    wholesalePrice: 28500,
    wholesaleMinQty: 5,
    stockStatus: 'In Stock',
    stockQuantity: 380,
    sku: 'OMG-FC-50',
    size: 'Standard Easel Size (650 x 1000 mm)',
    paperType: '70 GSM Heavy Easel Paper',
    binding: 'Perforated Top Header with Universal Clamp Slots',
    featured: false,
    bestSeller: false,
    rating: 4.85,
    reviewCount: 92,
    image: '/omega-products/flipchart-stack-large.jpeg',
    description: 'Heavy-weight giant easel pad paper for conference rooms, training seminars, workshops, and classroom lectures.',
    descriptionSw: 'Karatasi za mikutano na mafunzo kwenye stendi za easel.',
    specifications: [
      { label: 'Dimensions', value: '650 x 1000 mm' }
    ]
  },
  {
    id: 'prod-omega-manila-folder',
    name: 'OMEGA Heavyweight Manila File Folders (Bundle of 100)',
    nameSw: 'Mafaili ya Manila ya OMEGA (Mfungo wa 100)',
    category: 'Manila & Folders',
    price: 25000,
    discountPrice: 22500,
    wholesalePrice: 20000,
    wholesaleMinQty: 10,
    stockStatus: 'In Stock',
    stockQuantity: 840,
    sku: 'OMG-MF-100',
    size: 'Foolscap Document Size',
    paperType: '250 GSM High-Density Manila Cardstock',
    binding: 'Creased Center Spine with Pre-Punched Fastener Slots',
    featured: false,
    bestSeller: true,
    rating: 4.9,
    reviewCount: 280,
    image: '/omega-products/manila-file-folder-flat.jpeg',
    description: 'Classic buff-yellow high-density manila cardstock folders with pre-punched fastener slots. Long shelf life in tropical climate.',
    descriptionSw: 'Mafaili ya manila yenye unene thabiti yanayodumu kwenye unyevu.',
    specifications: [
      { label: 'Bundle', value: '100 Folders per Bundle' }
    ]
  },
  {
    id: 'prod-omega-pvc-spring',
    name: 'OMEGA Executive PVC Spring Action File',
    nameSw: 'Faili la Kisasa la PVC Spring OMEGA',
    category: 'Files & Folders',
    price: 7500,
    discountPrice: 6500,
    wholesalePrice: 5500,
    wholesaleMinQty: 20,
    stockStatus: 'In Stock',
    stockQuantity: 910,
    sku: 'OMG-PVC-SPR',
    size: 'A4 / Foolscap',
    paperType: 'Heavy Rigid PVC Polypropylene Shell',
    binding: 'Heavy Stainless Steel Spring Clamp Mechanism',
    featured: false,
    bestSeller: false,
    rating: 4.8,
    reviewCount: 115,
    image: '/omega-products/omega-pvc-spring-file.jpeg',
    description: 'Durable moisture-proof plastic binder with heavy stainless steel spring clamp mechanism that grips up to 150 punched sheets.',
    descriptionSw: 'Faili la plastiki ya PVC lenye spring ya chuma isiyo na kutu.',
    specifications: [
      { label: 'Capacity', value: 'Holds up to 150 sheets securely' }
    ]
  },
  {
    id: 'prod-omega-math-set',
    name: 'Oxford Mathematical Instruments Geometry Set',
    nameSw: 'Vifaa vya Jiometria vya Oxford (Math Set)',
    category: 'School Stationery',
    price: 9500,
    discountPrice: 8500,
    wholesalePrice: 7200,
    wholesaleMinQty: 24,
    stockStatus: 'In Stock',
    stockQuantity: 1100,
    sku: 'OMG-MS-OXF',
    size: 'Tin Case Dimensions: 180 x 80 mm',
    paperType: 'N/A (Precision Die-Cast Metal & Clear Acrylic)',
    binding: 'Heavy Embossed Metal Protective Tin',
    featured: true,
    bestSeller: true,
    rating: 4.95,
    reviewCount: 460,
    image: '/omega-products/oxford-mathematical-set.jpeg',
    description: 'Classic embossed tin box containing die-cast metal compass, divider, 15cm ruler, 180° protractor, set squares, sharpener, and eraser.',
    descriptionSw: 'Seti kamili ya kijiometria katika sanduku la bati kwa masomo ya hisabati.',
    specifications: [
      { label: 'Contents', value: '9 essential geometry tools in metal case' }
    ]
  },
  {
    id: 'prod-omega-shorthand',
    name: 'OMEGA Wire-Bound Shorthand Steno Notebook (160 Pages)',
    nameSw: 'Daftari la Shorthand la OMEGA (Kurasa 160)',
    category: 'Registers',
    price: 8500,
    discountPrice: 7500,
    wholesalePrice: 6200,
    wholesaleMinQty: 15,
    stockStatus: 'In Stock',
    stockQuantity: 470,
    sku: 'OMG-SN-160',
    size: '150 x 225 mm Steno Standard',
    paperType: '65 GSM High-Speed Writing Paper',
    binding: 'Twin-Wire Top Spiral Bound with Rigid Cardboard Backing',
    featured: false,
    bestSeller: false,
    rating: 4.75,
    reviewCount: 65,
    image: '/omega-products/omega-shorthand-notebook.jpeg',
    description: 'Top-spiral notebook with center-line ruling for reporters, secretaries, meeting minutes, and field research.',
    descriptionSw: 'Daftari la spiral la kurekodi maelezo haraka kwenye mikutano.',
    specifications: [
      { label: 'Binding', value: 'Twin-wire top spiral' }
    ]
  },
  {
    id: 'prod-omega-petty-cash',
    name: 'OMEGA Accounting Petty Cash Vouchers (Pad of 100)',
    nameSw: 'Voucher za Petty Cash OMEGA (Kitabu cha 100)',
    category: 'Office Supplies',
    price: 6000,
    discountPrice: 5000,
    wholesalePrice: 4200,
    wholesaleMinQty: 20,
    stockStatus: 'In Stock',
    stockQuantity: 830,
    sku: 'OMG-PCV-100',
    size: '130 x 185 mm',
    paperType: '60 GSM Duplicate Bond',
    binding: 'Glue Top Pad with Perforated Tear-Out',
    featured: false,
    bestSeller: false,
    rating: 4.8,
    reviewCount: 95,
    image: '/omega-products/omega-petty-cash-voucher.jpeg',
    description: 'Sequential duplicate vouchers for office expense tracking and bookkeeping audit.',
    descriptionSw: 'Voucher za malipo madogo ya kiofisi zenye namba za mpangilio.',
    specifications: [
      { label: 'Pack', value: 'Pad of 100 duplicate slips' }
    ]
  },
  {
    id: 'prod-omega-carton-box',
    name: 'OMEGA Branded Corrugated Shipping Cartons (Bundle of 25)',
    nameSw: 'Maboksi ya Kusafirishia ya OMEGA (Mfungo wa 25)',
    category: 'Packaging & Cartons',
    price: 45000,
    discountPrice: 40000,
    wholesalePrice: 35000,
    wholesaleMinQty: 5,
    stockStatus: 'In Stock',
    stockQuantity: 320,
    sku: 'OMG-CTN-25',
    size: '420 x 300 x 280 mm Master Box',
    paperType: 'Heavy 5-Ply Double-Wall Corrugated Flute',
    binding: 'Stitched & Glued Flaps with Printed Fragile Icons',
    featured: false,
    bestSeller: false,
    rating: 4.9,
    reviewCount: 78,
    image: '/omega-products/omega-carton-box-branded.jpeg',
    description: 'Double-wall 5-ply corrugated cardboard boxes for parcel shipment to upcountry regions across Tanzania.',
    descriptionSw: 'Maboksi magumu ya kusafirishia vifaa vya shule mikoani kote.',
    specifications: [
      { label: 'Bundle', value: '25 Heavyweight Master Cartons' }
    ]
  }
];

const SEED_USERS = [
  {
    id: 'usr-mussa-juma',
    name: 'Mussa Juma',
    email: 'mussa.juma@omega.co.tz',
    password: 'password123',
    phone: '+255 715 268 391',
    accountType: 'wholesale',
    role: 'CUSTOMER',
    company: 'Juma Stationery Wholesalers Ltd',
    tinNumber: '109-876-543'
  },
  {
    id: 'usr-omega-admin',
    name: 'OMEGA Admin',
    email: 'admin@omega.co.tz',
    password: 'admin123',
    phone: '+255 624 265 480',
    accountType: 'school',
    role: 'ADMIN',
    company: 'OMEGA Indigo Printer HQ',
    tinNumber: '100-200-300'
  },
  {
    id: 'usr-dar-academy',
    name: 'Dar Academy Purchasing',
    email: 'purchasing@daracademy.sc.tz',
    password: 'school123',
    phone: '+255 699 032 777',
    accountType: 'school',
    role: 'CUSTOMER',
    company: 'Dar es Salaam International Academy',
    tinNumber: '210-340-560'
  }
];

async function runSeed() {
  console.log('🚀 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected successfully to MongoDB Atlas: omega_stationery');

  const Product = mongoose.model('Product', productSchema);
  const User = mongoose.model('User', userSchema);

  console.log(`📦 Upserting ${ALL_OMEGA_PRODUCTS.length} OMEGA Products into MongoDB...`);
  for (const prod of ALL_OMEGA_PRODUCTS) {
    await Product.findOneAndUpdate(
      { id: prod.id },
      { $set: prod },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Product seeded: ${prod.id} (${prod.name})`);
  }

  console.log(`👤 Upserting ${SEED_USERS.length} Test & Admin Users into MongoDB...`);
  for (const usr of SEED_USERS) {
    await User.findOneAndUpdate(
      { email: usr.email },
      { $set: usr },
      { upsert: true, new: true }
    );
    console.log(`  ✓ User seeded: ${usr.email} (${usr.role})`);
  }

  const finalProductCount = await Product.countDocuments();
  const finalUserCount = await User.countDocuments();

  console.log('\n======================================================');
  console.log(`🎉 SUCCESS! MongoDB Atlas is now fully seeded:`);
  console.log(`   - Total Products in MongoDB: ${finalProductCount}`);
  console.log(`   - Total Users in MongoDB:    ${finalUserCount}`);
  console.log('======================================================');

  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Error during Atlas seed:', err);
  process.exit(1);
});
