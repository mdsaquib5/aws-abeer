import api from "./api";

/**
 * Fetch all categories from backend
 * @param {string} type - optional filter: 'product' or 'blog'
 */
export const getCategories = async (type) => {
  const params = type ? { type } : {};
  const response = await api.get("/categories", { params });
  return response.data;
};
