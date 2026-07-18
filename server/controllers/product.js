import Product from "../models/productSchema.js";
import {
    uploadToS3,
    deleteFromS3,
} from "../utils/s3Helper.js";
import Collection from "../models/collectionSchema.js";


// add new product
export const addProduct = async (req, res) => {
    try {
        const imageFiles = req.files?.images || [];
        const videoFile = req.files?.video?.[0];

        if (!imageFiles.length) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required",
            });
        }

        const uploadedImages = [];

        for (const file of imageFiles) {
            const uploaded = await uploadToS3(
                file.buffer,
                "abeer-label/products/images",
                file.mimetype
            );

            uploadedImages.push(uploaded);
        }

        let uploadedVideo = null;

        if (videoFile) {
            uploadedVideo = await uploadToS3(
                videoFile.buffer,
                "abeer-label/products/videos",
                videoFile.mimetype
            );
        }

        const product = await Product.create({
            ...req.body,

            sizes:
                typeof req.body.sizes === "string"
                    ? JSON.parse(req.body.sizes)
                    : req.body.sizes,

            seoKeywords:
                typeof req.body.seoKeywords === "string"
                    ? JSON.parse(req.body.seoKeywords)
                    : req.body.seoKeywords,

            images: uploadedImages,
            video: uploadedVideo,

            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// get all product
export const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            category,
            collectionId,
            collectionSlug,
            featured,
            status,
            sort,
        } = req.query;

        const query = {};

        if (collectionSlug) {
            const col = await Collection.findOne({ slug: collectionSlug });
            if (col) {
                query.collectionId = col._id;
            }
        } else if (collectionId) {
            query.collectionId = collectionId;
        }

        if (search) {
            query.name = {
                $regex: search,
                $options: "i",
            };
        }

        if (category) {
            query.category = category;
        }

        if (featured === "true") {
            query.isFeatured = true;
        }

        if (status && status !== "all") {
            query.status = status;
        } else if (!status) {
            // Public-facing default: only published
            query.status = "published";
        }
        // if status === "all", no filter is applied (admin use)

        let sortOption = {
            createdAt: -1,
        };

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        }

        if (sort === "price_desc") {
            sortOption = { price: -1 };
        }

        const products = await Product.find(query)
            .populate("collectionId", "name slug")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Product.countDocuments(
            query
        );

        return res.status(200).json({
            success: true,

            data: products,

            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// gey product by id
export const getProductBySlug = async (
    req,
    res
) => {
    try {
        const query = /^[0-9a-fA-F]{24}$/.test(req.params.slug)
            ? { $or: [{ slug: req.params.slug }, { _id: req.params.slug }] }
            : { slug: req.params.slug };

        const product = await Product.findOne(query).populate("collectionId", "name slug");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// get product by id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("collectionId", "name slug");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// update product or edit
export const updateProduct = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // 1. Handle Selective Image Updates
        let keepImages = [];
        if (req.body.keepImages) {
            try {
                keepImages = typeof req.body.keepImages === "string"
                    ? JSON.parse(req.body.keepImages)
                    : req.body.keepImages;
            } catch (err) {
                console.error("Error parsing keepImages:", err);
            }
        }

        const imageFiles = req.files?.images || [];

        // If keepImages was explicitly provided, we selectively delete and keep
        if (req.body.keepImages) {
            const keepPublicIds = new Set(keepImages.map((img) => img.publicId));

            // Delete images that are not in keepImages
            for (const img of product.images) {
                if (!keepPublicIds.has(img.publicId)) {
                    await deleteFromS3(img.publicId);
                }
            }

            // Start with kept images
            const updatedImages = [...keepImages];

            // Upload any new images and append them
            if (imageFiles.length) {
                for (const file of imageFiles) {
                    const uploaded = await uploadToS3(
                        file.buffer,
                        "abeer-label/products/images",
                        file.mimetype
                    );
                    updatedImages.push(uploaded);
                }
            }

            product.images = updatedImages;
        } else if (imageFiles.length) {
            // Fallback/Legacy: if keepImages is not passed but imageFiles is, replace all
            for (const image of product.images) {
                await deleteFromS3(image.publicId);
            }

            const uploadedImages = [];
            for (const file of imageFiles) {
                const uploaded = await uploadToS3(
                    file.buffer,
                    "abeer-label/products/images",
                    file.mimetype
                );
                uploadedImages.push(uploaded);
            }

            product.images = uploadedImages;
        }

        // 2. Handle Video Updates and Removal
        const videoFile = req.files?.video?.[0];

        if (req.body.removeVideo === "true" || req.body.removeVideo === true) {
            if (product.video?.publicId) {
                await deleteFromS3(product.video.publicId);
            }
            product.video = null;
        } else if (videoFile) {
            if (product.video?.publicId) {
                await deleteFromS3(product.video.publicId);
            }

            const uploadedVideo = await uploadToS3(
                videoFile.buffer,
                "abeer-label/products/videos",
                videoFile.mimetype
            );

            product.video = uploadedVideo;
        }

        // 3. Parse Array/Object Fields
        if (req.body.sizes) {
            req.body.sizes =
                typeof req.body.sizes === "string"
                    ? JSON.parse(req.body.sizes)
                    : req.body.sizes;
        }

        if (req.body.seoKeywords) {
            req.body.seoKeywords =
                typeof req.body.seoKeywords === "string"
                    ? JSON.parse(req.body.seoKeywords)
                    : req.body.seoKeywords;
        }

        // 4. Update other fields (ignoring non-schema control fields)
        Object.keys(req.body).forEach(
            (key) => {
                if (key !== "keepImages" && key !== "removeVideo") {
                    product[key] = req.body[key];
                }
            }
        );

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });

    } catch (error) {
        console.error("Update Product Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// delete the product
export const deleteProduct = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        for (const image of product.images) {
            await deleteFromS3(
                image.publicId
            );
        }

        if (
            product.video?.publicId
        ) {
            await deleteFromS3(
                product.video.publicId
            );
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message:
                "Product deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// update stock
export const updateStock = async (
    req,
    res
) => {
    try {
        const { stock } = req.body;

        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.stock = stock;
        product.inStock = stock > 0;

        await product.save();

        return res.status(200).json({
            success: true,
            message:
                "Stock updated successfully",
            data: product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// update status
export const updateStatus = async (
    req,
    res
) => {
    try {
        const { status } = req.body;

        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Status updated successfully",
            data: product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};