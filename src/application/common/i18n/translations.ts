import { Language } from '@/types/store';

export const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    catalog: 'Products Catalogue',
    about: 'About OMEGA',
    contact: 'Contact Us',
    admin: 'Admin Dashboard',
    cart: 'Cart & WhatsApp Order',
    cartItems: 'Items',
    searchPlaceholder: 'Search notebooks, counter books, bahasha...',
    
    // Header & Brand
    qualityTagline: 'Quality for Every Page',
    brandSubtitle: 'PREMIER TANZANIAN WRITING NOTEBOOKS · EST. 1998',
    freeDeliveryNote: 'WHOLESALE & RETAIL ORDERS ACROSS TANZANIA | OFFICIAL OMEGA DISTRIBUTOR',
    switchLanguage: 'Kiswahili',
    phoneSupport: 'Order Hotline',
    
    // Hero Section
    heroBadge: 'PREMIUM TANZANIAN STATIONERY',
    heroTitle: 'Quality for Every Page',
    heroSubtitle:
      'Engineered with stiff hardboard covers, high-GSM bleed-proof paper, and thread-sewn bindings. Trusted by schools, colleges, institutions, and businesses across Tanzania.',
    exploreCatalog: 'Explore Products',
    orderOnWhatsApp: 'Order on WhatsApp',
    wholesaleEnquiry: 'Wholesale Enquiry',
    hero3DHint: 'Interactive 3D Preview: Drag or rotate the OMEGA Counter Book to inspect cover & spine',
    
    // 3D Model Controls
    rotateAuto: 'Auto-Rotate',
    rotatePause: 'Pause Rotation',
    frontView: 'Front Cover',
    spineView: 'Cloth Spine',
    angleView: '3D Angle',
    openView: 'Inside Pages',
    selectQuire: 'Select Quire / Size:',
    quire2Label: 'Q2 (192 Pages)',
    quire3Label: 'Q3 (288 Pages)',
    quire4Label: 'Q4 (384 Pages)',

    // Positive Thinking & Writing Section
    positiveThinkingBadge: 'POSITIVE THINKING & WRITING',
    positiveThinkingTitle: 'Great Thoughts Begin on Clean Pages',
    positiveThinkingSubtitle:
      'Writing by hand sharpens intellect, organizes visions, and brings clarity to future leaders.',
    positiveQuotes: [
      {
        quote:
          '“Every great enterprise, academic distinction, and national progress begins with a single handwritten thought on a reliable page.”',
        author: 'OMEGA Writing Philosophy',
        role: 'Excellence in Education',
      },
      {
        quote:
          '“When you write in an OMEGA notebook, your ink never bleeds, your binding never loosens, and your dedication remains preserved.”',
        author: 'Mwalimu & Scholar Approved',
        role: 'High-GSM Precision Paper',
      },
      {
        quote:
          '“Mawazo chanya na uandishi bora huleta mafanikio ya kudumu. Jenga kesho yako leo kwa kalamu na daftari bora.”',
        author: 'Dar es Salaam Stationery Guild',
        role: 'Tanzania Heritage',
      },
    ],

    // Product Categories
    categoriesTitle: 'Browse By Category',
    allProducts: 'All Products',
    counterBooks: 'Counter Books',
    exerciseBooks: 'Exercise Books',
    registers: 'Registers',
    bahasha: 'Bahasha & Envelopes',
    ruledPaper: 'Ruled Paper',
    manilaFolders: 'Manila & Folders',
    flipcharts: 'Flipcharts',
    schoolStationery: 'School Stationery',
    officeSupplies: 'Office Supplies',

    // Product Card & Details
    quire: 'Quire',
    pages: 'Pages',
    size: 'Size',
    paperType: 'Paper Type',
    binding: 'Binding',
    retailPrice: 'Retail Price',
    wholesalePrice: 'Wholesale Price',
    minOrderQty: 'Min Wholesale Qty',
    stockStatus: 'Stock Status',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    addToOrder: 'Add to Order',
    addedToOrder: 'Added to Order!',
    buyViaWhatsApp: 'Direct WhatsApp Order',
    viewDetails: 'View Details',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    specifications: 'Specifications',
    productDescription: 'Product Description',
    galleryView: 'Product Photography Gallery',

    // WhatsApp Order Flow
    whatsAppOrderingTitle: 'WhatsApp Instant Order',
    whatsAppOrderingDesc:
      'Select your products and quantities. A formatted order message will be generated automatically for our sales team.',
    choosePhone: 'Select Sales Desk WhatsApp Number:',
    fullName: 'Your Full Name',
    phoneNumber: 'Your Phone / WhatsApp Number',
    deliveryLocation: 'Delivery City / Region / Street',
    deliveryOptions: 'Fulfillment Preference',
    homeDelivery: 'Door Delivery (Dar es Salaam)',
    pickupStore: 'In-Store Counter Pickup (Dar es Salaam)',
    mikoaniParcel: 'Upcountry Bus Parcel (Mikoani)',
    paymentMethod: 'Payment Preference',
    mobileMoney: 'Mobile Money (M-Pesa / Tigo Pesa / Airtel Money)',
    cashOnDelivery: 'Cash on Delivery (Dar es Salaam)',
    bankTransfer: 'Bank Transfer (CRDB / NMB)',
    orderNotes: 'Additional Notes / School Name / Tender Reference',
    sendWhatsAppBtn: 'Send Order via WhatsApp',

    // Wholesale Section
    wholesaleTitle: 'Wholesale & Institutional Supply',
    wholesaleDesc:
      'We supply schools, colleges, bookstores, stationery shops, government agencies, and corporate offices with factory-direct bulk pricing.',
    wholesaleBenefit1: 'Special carton and ream bundle discounts',
    wholesaleBenefit2: 'Reliable freight across all regions of Tanzania',
    wholesaleBenefit3: 'Official EFD receipts & tax invoices provided',
    requestWholesaleQuote: 'Request Wholesale Price List',

    // Footer
    footerAbout:
      'OMEGA is Tanzania’s trusted manufacturer and distributor of high-quality writing notebooks, hardcover counter books, envelopes (bahasha), and educational stationery.',
    quickLinks: 'Quick Links',
    officialContacts: 'Official Contacts',
    workingHours: 'Business Working Hours',
    rightsReserved: 'All rights reserved. OMEGA Writing Notebooks & Stationery.',
  },

  sw: {
    // Navigation
    home: 'Mwanzo',
    catalog: 'Katalogi ya Bidhaa',
    about: 'Kuhusu OMEGA',
    contact: 'Wasiliana Nasi',
    admin: 'Dashibodi ya Wasimamizi',
    cart: 'Kikapu na Oda ya WhatsApp',
    cartItems: 'Bidhaa',
    searchPlaceholder: 'Tafuta madaftari, counter books, bahasha...',

    // Header & Brand
    qualityTagline: 'Ubora kwa Kila Ukurasa',
    brandSubtitle: 'MADAFTARI BORA YA UANDISHI TANZANIA · TANGU 1998',
    freeDeliveryNote: 'MAUZO YA JUMLA NA REJAREJA TANZANIA NZIMA | MSAMBAZAJI HALISI WA OMEGA',
    switchLanguage: 'English',
    phoneSupport: 'Namba za Simu',

    // Hero Section
    heroBadge: 'STATIONERY BORA YA TANZANIA',
    heroTitle: 'Ubora kwa Kila Ukurasa',
    heroSubtitle:
      'Madaftari ya OMEGA yenye majalada magumu, karatasi nene isiyopenyeza wino, na mshono imara wa nyuzi. Chaguo linaloaminika na shule, vyuo, taasisi na ofisi kote nchini Tanzania.',
    exploreCatalog: 'Tazama Bidhaa Zote',
    orderOnWhatsApp: 'Agiza kwa WhatsApp',
    wholesaleEnquiry: 'Maulizo ya Bei ya Jumla',
    hero3DHint: 'Mwonekano wa 3D: Zungusha Counter Book ya OMEGA kuona jalada, mgongo na kurasa',

    // 3D Model Controls
    rotateAuto: 'Zungusha Kiotomatiki',
    rotatePause: 'Simamisha Mzunguko',
    frontView: 'Jalada la Mbele',
    spineView: 'Mgongo wa Kitabu',
    angleView: 'Mwonekano wa 3D',
    openView: 'Kurasa za Ndani',
    selectQuire: 'Chagua Quire / Ukubwa:',
    quire2Label: 'Q2 (Kurasa 192)',
    quire3Label: 'Q3 (Kurasa 288)',
    quire4Label: 'Q4 (Kurasa 384)',

    // Positive Thinking & Writing Section
    positiveThinkingBadge: 'MAWAZO MAZURI NA UANDISHI BORA',
    positiveThinkingTitle: 'Mawazo Mazuri Hujengwa kwa Karatasi na Kalamu Bora',
    positiveThinkingSubtitle:
      'Kuandika kwa mkono kunanoa akili, kunaratibu ndoto, na huleta mwanga kwa viongozi wa kesho.',
    positiveQuotes: [
      {
        quote:
          '“Kila biashara kubwa, ufaulu mzuri wa kitaaluma, na maendeleo ya taifa huanza na wazo lililoandikwa vizuri katika ukurasa safi wa daftari.”',
        author: 'Falsafa ya Uandishi ya OMEGA',
        role: 'Kujituma na Elimu Bora',
      },
      {
        quote:
          '“Unapoandika kwenye daftari la OMEGA, wino haupenyezi upande wa pili, jalada halilegei, na kumbukumbu zako zinadumu miaka mingi.”',
        author: 'Inapendwa na Walimu & Wanafunzi',
        role: 'Karatasi Imara ya Kiwango cha Juu',
      },
      {
        quote:
          '“Mawazo chanya na uandishi bora huleta mafanikio ya kudumu. Jenga kesho yako leo kwa kalamu na daftari bora la OMEGA.”',
        author: 'Umoja wa Wasambazaji Dar es Salaam',
        role: 'Urithi wa Kitanzania',
      },
    ],

    // Product Categories
    categoriesTitle: 'Chagua kwa Aina ya Bidhaa',
    allProducts: 'Bidhaa Zote',
    counterBooks: 'Counter Books',
    exerciseBooks: 'Madaftari ya Mazoezi',
    registers: 'Madaftari ya Rejesta',
    bahasha: 'Bahasha & Envelopes',
    ruledPaper: 'Karatasi za Mistari (Ream)',
    manilaFolders: 'Mafaili ya Manila',
    flipcharts: 'Karatasi za Flipchart',
    schoolStationery: 'Vifaa vya Shule',
    officeSupplies: 'Vifaa vya Ofisi',

    // Product Card & Details
    quire: 'Quire',
    pages: 'Kurasa',
    size: 'Ukubwa',
    paperType: 'Aina ya Karatasi',
    binding: 'Muundo wa Mshono',
    retailPrice: 'Bei ya Rejareja',
    wholesalePrice: 'Bei ya Jumla',
    minOrderQty: 'Kiwango cha Chini cha Jumla',
    stockStatus: 'Hali ya Stoo',
    inStock: 'Ipo Stoo',
    lowStock: 'Zimebaki Chache',
    outOfStock: 'Imeisha kwa Sasa',
    addToOrder: 'Weka Kwenye Oda',
    addedToOrder: 'Imewekwa Kwenye Oda!',
    buyViaWhatsApp: 'Agiza Moja kwa Moja WhatsApp',
    viewDetails: 'Tazama Maelezo',
    quantity: 'Idadi',
    subtotal: 'Jumla Ndogo',
    specifications: 'Vipimo na Sifa',
    productDescription: 'Maelezo ya Kina',
    galleryView: 'Picha za Bidhaa',

    // WhatsApp Order Flow
    whatsAppOrderingTitle: 'Oda ya Haraka kupitia WhatsApp',
    whatsAppOrderingDesc:
      'Chagua bidhaa na idadi unayohitaji. Ujumbe uliopangwa vizuri utatengenezwa kiotomatiki ili kutumwa kwa wauzaji wetu.',
    choosePhone: 'Chagua Namba ya Mauzo ya WhatsApp:',
    fullName: 'Jina Lako Kamili',
    phoneNumber: 'Namba Yako ya Simu / WhatsApp',
    deliveryLocation: 'Mkoa / Wilaya / Eneo la Kufikishiwa',
    deliveryOptions: 'Njia ya Kupokea Mzigo',
    homeDelivery: 'Kufikishiwa Mlangoni (Dar es Salaam)',
    pickupStore: 'Kufuata Dukani / Stoo (Dar es Salaam)',
    mikoaniParcel: 'Kutumiwa kwa Basi / Mzigo (Mikoani)',
    paymentMethod: 'Njia Unayopendelea ya Kulipa',
    mobileMoney: 'M-Pesa / Tigo Pesa / Airtel Money',
    cashOnDelivery: 'Pesa Taslimu Mlangoni (Dar es Salaam)',
    bankTransfer: 'Benki (CRDB / NMB)',
    orderNotes: 'Maelezo ya Ziada / Jina la Shule / Taasisi',
    sendWhatsAppBtn: 'Tuma Oda kwa WhatsApp Sasa',

    // Wholesale Section
    wholesaleTitle: 'Ugavi wa Jumla kwa Shule & Taasisi',
    wholesaleDesc:
      'Tunasambaza kwa shule, vyuo, maduka ya vitabu, na ofisi za serikali na binafsi kwa bei nafuu ya kiwandani ya katoni na mabunda.',
    wholesaleBenefit1: 'Punguzo maalum la bei kwa katoni na mabunda makubwa',
    wholesaleBenefit2: 'Usafirishaji wa uhakika mikoa yote ya Tanzania',
    wholesaleBenefit3: 'Stakabadhi rasmi za EFD na ankara za kodi hutolewa',
    requestWholesaleQuote: 'Omba Orodha Kamili ya Bei za Jumla',

    // Footer
    footerAbout:
      'OMEGA ni mtengenezaji na msambazaji anayeaminika Tanzania kwa madaftari bora ya uandishi, counter books za jalada gumu, bahasha nzito, na vifaa vya elimu.',
    quickLinks: 'Viungo vya Haraka',
    officialContacts: 'Mawasiliano Rasmi',
    workingHours: 'Muda wa Kazi',
    rightsReserved: 'Haki zote zimehifadhiwa. OMEGA Writing Notebooks & Stationery.',
  },
};
