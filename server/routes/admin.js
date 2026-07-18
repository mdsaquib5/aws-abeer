import express from "express";

import {
    adminLogin,
    adminSignup,
    getAdminMe,
    adminLogout,
} from "../controllers/admin.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/signup", protect("admin"), adminSignup);

router.get("/me", protect("admin", "manager", "writer"), getAdminMe);
router.post("/logout", protect("admin", "manager", "writer"), adminLogout);

export default router;