import { create } from 'zustand';
import {
    getBlogs,
    deleteBlog as apiDeleteBlog,
    updateBlogStatus as apiUpdateBlogStatus,
} from '@/lib/blogApi';

const useBlogStore = create((set, get) => ({
    blogs: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    },
    isLoading: false,
    error: null,

    filters: {
        page: 1,
        limit: 10,
        search: '',
        category: '',
        status: '',
    },

    loadBlogs: async (overrideFilters = {}) => {
        set({ isLoading: true, error: null });
        const filters = { ...get().filters, ...overrideFilters };
        set({ filters });

        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== '')
            );

            if (!cleanFilters.status) {
                cleanFilters.status = 'all';
            }

            const data = await getBlogs(cleanFilters);

            set({
                blogs: data.data || [],
                pagination: data.pagination || get().pagination,
                isLoading: false,
            });
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to load blogs';
            set({ isLoading: false, error: message });
        }
    },

    removeBlog: async (id) => {
        try {
            await apiDeleteBlog(id);
            set((state) => ({
                blogs: state.blogs.filter((b) => b._id !== id),
                pagination: {
                    ...state.pagination,
                    total: state.pagination.total - 1,
                },
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete blog';
            return { success: false, message };
        }
    },

    changeStatus: async (id, status) => {
        try {
            await apiUpdateBlogStatus(id, status);
            set((state) => ({
                blogs: state.blogs.map((b) => (b._id === id ? { ...b, status } : b)),
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update status';
            return { success: false, message };
        }
    },

    setFilter: (key, value) => {
        set((state) => ({
            filters: { ...state.filters, [key]: value, page: 1 },
        }));
    },

    clearError: () => set({ error: null }),
}));

export default useBlogStore;
