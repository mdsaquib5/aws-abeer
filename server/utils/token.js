import jwt from "jsonwebtoken";

export const generateToken = (userId, role, source = "user") => {
    return jwt.sign(
        {
            userId,
            role,
            source,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1y",
        }
    );
};