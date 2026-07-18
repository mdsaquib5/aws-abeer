import mongoose from "mongoose";
import crypto from "crypto";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        size: {
            type: String,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        price: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            index: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        items: [orderItemSchema],

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },
        },

        subtotal: {
            type: Number,
            required: true,
        },

        shippingCharge: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending"],
            default: "Pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "Placed",
                "Confirmed",
                "Packing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
            default: "Placed",
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.pre("save", function () {
    if (!this.orderNumber) {
        const date = new Date();
        const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
        const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 char hex = 16^6 = ~16M combinations
        this.orderNumber = `ABL-${dateStr}-${randomPart}`;
    }
});

const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

export default Order;