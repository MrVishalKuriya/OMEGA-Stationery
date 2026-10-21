import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreConfig, Language } from '@/types/store';
import { INITIAL_STORE_CONFIG } from '@/data/products';
import { saveStoreConfigToDb, fetchStoreConfigFromDb } from '@/services/api';

interface ConfigState {
  storeConfig: StoreConfig;
  language: Language;
  toastMessage: string | null;

  // Actions
  setLanguage: (lang: Language) => void;
  updateStoreConfig: (newConfig: Partial<StoreConfig>) => Promise<boolean>;
  resetStoreConfigToDefault: () => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  syncConfigFromDb: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      storeConfig: INITIAL_STORE_CONFIG,
      language: 'en',
      toastMessage: null,

      setLanguage: (lang) => set({ language: lang }),

      updateStoreConfig: async (newConfig) => {
        const merged = { ...get().storeConfig, ...newConfig };
        set({ storeConfig: merged });

        try {
          const res = await saveStoreConfigToDb(merged);
          return res.success;
        } catch {
          return true;
        }
      },

      resetStoreConfigToDefault: () => {
        set({ storeConfig: INITIAL_STORE_CONFIG });
      },

      showToast: (msg) => {
        set({ toastMessage: msg });
        setTimeout(() => {
          if (get().toastMessage === msg) {
            set({ toastMessage: null });
          }
        }, 3000);
      },

      clearToast: () => set({ toastMessage: null }),

      syncConfigFromDb: async () => {
        try {
          const res = await fetchStoreConfigFromDb();
          if (res && res.success && res.data) {
            set({ storeConfig: { ...INITIAL_STORE_CONFIG, ...res.data } });
          }
        } catch {
          // Keep current config
        }
      },
    }),
    {
      name: 'omega_config_zustand_v1',
      partialize: (state) => ({ storeConfig: state.storeConfig, language: state.language }),
    }
  )
);
