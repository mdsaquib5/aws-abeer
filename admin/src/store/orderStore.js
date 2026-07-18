import { create } from "zustand";
import { fetchAdminOrdersApi, updateOrderStatusApi } from "@/lib/orderApi";

const useOrderStore = create((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,
    success: false,

    // Fetch all customer orders
    loadOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchAdminOrdersApi();
            if (response.success) {
                set({
                    orders: response.data || [],
                    isLoading: false,
                });
            } else {
                set({
                    orders: [],
                    error: response.message || "Failed to load orders",
                    isLoading: false,
                });
            }
        } catch (err) {
            console.error("Zustand loadOrders error:", err);
            set({
                orders: [],
                error: err.response?.data?.message || err.message || "Failed to load orders",
                isLoading: false,
            });
        }
    },

    // Update order fulfillment/delivery status
    changeOrderStatus: async (orderId, status) => {
        set({ isLoading: true, error: null, success: false });
        try {
            const response = await updateOrderStatusApi(orderId, status);
            if (response.success) {
                const currentOrders = get().orders.map(order => 
                    order._id === orderId ? { ...order, orderStatus: status } : order
                );
                set({
                    orders: currentOrders,
                    success: true,
                    isLoading: false,
                });
                return { success: true, data: response.data };
            } else {
                set({
                    error: response.message || "Failed to update order status",
                    isLoading: false,
                });
                return { success: false, message: response.message };
            }
        } catch (err) {
            console.error("Zustand changeOrderStatus error:", err);
            const errMsg = err.response?.data?.message || err.message || "Failed to update order status";
            set({
                error: errMsg,
                isLoading: false,
            });
            return { success: false, message: errMsg };
        }
    },

    // Clear feedback states
    clearOrderState: () => set({ success: false, error: null }),
}));

export default useOrderStore;
