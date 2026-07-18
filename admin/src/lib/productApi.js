import api from './api';

// ─── PRODUCT API ─────────────────────────────────────────────────────────────

/**
 * Fetch all products with optional filters
 * @param {Object} params - Query params: page, limit, search, category, status, sort
 */
export const fetchProducts = async (params = {}) => {
    const { data } = await api.get('/products', { params: { status: 'all', ...params } });
    return data;
};

/**
 * Fetch a single product by its slug
 * @param {string} slug
 */
export const fetchProductBySlug = async (slug) => {
    const { data } = await api.get(`/products/${slug}`);
    return data;
};

/**
 * Fetch a single product by its MongoDB id
 * @param {string} id
 */
export const fetchProductById = async (id) => {
    const { data } = await api.get(`/products/id/${id}`);
    return data;
};

/**
 * Create a new product (multipart/form-data)
 * @param {FormData} formData
 */
export const createProduct = async (formData) => {
    const { data } = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

/**
 * Update an existing product
 * @param {string} id - MongoDB product _id
 * @param {FormData} formData
 */
export const updateProduct = async (id, formData) => {
    const { data } = await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

/**
 * Delete a product
 * @param {string} id - MongoDB product _id
 */
export const deleteProduct = async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};

/**
 * Update product stock
 * @param {string} id - MongoDB product _id
 * @param {number} stock
 */
export const updateProductStock = async (id, stock) => {
    const { data } = await api.patch(`/products/${id}/stock`, { stock });
    return data;
};

/**
 * Update product status (draft | published | archived)
 * @param {string} id - MongoDB product _id
 * @param {string} status
 */
export const updateProductStatus = async (id, status) => {
    const { data } = await api.patch(`/products/${id}/status`, { status });
    return data;
};
