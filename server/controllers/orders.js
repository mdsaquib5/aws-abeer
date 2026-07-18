import Order from "../models/orderSchema.js";
import Cart from "../models/cartSchema.js";
import Product from "../models/productSchema.js";
import mongoose from "mongoose";
import { clearCart } from "./cart.js";


// create new order from user
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const {
            fullName,
            phone,
            email,
            address,
            city,
            state,
            pincode,
        } = req.body;

        // Validate shipping details first
        if (!fullName || !phone || !email || !address || !city || !state || !pincode) {
            return res.status(400).json({
                success: false,
                message: "All shipping address fields are required",
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate("items.product");

        if (!cart || !cart.items.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const orderItems = [];
        let subtotal = 0;

        // Build order items and compute subtotal using DB prices (authoritative)
        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "A product in your cart was not found",
                });
            }

            subtotal += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images?.[0]?.url || "",
                quantity: item.quantity,
                size: item.size,
                price: product.price,
            });
        }

        const shippingCharge = subtotal >= 5000 ? 0 : 150;
        const totalAmount = subtotal + shippingCharge;

        let order;

        await session.withTransaction(async () => {
            // Atomic stock decrement — "check + deduct" in ONE operation per product
            // The { stock: { $gte: qty } } filter ensures we only deduct if stock is sufficient
            for (const item of cart.items) {
                const updated = await Product.updateOne(
                    { _id: item.product._id, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );

                if (updated.modifiedCount === 0) {
                    throw new Error(`"${item.product.name}" is out of stock or has insufficient quantity`);
                }
            }

            // Create order only after all stock deductions succeed
            const created = await Order.create([{
                user: req.user._id,
                items: orderItems,
                shippingAddress: {
                    fullName,
                    phone,
                    email,
                    address,
                    city,
                    state,
                    pincode,
                },
                subtotal,
                shippingCharge,
                totalAmount,
                paymentMethod: "COD",
            }], { session });

            order = created[0];

            // Clear cart atomically within the same transaction
            await Cart.updateOne(
                { user: req.user._id },
                { $set: { items: [] } },
                { session }
            );
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });

    } catch (error) {
        console.error("createOrder error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to place order",
        });
    } finally {
        session.endSession();
    }
};


// get all orders
export const getMyOrders =
    async (req, res) => {
        try {
            const orders =
                await Order.find({
                    user: req.user._id,
                })
                    .sort({
                        createdAt: -1,
                    });

            return res.status(200).json({
                success: true,
                data: orders,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };


// get admin orders
export const getAllOrders =
    async (req, res) => {
        try {
            const orders =
                await Order.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .sort({
                        createdAt: -1,
                    });

            return res.status(200).json({
                success: true,
                data: orders,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };


// update order status
export const updateOrderStatus =
    async (req, res) => {
        try {
            const { status } =
                req.body;

            const order =
                await Order.findByIdAndUpdate(
                    req.params.id,
                    {
                        orderStatus:
                            status,
                    },
                    {
                        new: true,
                    }
                );

            return res.status(200).json({
                success: true,
                message:
                    "Order status updated",
                data: order,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };