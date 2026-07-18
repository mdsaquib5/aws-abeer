import { create } from "zustand";
import { getCategories } from "@/lib/categoryApi";

const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: async (type) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCategories(type);
      set({ categories: data.data || [], isLoading: false });
    } catch (err) {
      console.error("Zustand loadCategories error:", err);
      const message = err.response?.data?.message || err.message || "Failed to load categories";
      set({ isLoading: false, error: message });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCategoryStore;
