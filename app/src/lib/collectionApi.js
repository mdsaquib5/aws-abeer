import api from './api';

export const getCollections = async () => {
    try {
        const response = await api.get('/collections');
        return response.data;
    } catch (error) {
        throw error;
    }
};
