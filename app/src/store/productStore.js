import { create } from "zustand";
import { fetchProducts, fetchProductBySlugOrId } from "@/lib/productApi";

const useProductStore = create((set) => ({
  products: [],
  singleProduct: null,
  isLoading: false,
  isSingleLoading: false,
  error: null,

  // Load all products (default: status=published is enforced by backend if not admin)
  loadProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchProducts(params);
      if (response.success) {
        set({ products: response.data || [], isLoading: false });
      } else {
        set({ products: [], error: response.message || "Failed to load products", isLoading: false });
      }
    } catch (err) {
      console.error("Zustand loadProducts error:", err);
      set({
        products: [],
        error: err.response?.data?.message || err.message || "Failed to load products",
        isLoading: false,
      });
    }
  },

  // Load a single product by slug or id
  loadSingleProduct: async (slugOrId) => {
    set({ isSingleLoading: true, singleProduct: null, error: null });
    try {
      const response = await fetchProductBySlugOrId(slugOrId);
      if (response.success) {
        set({ singleProduct: response.data || null, isSingleLoading: false });
      } else {
        set({ singleProduct: null, error: response.message || "Product not found", isSingleLoading: false });
      }
    } catch (err) {
      console.error("Zustand loadSingleProduct error:", err);
      set({
        singleProduct: null,
        error: err.response?.data?.message || err.message || "Product not found",
        isSingleLoading: false,
      });
    }
  },

  // Clear single product
  clearSingleProduct: () => set({ singleProduct: null }),
}));

export default useProductStore;
