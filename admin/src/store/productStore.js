import { create } from 'zustand';
import {
    fetchProducts,
    deleteProduct as apiDeleteProduct,
    updateProductStatus as apiUpdateStatus,
    updateProductStock as apiUpdateStock,
} from '@/lib/productApi';

const useProductStore = create((set, get) => ({
    // ─── STATE ──────────────────────────────────────────────────────────────────
    products: [],
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 1,
    },
    isLoading: false,
    error: null,

    // Active filters
    filters: {
        page: 1,
        limit: 12,
        search: '',
        collectionId: '',
        category: '',
        status: '',
        sort: '',
    },

    // ─── FETCH PRODUCTS ─────────────────────────────────────────────────────────
    loadProducts: async (overrideFilters = {}) => {
        set({ isLoading: true, error: null });

        const filters = { ...get().filters, ...overrideFilters };
        set({ filters });

        try {
            // Strip empty strings so they don't pollute the query string
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== '')
            );

            const data = await fetchProducts(cleanFilters);

            set({
                products: data.data || [],
                pagination: data.pagination || get().pagination,
                isLoading: false,
            });
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to load products';
            set({ isLoading: false, error: message });
        }
    },

    // ─── DELETE PRODUCT ─────────────────────────────────────────────────────────
    removeProduct: async (id) => {
        try {
            await apiDeleteProduct(id);
            set((state) => ({
                products: state.products.filter((p) => p._id !== id),
                pagination: {
                    ...state.pagination,
                    total: state.pagination.total - 1,
                },
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete product';
            return { success: false, message };
        }
    },

    // ─── UPDATE STATUS ───────────────────────────────────────────────────────────
    changeStatus: async (id, status) => {
        try {
            await apiUpdateStatus(id, status);
            set((state) => ({
                products: state.products.map((p) =>
                    p._id === id ? { ...p, status } : p
                ),
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update status';
            return { success: false, message };
        }
    },

    // ─── UPDATE STOCK ────────────────────────────────────────────────────────────
    changeStock: async (id, stock) => {
        try {
            await apiUpdateStock(id, stock);
            set((state) => ({
                products: state.products.map((p) =>
                    p._id === id ? { ...p, stock } : p
                ),
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update stock';
            return { success: false, message };
        }
    },

    // ─── HELPERS ─────────────────────────────────────────────────────────────────
    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value, page: 1 },
        }));
    },

    clearError: () => set({ error: null }),
}));

export default useProductStore;
