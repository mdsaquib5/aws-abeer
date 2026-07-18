import api from "./api";

/**
 * Fetch all published products with optional parameters
 * @param {Object} params - page, limit, search, category, featured, status, sort
 */
export const fetchProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

/**
 * Fetch a single product by its slug or ID
 * @param {string} slugOrId
 */
export const fetchProductBySlugOrId = async (slugOrId) => {
  const { data } = await api.get(`/products/${slugOrId}`);
  return data;
};
