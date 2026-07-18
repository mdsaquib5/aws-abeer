import express from "express";
import {
    addProduct,
    getProducts,
    getProductBySlug,
    getProductById,
    updateProduct,
    deleteProduct,
    updateStock,
    updateStatus,
} from "../controllers/product.js";
import { protect } from "../middlewares/auth.js";
import { uploadProductMedia } from "../middlewares/multer.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Protected routes (Staff/Admins only)
router.get("/id/:id", protect("admin", "manager"), getProductById);
router.post("/", protect("admin", "manager"), uploadProductMedia, addProduct);
router.put("/:id", protect("admin", "manager"), uploadProductMedia, updateProduct);
router.delete("/:id", protect("admin", "manager"), deleteProduct);
router.patch("/:id/stock", protect("admin", "manager"), updateStock);
router.patch("/:id/status", protect("admin", "manager"), updateStatus);

export default router;
