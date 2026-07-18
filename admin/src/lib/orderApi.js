import api from './api';

/**
 * Fetch all customer orders (admin/manager view)
 */
export const fetchAdminOrdersApi = async () => {
    const { data } = await api.get('/orders');
    return data;
};

/**
 * Update the status of an existing order
 * @param {string} orderId - MongoDB order _id
 * @param {string} status - New orderStatus (Placed, Confirmed, Packing, Shipped, Delivered, Cancelled)
 */
export const updateOrderStatusApi = async (orderId, status) => {
    const { data } = await api.patch(`/orders/${orderId}/status`, { status });
    return data;
};
