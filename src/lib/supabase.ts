import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymquvammlskqytagawbb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9R23o1jR1TpPdL-NVMaWdA_J8FNJ-ws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to record orders in Supabase if an orders table exists
 */
export async function syncOrderToSupabase(orderData: any) {
  try {
    const { data, error } = await supabase.from('orders').insert([orderData]);
    if (error) {
      console.warn('Supabase order insert note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase offline or table pending:', err);
    return null;
  }
}
