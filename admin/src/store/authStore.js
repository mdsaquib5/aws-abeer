import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ─── STATE ──────────────────────────────────────────────────────────────
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ─── SIGNUP (Request Access) ────────────────────────────────────────────
      signup: async ({ name, email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/admin/signup", { name, email, password });

          localStorage.setItem("abeer-admin-token", data.data.token);

          set({
            token: data.data.token,
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, message: data.message };
        } catch (err) {
          const message = err.response?.data?.message || "Signup failed";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── LOGIN ──────────────────────────────────────────────────────────────
      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/admin/login", { email, password });

          localStorage.setItem("abeer-admin-token", data.data.token);

          set({
            token: data.data.token,
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, message: data.message };
        } catch (err) {
          const message = err.response?.data?.message || "Login failed";
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── LOGOUT ─────────────────────────────────────────────────────────────
      logout: async () => {
        try {
          await api.post("/admin/logout");
        } catch (_) {
          // Even if API fails, clear local state
        } finally {
          localStorage.removeItem("abeer-admin-token");
          set({ token: null, user: null, isAuthenticated: false, error: null });
        }
      },

      // ─── GET CURRENT ADMIN ──────────────────────────────────────────────────
      fetchMe: async () => {
        const token = get().token || (typeof window !== "undefined" && localStorage.getItem("abeer-admin-token"));
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await api.get("/admin/me");
          set({ user: data.data, isAuthenticated: true, isLoading: false });
        } catch (_) {
          // Token expired — clear everything
          if (typeof window !== "undefined") {
            localStorage.removeItem("abeer-admin-token");
          }
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // ─── CLEAR ERROR ────────────────────────────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: "abeer-admin-auth",                      // persisted in localStorage
      partialize: (state) => ({                     // only persist these fields
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
