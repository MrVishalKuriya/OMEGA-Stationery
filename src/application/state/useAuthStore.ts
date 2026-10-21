import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/store';
import {
  createSession,
  getActiveSession,
  destroySession,
  SessionData,
} from '@/utils/cookieSession';
import { loginUserWithBackend, registerUserWithBackend } from '@/services/api';

const extractInitials = (nameStr: string): string => {
  const parts = (nameStr || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const SEED_USERS: (UserProfile & { password?: string })[] = [
  {
    id: 'usr-mussa-juma',
    name: 'Mussa Juma',
    email: 'mussa.juma@omega.co.tz',
    phone: '+255 715 268 391',
    accountType: 'wholesale',
    initials: 'MJ',
    password: 'password123',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'usr-omega-admin',
    name: 'OMEGA Administrator',
    email: 'admin@omega.co.tz',
    phone: '+255 624 265 480',
    accountType: 'school',
    initials: 'OA',
    password: 'admin123',
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'usr-dar-academy',
    name: 'Dar Academy Procurement',
    email: 'purchasing@daracademy.sc.tz',
    phone: '+255 784 921 440',
    accountType: 'school',
    initials: 'DA',
    password: 'school123',
    createdAt: '2026-02-15T09:30:00Z',
  },
];

interface AuthState {
  currentUser: UserProfile | null;
  activeSession: SessionData | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';

  // Actions
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (credentials: {
    email: string;
    password?: string;
    rememberMe?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  register: (input: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    accountType?: any;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      activeSession: null,
      isAuthModalOpen: false,
      authModalMode: 'login',

      openAuthModal: (mode = 'login') => {
        set({ isAuthModalOpen: true, authModalMode: mode });
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false });
      },

      login: async ({ email, password, rememberMe = true }) => {
        const trimmedEmail = (email || '').trim().toLowerCase();
        if (!trimmedEmail) {
          return { success: false, error: 'Please enter your email or phone number.' };
        }

        // 1. Try Live MongoDB API
        try {
          if (password) {
            const backendRes = await loginUserWithBackend({
              email: trimmedEmail,
              password,
              rememberMe,
            });
            if (backendRes && backendRes.success && backendRes.user) {
              const profile: UserProfile = {
                id: backendRes.user.id,
                name: backendRes.user.name,
                email: backendRes.user.email,
                phone: backendRes.user.phone,
                accountType: backendRes.user.accountType || 'individual',
                initials: backendRes.user.initials || extractInitials(backendRes.user.name),
              };
              const session = createSession(profile, rememberMe);
              set({ currentUser: profile, activeSession: session, isAuthModalOpen: false });
              return { success: true };
            }
          }
        } catch {
          // Fallback to local / seed
        }

        // 2. Local Fallback
        const seed = SEED_USERS.find((u) => u.email.toLowerCase() === trimmedEmail);
        const userName = seed ? seed.name : trimmedEmail.split('@')[0];
        const profile: UserProfile = {
          id: seed ? seed.id : `usr-${Date.now()}`,
          name: userName,
          email: trimmedEmail,
          phone: seed?.phone || '+255 700 000 000',
          accountType: seed?.accountType || 'individual',
          initials: extractInitials(userName),
        };
        const session = createSession(profile, rememberMe);
        set({ currentUser: profile, activeSession: session, isAuthModalOpen: false });
        return { success: true };
      },

      register: async (input) => {
        try {
          const res = await registerUserWithBackend(input);
          if (res && res.success && res.user) {
            const profile: UserProfile = {
              id: res.user.id,
              name: res.user.name,
              email: res.user.email,
              phone: res.user.phone,
              accountType: res.user.accountType || 'individual',
              initials: extractInitials(res.user.name),
            };
            const session = createSession(profile, true);
            set({ currentUser: profile, activeSession: session, isAuthModalOpen: false });
            return { success: true };
          }
        } catch {
          // Fallback
        }

        const profile: UserProfile = {
          id: `usr-${Date.now()}`,
          name: input.name,
          email: input.email.toLowerCase(),
          phone: input.phone || '+255 700 000 000',
          accountType: input.accountType || 'individual',
          initials: extractInitials(input.name),
        };
        const session = createSession(profile, true);
        set({ currentUser: profile, activeSession: session, isAuthModalOpen: false });
        return { success: true };
      },

      logout: () => {
        destroySession();
        set({ currentUser: null, activeSession: null });
      },
    }),
    {
      name: 'omega_auth_zustand_v1',
      partialize: (state) => ({ currentUser: state.currentUser, activeSession: state.activeSession }),
    }
  )
);
