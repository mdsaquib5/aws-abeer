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

      // ─── SIGNUP ─────────────────────────────────────────────────────────────
      signup: async ({ name, email, password }) => {
        set({ isLoading: true, error: null });
        try {
          // Capture guest items before database authentication
          let guestItems = [];
          try {
            const { default: useCartStore } = await import("./cartStore");
            guestItems = useCartStore.getState().items || [];
          } catch (err) {
            console.error("Failed to read guest items before signup:", err);
          }

          const { data } = await api.post("/user/signup", { name, email, password });

          localStorage.setItem("abeer-user-token", data.data.token);

          set({
            token: data.data.token,
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          try {
            const { default: useCartStore } = await import("./cartStore");
            await useCartStore.getState().syncCartWithItems(guestItems);
          } catch (err) {
            console.error("Failed to sync cart on signup:", err);
          }

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
          // Capture guest items before database authentication
          let guestItems = [];
          try {
            const { default: useCartStore } = await import("./cartStore");
            guestItems = useCartStore.getState().items || [];
          } catch (err) {
            console.error("Failed to read guest items before login:", err);
          }

          const { data } = await api.post("/user/login", { email, password });

          localStorage.setItem("abeer-user-token", data.data.token);

          set({
            token: data.data.token,
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          try {
            const { default: useCartStore } = await import("./cartStore");
            await useCartStore.getState().syncCartWithItems(guestItems);
          } catch (err) {
            console.error("Failed to sync cart on login:", err);
          }

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
          await api.post("/user/logout");
        } catch (_) {
          // Even if API fails, clear local state
        } finally {
          localStorage.removeItem("abeer-user-token");
          set({ token: null, user: null, isAuthenticated: false, error: null });
          try {
            const { default: useCartStore } = await import("./cartStore");
            useCartStore.getState().clearCart();
          } catch (err) {
            console.error("Failed to clear cart on logout:", err);
          }
        }
      },

      // ─── GET CURRENT USER ───────────────────────────────────────────────────
      fetchMe: async () => {
        const token = get().token || (typeof window !== "undefined" && localStorage.getItem("abeer-user-token"));
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await api.get("/user/me");
          set({ user: data.data, isAuthenticated: true, isLoading: false });
        } catch (_) {
          // Token expired — clear everything
          if (typeof window !== "undefined") {
            localStorage.removeItem("abeer-user-token");
          }
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // ─── CLEAR ERROR ────────────────────────────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: "abeer-auth",                           // persisted in localStorage
      partialize: (state) => ({                     // only persist these fields
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
