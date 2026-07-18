import express from "express";

import {
    getCart,
    addItem,
    decreaseItem,
    removeItem,
} from "../controllers/cart.js";

import { protect } from "../middlewares/auth.js";

const cartRouter = express.Router();


// get cart
cartRouter.get(
    "/",
    protect("customer"),
    getCart
);


// add item
cartRouter.post(
    "/add",
    protect("customer"),
    addItem
);


// decrease item
cartRouter.post(
    "/decrease",
    protect("customer"),
    decreaseItem
);


// remove cart
cartRouter.post(
    "/remove",
    protect("customer"),
    removeItem
);

export default cartRouter;