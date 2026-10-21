import { z } from 'zod';

export const productCategoryEnum = z.enum([
  'Counter Books',
  'Exercise Books',
  'Envelopes (Bahasha)',
  'Files & Folders',
  'Examination Paper',
  'Mathematical Sets',
  'Notepads & Shorthand',
  'Drawing & Registers',
  'Office Stationery',
  'Wholesale Bundles',
]);

export const stockStatusEnum = z.enum(['In Stock', 'Low Stock', 'Out of Stock']);

/**
 * Strict Zod validation schema for Admin Product creation and editing
 */
export const productFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Product title must be at least 3 characters long')
    .max(150, 'Product title cannot exceed 150 characters'),
  category: productCategoryEnum,
  sku: z
    .string()
    .min(3, 'SKU code must be at least 3 characters')
    .max(50, 'SKU code cannot exceed 50 characters')
    .regex(/^[A-Za-z0-9-_]+$/, 'SKU may only contain letters, numbers, dashes, and underscores'),
  barcode: z.string().optional().default(''),
  price: z
    .number({ message: 'Retail MSRP price must be a valid number' })
    .positive('Retail price must be greater than 0 TSh'),
  discountPrice: z
    .number()
    .positive('Promotional price must be greater than 0 TSh')
    .optional(),
  wholesalePrice: z
    .number({ message: 'Wholesale price must be a valid number' })
    .positive('Wholesale unit price must be greater than 0 TSh'),
  wholesaleMinQty: z
    .number()
    .int()
    .min(1, 'Minimum wholesale carton quantity must be at least 1')
    .default(48),
  packaging: z.string().min(2, 'Packaging specification is required').default('48 Pcs / Strapped Corrugated Box'),
  quire: z.string().optional().default('2 Quire'),
  pageCount: z.string().optional().default('192 Pages'),
  rulingType: z.string().optional().default('Single Line Ruled'),
  paperQuality: z.string().optional().default('70 GSM Bleed-Proof Woodfree Paper'),
  bindingType: z.string().optional().default('Hardcover Smyth-Sewn Thread Bound'),
  dispatchTime: z.string().optional().default('Same-Day Factory Dispatch'),
  stockStatus: stockStatusEnum.default('In Stock'),
  stockQuantity: z
    .number()
    .int()
    .min(0, 'Stock quantity cannot be negative')
    .default(100),
  image: z
    .string()
    .min(1, 'Product image URL or file is required')
    .refine(
      (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/') || val.startsWith('data:image/'),
      { message: 'Image must be a valid URL, /uploads path, or DataURI' }
    ),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').default(''),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  freeDelivery: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

/**
 * Validation schema for Order Waybill tracking and status
 */
export const orderStatusSchema = z.enum([
  'Pending Confirmation',
  'Confirmed',
  'Dispatched',
  'Delivered',
  'Cancelled',
]);

export const orderTrackingSchema = z.object({
  trackingNumber: z.string().max(100, 'Tracking number cannot exceed 100 characters').optional(),
  adminNotes: z.string().max(500, 'Admin notes cannot exceed 500 characters').optional(),
});
