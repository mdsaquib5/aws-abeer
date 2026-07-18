import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import Admin from "../models/adminSchema.js";

export const protect = (...allowedRoles) => async (req, res, next) => {
    try {
        let token;

        // 1. Check Authorization header first (most explicit client credential)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        // 2. Check cookies if header is not present
        else if (req.cookies) {
            // Select appropriate cookie based on required roles to avoid localhost cookie sharing conflicts
            if (allowedRoles.length === 1 && allowedRoles.includes("customer")) {
                token = req.cookies.token;
            } else if (allowedRoles.length === 1 && allowedRoles.includes("admin")) {
                token = req.cookies["admin-token"];
            } else {
                token = req.cookies["admin-token"] || req.cookies.token;
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Query Admin collection for admin tokens, User collection for customer tokens
        const Model = decoded.source === "admin" ? Admin : User;
        const user = await Model.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account not found",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated",
            });
        }

        // Check roles if specified
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You don't have permission to access this resource",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};