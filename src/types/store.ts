export type ProductCategory =
  | 'Counter Books'
  | 'Exercise Books'
  | 'Bahasha & Envelopes'
  | 'Files & Folders'
  | 'School Stationery'
  | 'Office Supplies'
  | 'Bulk & Wholesale Paper'
  | 'Packaging & Cartons';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Counter Books',
  'Exercise Books',
  'Bahasha & Envelopes',
  'Files & Folders',
  'School Stationery',
  'Office Supplies',
  'Bulk & Wholesale Paper',
  'Packaging & Cartons',
];

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

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
  category: ProductCategory;
  image: string;
  gallery?: string[];
  description: string;
  specifications: ProductSpecification[];
  price: number; // Price in TSh
  discountPrice?: number; // Optional discounted price in TSh
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

export const formatPrice = (amount: number, currency = 'TSh'): string => {
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
  brandSubtitle: string;
  announcementText: string;
  phoneNumber: string;
  whatsappNumber: string; // Digits with country code e.g. 255715268391
  shopAddress: string;
  businessHours: string;
  googleMapsUrl: string;
  emailAddress: string;
  currencySymbol: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  aboutIntro: string;
  aboutProductRange: string;
  aboutCustomerService: string;
  aboutValues: string[];
  isPlaceholderConfig: boolean;
}

export interface CustomerOrderInput {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  fulfillmentType: 'Home Delivery' | 'In-Store Pickup';
  paymentPreference: 'Cash on Delivery (COD)' | 'UPI on Delivery' | 'Pay at Store Counter';
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
