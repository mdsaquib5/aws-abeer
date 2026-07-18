import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCart, addToCartApi, decreaseCartItemApi, removeCartItemApi } from "@/lib/cartApi";
import useAuthStore from "./authStore";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of { product: Object, quantity: Number, size: String }
      isLoading: false,
      error: null,
      fetchCounter: 0,

      // Load cart - Fetch from DB if authenticated, otherwise use local persisted state
      loadCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return; // For guest, local state is already loaded by persist middleware

        const currentFetchId = get().fetchCounter + 1;
        set({ isLoading: true, error: null, fetchCounter: currentFetchId });

        try {
          const response = await fetchCart();
          if (get().fetchCounter === currentFetchId) {
            if (response.success) {
              set({ items: response.data.items || [], isLoading: false });
            } else {
              set({ error: response.message, isLoading: false });
            }
          }
        } catch (err) {
          console.error("Zustand loadCart error:", err);
          if (get().fetchCounter === currentFetchId) {
            set({ isLoading: false });
          }
        }
      },

      // Add item to cart
      addToCart: async (product, size) => {
        const { isAuthenticated } = useAuthStore.getState();
        const productId = product._id || product.id;

        if (isAuthenticated) {
          try {
            const response = await addToCartApi(productId, size);
            if (response.success) {
              set({ items: response.data.items || [] });
            }
          } catch (err) {
            console.error("addToCart error:", err);
          }
        } else {
          // Guest Cart: Update localStorage state
          const currentItems = [...get().items];
          const existingIndex = currentItems.findIndex(
            (item) => (item.product._id || item.product.id) === productId && item.size === size
          );

          if (existingIndex > -1) {
            currentItems[existingIndex].quantity += 1;
          } else {
            // Store the full product object locally so guest cart can show details without API lookup
            currentItems.push({ product, quantity: 1, size });
          }
          set({ items: currentItems });
        }
      },

      // Decrease item quantity in cart
      decreaseCartItem: async (productId, size) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          try {
            const response = await decreaseCartItemApi(productId, size);
            if (response.success) {
              set({ items: response.data.items || [] });
            }
          } catch (err) {
            console.error("decreaseCartItem error:", err);
          }
        } else {
          // Guest Cart
          let currentItems = [...get().items];
          const existingIndex = currentItems.findIndex(
            (item) => (item.product._id || item.product.id) === productId && item.size === size
          );

          if (existingIndex > -1) {
            currentItems[existingIndex].quantity -= 1;
            if (currentItems[existingIndex].quantity <= 0) {
              currentItems.splice(existingIndex, 1);
            }
            set({ items: currentItems });
          }
        }
      },

      // Remove item completely from cart
      removeCartItem: async (productId, size) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          try {
            const response = await removeCartItemApi(productId, size);
            if (response.success) {
              set({ items: response.data.items || [] });
            }
          } catch (err) {
            console.error("removeCartItem error:", err);
          }
        } else {
          // Guest Cart
          const currentItems = get().items.filter(
            (item) => !((item.product._id || item.product.id) === productId && item.size === size)
          );
          set({ items: currentItems });
        }
      },

      // Sync guest cart directly (usually triggered post login)
      syncCartWithItems: async (guestItems = []) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        const currentFetchId = get().fetchCounter + 1;
        set({ isLoading: true, fetchCounter: currentFetchId });

        if (!guestItems || guestItems.length === 0) {
          // If no guest items, just fetch user's existing DB cart
          try {
            const response = await fetchCart();
            if (get().fetchCounter === currentFetchId) {
              if (response.success) {
                set({ items: response.data.items || [], isLoading: false });
              } else {
                set({ isLoading: false });
              }
            }
          } catch (err) {
            console.error(err);
            if (get().fetchCounter === currentFetchId) {
              set({ isLoading: false });
            }
          }
          return;
        }

        try {
          for (const item of guestItems) {
            const productId = item.product._id || item.product.id;
            for (let q = 0; q < item.quantity; q++) {
              await addToCartApi(productId, item.size);
            }
          }
          set({ items: [] }); // Clear guest items
          const response = await fetchCart();
          if (get().fetchCounter === currentFetchId) {
            if (response.success) {
              set({ items: response.data.items || [], isLoading: false });
            } else {
              set({ isLoading: false });
            }
          }
        } catch (err) {
          console.error("syncCartWithItems error:", err);
          if (get().fetchCounter === currentFetchId) {
            set({ isLoading: false });
          }
        }
      },

      // Clear local state
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "abeer-cart", // localStorage key name
      partialize: (state) => ({ items: state.items }), // Persist only items list
    }
  )
);

export default useCartStore;
