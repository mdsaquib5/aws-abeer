import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "../configs/s3.js";
import crypto from "crypto";
import path from "path";

export const uploadToS3 = async (
    fileBuffer,
    folder,
    mimetype = "application/octet-stream"
) => {
    if (!process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_DOMAIN) {
        throw new Error("Server Configuration Error: R2_BUCKET_NAME or R2_PUBLIC_DOMAIN is missing.");
    }

    // Generate a unique filename: folder/timestamp-randomstring
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const key = `${folder}/${Date.now()}-${uniqueId}`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: mimetype,
            // S3 bucket is public, but we don't need to specify ACL if Object Ownership is Bucket owner enforced (ACLs disabled)
        },
    });

    const result = await upload.done();

    // R2 URLs are typically of the format: https://[public-domain]/[key]
    const url = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;

    return {
        url,
        publicId: key, // We store the Key as publicId to easily delete it later
    };
};

export const deleteFromS3 = async (publicId, resourceType = "image") => {
    // S3 doesn't care about resourceType for deletion, but we keep the signature compatible
    if (!publicId) return;

    const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: publicId,
    });

    try {
        await s3Client.send(command);
    } catch (error) {
        console.error("Error deleting from S3:", error);
        // We don't throw error to prevent breaking the flow if file doesn't exist
    }
};
