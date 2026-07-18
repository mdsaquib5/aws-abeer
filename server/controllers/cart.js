import Cart from "../models/cartSchema.js";
import Product from "../models/productSchema.js";

// get cart
export const getCart = async (req, res) => {
    try {
        // Atomic upsert: create if not exists, never races
        let cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $setOnInsert: { user: req.user._id, items: [] } },
            { new: true, upsert: true }
        ).populate({ path: "items.product" });

        return res.status(200).json({
            success: true,
            data: cart,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// add to cart
export const addItem = async (req, res) => {
    try {
        const { productId, size } = req.body;

        const product =
            await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Atomic upsert: create cart if not exists, never races
        let cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $setOnInsert: { user: req.user._id, items: [] } },
            { new: true, upsert: true }
        );

        const existingItem =
            cart.items.find(
                (item) =>
                    item.product.toString() ===
                    productId &&
                    item.size === size
            );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                product: productId,
                quantity: 1,
                size,
            });
        }

        await cart.save();

        const updatedCart =
            await Cart.findById(
                cart._id
            ).populate("items.product");

        return res.status(200).json({
            success: true,
            message:
                "Item added to cart",
            data: updatedCart,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// decrease item
export const decreaseItem = async (
    req,
    res
) => {
    try {
        const { productId, size } =
            req.body;

        const cart =
            await Cart.findOne({
                user: req.user._id,
            });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemIndex =
            cart.items.findIndex(
                (item) =>
                    item.product.toString() ===
                    productId &&
                    item.size === size
            );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message:
                    "Item not found in cart",
            });
        }

        cart.items[itemIndex]
            .quantity--;

        if (
            cart.items[itemIndex]
                .quantity <= 0
        ) {
            cart.items.splice(
                itemIndex,
                1
            );
        }

        await cart.save();

        const updatedCart =
            await Cart.findById(
                cart._id
            ).populate("items.product");

        return res.status(200).json({
            success: true,
            message:
                "Item quantity updated",
            data: updatedCart,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// remove from cart
export const removeItem = async (
    req,
    res
) => {
    try {
        const { productId, size } =
            req.body;

        const cart =
            await Cart.findOne({
                user: req.user._id,
            });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items =
            cart.items.filter(
                (item) =>
                    !(
                        item.product.toString() ===
                        productId &&
                        item.size === size
                    )
            );

        await cart.save();

        const updatedCart =
            await Cart.findById(
                cart._id
            ).populate("items.product");

        return res.status(200).json({
            success: true,
            message:
                "Item removed from cart",
            data: updatedCart,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// clear cart
export const clearCart = async (
    userId
) => {
    await Cart.findOneAndUpdate(
        {
            user: userId,
        },
        {
            items: [],
        }
    );
};