import { create } from "zustand";
import { fetchBlogs, fetchBlogBySlugOrId } from "@/lib/blogApi";

const useBlogStore = create((set) => ({
  blogs: [],
  singleBlog: null,
  isLoading: false,
  isSingleLoading: false,
  error: null,

  // Load published blogs (defaults to published on backend if not admin)
  loadBlogs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchBlogs(params);
      if (response.success) {
        set({ blogs: response.data || [], isLoading: false });
      } else {
        set({ blogs: [], error: response.message || "Failed to load blogs", isLoading: false });
      }
    } catch (err) {
      console.error("Zustand loadBlogs error:", err);
      set({
        blogs: [],
        error: err.response?.data?.message || err.message || "Failed to load blogs",
        isLoading: false,
      });
    }
  },

  // Load a single blog by slug or ID
  loadSingleBlog: async (slugOrId) => {
    set({ isSingleLoading: true, singleBlog: null, error: null });
    try {
      const response = await fetchBlogBySlugOrId(slugOrId);
      if (response.success) {
        set({ singleBlog: response.data || null, isSingleLoading: false });
      } else {
        set({ singleBlog: null, error: response.message || "Blog not found", isSingleLoading: false });
      }
    } catch (err) {
      console.error("Zustand loadSingleBlog error:", err);
      set({
        singleBlog: null,
        error: err.response?.data?.message || err.message || "Blog not found",
        isSingleLoading: false,
      });
    }
  },

  // Clear single blog
  clearSingleBlog: () => set({ singleBlog: null }),
}));

export default useBlogStore;
