export type ProductCategory =
  | 'Exercise Books'
  | 'Notebooks'
  | 'School Stationery'
  | 'Pens and Pencils'
  | 'Art and Craft Supplies'
  | 'Office Supplies'
  | 'School Essentials'
  | 'Other Products';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Exercise Books',
  'Notebooks',
  'School Stationery',
  'Pens and Pencils',
  'Art and Craft Supplies',
  'Office Supplies',
  'School Essentials',
  'Other Products',
];

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  image: string;
  gallery?: string[];
  description: string;
  specifications: ProductSpecification[];
  price: number; // Price in INR
  discountPrice?: number; // Optional discounted price in INR
  stockStatus: StockStatus;
  sku: string;
  featured?: boolean;
  bestSeller?: boolean;
  isDemoData: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface StoreConfig {
  businessName: string;
  logoText: string;
  tagline: string;
  announcementText: string;
  phoneNumber: string;
  whatsappNumber: string; // Digits with country code e.g. 919876543210
  shopAddress: string;
  businessHours: string;
  googleMapsUrl: string;
  emailAddress: string;
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
