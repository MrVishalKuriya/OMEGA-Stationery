import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymquvammlskqytagawbb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9R23o1jR1TpPdL-NVMaWdA_J8FNJ-ws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseProductRecord {
  id: string;
  code: string;
  slug: string;
  category_id: string;
  name_en: string;
  name_sw?: string;
  description_en?: string;
  description_sw?: string;
  size?: string;
  quires_pages?: string;
  paper_type?: string;
  binding?: string;
  quality_note?: string;
  wholesale_price_tzs: number;
  retail_price_tzs?: number;
  stock_status: 'in_stock' | 'low' | 'out';
  stock_quantity: number;
  min_order_qty: number;
  is_featured: boolean;
  is_new: boolean;
  is_published: boolean;
  images: string[];
  created_at?: string;
}

export interface SupabaseCategoryRecord {
  id: string;
  slug: string;
  name_en: string;
  name_sw: string;
  image?: string;
  display_order: number;
}

export interface SupabaseEnquiryRecord {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_location: string;
  delivery_needed: boolean;
  notes?: string;
  items: any;
  total_tzs: number;
  status?: string;
  created_at?: string;
}

/**
 * Fetch all published products from Supabase
 */
export async function fetchSupabaseProducts(): Promise<SupabaseProductRecord[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false });

    if (error) {
      console.warn('Supabase products fetch note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase offline or unreachable:', err);
    return null;
  }
}

/**
 * Fetch all categories ordered by display_order
 */
export async function fetchSupabaseCategories(): Promise<SupabaseCategoryRecord[] | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase categories fetch note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase offline or unreachable:', err);
    return null;
  }
}

/**
 * Log customer order enquiry to Supabase before launching WhatsApp
 */
export async function logEnquiryToSupabase(enquiry: SupabaseEnquiryRecord) {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([enquiry])
      .select()
      .single();

    if (error) {
      console.warn('Supabase enquiry log note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase enquiry insertion error:', err);
    return null;
  }
}

/**
 * Legacy wrapper for order syncing
 */
export async function syncOrderToSupabase(orderData: any) {
  return logEnquiryToSupabase({
    customer_name: orderData.customerName || orderData.name || 'Anonymous',
    customer_phone: orderData.customerPhone || orderData.phone || '+255700000000',
    customer_location: orderData.customerLocation || orderData.location || 'Tanzania',
    delivery_needed: orderData.deliveryNeeded !== false,
    notes: orderData.notes || '',
    items: orderData.items || [],
    total_tzs: orderData.total || orderData.totalAmount || 0,
    status: 'pending',
  });
}

/**
 * Check if the given authenticated user ID has an admin role in Supabase
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) return false;
    return ['admin', 'superadmin', 'editor'].includes(data.role);
  } catch {
    return false;
  }
}
