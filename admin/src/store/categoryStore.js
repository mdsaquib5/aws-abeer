import { create } from 'zustand';
import {
    getCategories,
    createCategory as apiCreateCategory,
    updateCategory as apiUpdateCategory,
    deleteCategory as apiDeleteCategory,
} from '@/lib/categoryApi';

const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    loadCategories: async (type) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getCategories(type);
            set({ categories: data.data || [], isLoading: false });
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to load categories';
            set({ isLoading: false, error: message });
        }
    },

    addCategory: async (categoryData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await apiCreateCategory(categoryData);
            set((state) => ({
                categories: [...state.categories, data.data],
                isLoading: false,
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create category';
            set({ isLoading: false, error: message });
            return { success: false, message };
        }
    },

    editCategory: async (id, categoryData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await apiUpdateCategory(id, categoryData);
            set((state) => ({
                categories: state.categories.map((c) => (c._id === id ? data.data : c)),
                isLoading: false,
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update category';
            set({ isLoading: false, error: message });
            return { success: false, message };
        }
    },

    removeCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiDeleteCategory(id);
            set((state) => ({
                categories: state.categories.filter((c) => c._id !== id),
                isLoading: false,
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete category';
            set({ isLoading: false, error: message });
            return { success: false, message };
        }
    },

    clearError: () => set({ error: null }),
}));

export default useCategoryStore;
