import api from "./api";

/**
 * Submit a new order
 * @param {object} orderData - Shipping details and order configuration
 */
export const placeOrderApi = async (orderData) => {
    const { data } = await api.post("/orders", orderData);
    return data;
};

/**
 * Fetch current customer's order history
 */
export const fetchMyOrdersApi = async () => {
    const { data } = await api.get("/orders/my-orders");
    return data;
};
