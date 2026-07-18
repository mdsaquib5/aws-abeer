import express from "express";
import { signup, login, logout, getMe, getTotalUsers } from "../controllers/user.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", protect(), logout);
router.get("/me", protect(), getMe);

// Admin Routes
router.get("/admin/count", protect("admin", "manager"), getTotalUsers);

export default router;