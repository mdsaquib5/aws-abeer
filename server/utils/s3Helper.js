import crypto from "crypto";
import path from "path";
import fs from "fs";

export const uploadToS3 = async (
    fileBuffer,
    folder,
    mimetype = "application/octet-stream"
) => {
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Determine file extension
    let ext = "bin";
    if (mimetype) {
        const parts = mimetype.split("/");
        if (parts.length > 1) {
            ext = parts[1].split(";")[0]; // handle any extra params in mimetype
        }
    }

    // Generate unique file name
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const filename = `${folder}-${Date.now()}-${uniqueId}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save file locally
    fs.writeFileSync(filePath, fileBuffer);

    // Return URL and filename (as publicId for deletion)
    const url = `/uploads/${filename}`;

    return {
        url,
        publicId: filename,
    };
};

export const deleteFromS3 = async (publicId, resourceType = "image") => {
    if (!publicId) return;

    try {
        const filePath = path.join(process.cwd(), "uploads", publicId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Error deleting local file:", error);
    }
};
