export type ProductCategory =
  | 'Counter Books'
  | 'Exercise Books'
  | 'Registers'
  | 'Bahasha & Envelopes'
  | 'Ruled Paper'
  | 'Manila & Folders'
  | 'Flipcharts'
  | 'School Stationery'
  | 'Office Supplies'
  | 'Packaging & Cartons'
  | 'Files & Folders'
  | 'Bulk & Wholesale Paper';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Counter Books',
  'Exercise Books',
  'Registers',
  'Bahasha & Envelopes',
  'Ruled Paper',
  'Manila & Folders',
  'Flipcharts',
  'School Stationery',
  'Office Supplies',
  'Packaging & Cartons',
  'Files & Folders',
  'Bulk & Wholesale Paper',
];

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type Language = 'en' | 'sw';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  nameSw?: string;
  category: ProductCategory;
  image: string;
  gallery?: string[];
  description: string;
  descriptionSw?: string;
  specifications: ProductSpecification[];
  price: number; // Retail price in TSh
  discountPrice?: number; // Optional discounted price in TSh
  wholesalePrice?: number; // Wholesale price per carton/bundle in TSh
  wholesaleMinQty?: number; // Minimum wholesale quantity (e.g. 10 or 20)
  quire?: '2 Quire' | '3 Quire' | '4 Quire' | string;
  pageCount?: '32 Pages' | '80 Pages' | '100 Pages' | '192 Pages' | '200 Pages' | '288 Pages' | '384 Pages' | string;
  size?: 'A4' | 'A5' | 'A6' | 'Folio' | string;
  paperType?: string;
  binding?: string;
  stockStatus: StockStatus;
  sku: string;
  featured?: boolean;
  bestSeller?: boolean;
  isDemoData: boolean;
  rating?: number;
  reviewCount?: number;
  subtitle?: string;
  badge?: string;
  colorOptions?: ProductColorOption[];
}

export const formatPrice = (amount: number, currency = 'TZS'): string => {
  return `${currency} ${amount.toLocaleString('en-US')}`;
};

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface StoreConfig {
  businessName: string;
  logoText: string;
  tagline: string;
  taglineSw: string;
  brandSubtitle: string;
  brandSubtitleSw: string;
  announcementText: string;
  announcementTextSw: string;
  phoneNumber: string; // Primary: +255 715 268 391
  secondaryPhone: string; // +255 624 265 480
  thirdPhone: string; // +255 699 032 777
  phoneNumbers: string[];
  whatsappNumber: string; // 255715268391
  whatsappNumbers: { label: string; number: string; digits: string }[];
  shopAddress: string;
  shopAddressSw: string;
  businessHours: string;
  businessHoursSw: string;
  googleMapsUrl: string;
  emailAddress: string;
  currencySymbol: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  aboutIntro: string;
  aboutIntroSw: string;
  aboutProductRange: string;
  aboutProductRangeSw: string;
  aboutCustomerService: string;
  aboutCustomerServiceSw: string;
  aboutValues: string[];
  aboutValuesSw: string[];
  isPlaceholderConfig: boolean;
}

export interface CustomerOrderInput {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  selectedWhatsAppIndex?: number;
  fulfillmentType: 'Home Delivery' | 'In-Store Pickup' | 'Upcountry Bus Parcel (Mikoani)';
  paymentPreference: 'Cash on Delivery (COD)' | 'Mobile Money (M-Pesa / Tigo / Airtel)' | 'Bank Transfer (CRDB/NMB)' | 'Pay at Store Counter';
  orderNotes: string;
}

export interface DemoOrderRecord extends CustomerOrderInput {
  orderReference: string;
  createdAt: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  accountType?: 'individual' | 'wholesale' | 'school';
  role?: string;
  initials: string;
  createdAt?: string;
}

