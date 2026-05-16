import type { Session } from '@supabase/supabase-js';

export interface PandoosUser {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly avatarUrl: string | null;
  readonly createdAt: string;
}

/** Supabase profiles row shape */
export interface SupabaseProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

/** Auth state shape used in useAuthStore */
export interface AuthState {
  user: PandoosUser | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}
