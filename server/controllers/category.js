import Category from "../models/categorySchema.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Helper.js";

// create category
export const createCategory = async (req, res) => {
    try {
        const { name, type, collectionId } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: "Name and type are required",
            });
        }

        let image = undefined;
        if (req.file) {
            image = await uploadToS3(
                req.file.buffer,
                "abeer-label/categories",
                req.file.mimetype
            );
        }

        const category = await Category.create({
            name,
            type,
            image,
            collectionId,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

import mongoose from "mongoose";

// get categories
export const getCategories = async (req, res) => {
    try {
        const { type, collectionId } = req.query;
        const matchStage = {};

        if (type) {
            matchStage.type = type;
        }
        
        if (collectionId) {
            matchStage.collectionId = new mongoose.Types.ObjectId(collectionId);
        }

        const categories = await Category.aggregate([
            { $match: matchStage },
            { $sort: { name: 1 } },
            {
                $lookup: {
                    from: "products",
                    localField: "name",
                    foreignField: "category",
                    as: "categoryProducts"
                }
            },
            {
                $addFields: {
                    productsCount: { $size: "$categoryProducts" },
                    // If category image is missing, try to get the first product's first image
                    resolvedImage: {
                        $cond: {
                            if: { $and: [{ $not: "$image.url" }, { $gt: [{ $size: "$categoryProducts" }, 0] }] },
                            then: { $arrayElemAt: [{ $arrayElemAt: ["$categoryProducts.images.url", 0] }, 0] },
                            else: "$image.url"
                        }
                    }
                }
            },
            {
                $project: {
                    categoryProducts: 0 // drop large product array
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// update category
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (req.file) {
            if (category.image?.publicId) {
                await deleteFromS3(category.image.publicId);
            }
            const uploadedImage = await uploadToS3(
                req.file.buffer,
                "abeer-label/categories",
                req.file.mimetype
            );
            category.image = uploadedImage;
        }

        Object.assign(category, req.body);
        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// delete category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (category.image?.publicId) {
            await deleteFromS3(category.image.publicId);
        }

        await category.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
