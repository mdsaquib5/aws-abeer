import api from "./api";

export const getCategories = async (type, collectionId) => {
    const params = {};
    if (type) params.type = type;
    if (collectionId) params.collectionId = collectionId;
    
    const response = await api.get('/categories', { params });
    return response.data;
};

// add category
export const createCategory = async (data) => {
    const isFormData = data instanceof FormData;
    const response = await api.post('/categories', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
};

// edit category
export const updateCategory = async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/categories/${id}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};
