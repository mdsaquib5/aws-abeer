import bcrypt from "bcrypt";
import Admin from "../models/adminSchema.js";
import { generateToken } from "../utils/token.js";

// admin signup

export const adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const existingAdmin = await Admin.findOne({
            email: email.toLowerCase().trim(),
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await Admin.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: "admin",
        });

        // Generate token immediately after signup
        const token = generateToken(admin._id, admin.role, "admin");

        res.cookie("admin-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        });

        return res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            data: {
                token,
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
            },
        });
    } catch (error) {
        console.error("Admin Signup Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const admin = await Admin.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Contact support.",
            });
        }

        // source: "admin" tells the middleware to query Admin collection
        const token = generateToken(admin._id, admin.role, "admin");

        // Set HTTP-only cookie
        res.cookie("admin-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
            },
        });
    } catch (error) {
        console.error("Admin Login Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// get admin me
export const getAdminMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user,
    });
};

// admin logout
export const adminLogout = async (req, res) => {
    res.clearCookie("admin-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};