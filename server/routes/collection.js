import express from "express";
import { protect } from "../middlewares/auth.js";
import {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
} from "../controllers/collection.js";

const router = express.Router();

// public
router.get("/", getCollections);

// admin protected
router.post("/", protect("admin", "manager"), createCollection);
router.put("/:id", protect("admin", "manager"), updateCollection);
router.delete("/:id", protect("admin", "manager"), deleteCollection);

export default router;
