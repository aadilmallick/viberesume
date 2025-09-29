import { create } from 'zustand';
import { getUserStatus } from '@/app/actions/get-user-status';

interface UserStatus {
  isPro: boolean;
  aiUsage?: number;
  portfolioCount?: number;
  status: "pro" | "free" | "error";
  error?: string;
}

interface UserStatusState {
  userStatus: UserStatus | null;
  loading: boolean;
  error: string | null;
  fetchUserStatus: () => Promise<void>;
  refetchUserStatus: () => Promise<void>;
}

export const useUserStatusStore = create<UserStatusState>((set, get) => ({
  userStatus: null,
  loading: false,
  error: null,

  fetchUserStatus: async () => {
    const { loading } = get();
    if (loading) return; // Prevent multiple simultaneous fetches

    set({ loading: true, error: null });

    try {
      const status = await getUserStatus();
      set({
        userStatus: status,
        loading: false,
        error: status.status === "error" ? status.error || "Unknown error" : null
      });
    } catch (error) {
      console.error("Failed to fetch user status:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch user status"
      });
    }
  },

  refetchUserStatus: async () => {
    // Force refetch even if already loaded
    set({ loading: true, error: null });

    try {
      const status = await getUserStatus();
      set({
        userStatus: status,
        loading: false,
        error: status.status === "error" ? status.error || "Unknown error" : null
      });
    } catch (error) {
      console.error("Failed to refetch user status:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch user status"
      });
    }
  }
}));