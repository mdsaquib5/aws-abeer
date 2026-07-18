import { create } from "zustand";
import { placeOrderApi, fetchMyOrdersApi } from "@/lib/orderApi";
import useCartStore from "./cartStore";

const useOrderStore = create((set, get) => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    success: false,
    error: null,

    // Place a new order
    placeOrder: async (orderData) => {
        set({ isLoading: true, error: null, success: false });
        try {
            const response = await placeOrderApi(orderData);
            if (response.success) {
                // Clear the Zustand shopping cart store state
                useCartStore.getState().clearCart();
                set({
                    currentOrder: response.data,
                    success: true,
                    isLoading: false,
                });
                return { success: true, data: response.data };
            } else {
                set({
                    error: response.message || "Failed to place order",
                    isLoading: false,
                });
                return { success: false, message: response.message };
            }
        } catch (err) {
            console.error("Zustand placeOrder error:", err);
            const errMsg = err.response?.data?.message || err.message || "Failed to place order";
            set({
                error: errMsg,
                isLoading: false,
            });
            return { success: false, message: errMsg };
        }
    },

    // Load customer order history
    loadMyOrders: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchMyOrdersApi();
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
            console.error("Zustand loadMyOrders error:", err);
            set({
                orders: [],
                error: err.response?.data?.message || err.message || "Failed to load orders",
                isLoading: false,
            });
        }
    },

    // Reset store feedback states
    clearOrderState: () => set({ success: false, error: null, currentOrder: null }),
}));

export default useOrderStore;
