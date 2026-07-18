import api from "./api";

/**
 * Fetch all published blogs from backend
 * @param {Object} params - Query params (page, limit, search, status, category)
 */
export const fetchBlogs = async (params = {}) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

/**
 * Fetch a single blog by slug or ID
 * @param {string} slugOrId
 */
export const fetchBlogBySlugOrId = async (slugOrId) => {
  const { data } = await api.get(`/blogs/${slugOrId}`);
  return data;
};
