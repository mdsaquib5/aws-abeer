import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

// signup 
export const signup = async (req, res) => {
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

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        const token = generateToken(user._id, user.role);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

        // Use same message for both not-found and wrong-password (security best practice)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Contact support.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id, user.role);

        res.cookie("token", token, {
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
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// get logged-in user data
export const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user,
    });
};

// logout (client just discards token; this just confirms it)
export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

// get total users (for admin)
export const getTotalUsers = async (req, res) => {
    try {
        const total = await User.countDocuments({ role: "customer" });
        return res.status(200).json({
            success: true,
            data: total,
        });
    } catch (error) {
        console.error("Get Total Users Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};