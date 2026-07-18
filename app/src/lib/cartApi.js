import api from "./api";

/**
 * Fetch the active user's cart from database
 */
export const fetchCart = async () => {
    const { data } = await api.get("/cart");
    return data;
};

/**
 * Add an item or increment its quantity in the cart
 * @param {string} productId - MongoDB product _id
 * @param {string} size - Selected size
 */
export const addToCartApi = async (productId, size) => {
    const { data } = await api.post("/cart/add", { productId, size });
    return data;
};

/**
 * Decrement an item's quantity in the cart
 * @param {string} productId - MongoDB product _id
 * @param {string} size - Selected size
 */
export const decreaseCartItemApi = async (productId, size) => {
    const { data } = await api.post("/cart/decrease", { productId, size });
    return data;
};

/**
 * Completely remove an item from the cart
 * @param {string} productId - MongoDB product _id
 * @param {string} size - Selected size
 */
export const removeCartItemApi = async (productId, size) => {
    const { data } = await api.post("/cart/remove", { productId, size });
    return data;
};
