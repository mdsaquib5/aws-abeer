import express from "express";

import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/orders.js";

import { protect } from "../middlewares/auth.js";

const orderRouter =
    express.Router();

/* CUSTOMER */

orderRouter.post(
    "/",
    protect("customer"),
    createOrder
);

orderRouter.get(
    "/my-orders",
    protect("customer"),
    getMyOrders
);

/* ADMIN */

orderRouter.get(
    "/",
    protect("admin", "manager"),
    getAllOrders
);

orderRouter.patch(
    "/:id/status",
    protect("admin", "manager"),
    updateOrderStatus
);

export default orderRouter;