import Blog from "../models/blogSchema.js";

import {
    uploadToS3,
    deleteFromS3,
} from "../utils/s3Helper.js";


// create blog
export const createBlog = async (
    req,
    res
) => {
    try {
        let coverImage = null;

        const image =
            req.file || null;

        if (image) {
            coverImage =
                await uploadToS3(
                    image.buffer,
                    "abeer-label/blogs",
                    image.mimetype
                );
        }

        if (req.body.content) {
            req.body.content = req.body.content.replace(/&nbsp;/g, " ");
        }

        const blog =
            await Blog.create({
                ...req.body,

                tags:
                    typeof req.body.tags ===
                        "string"
                        ? JSON.parse(
                            req.body.tags
                        )
                        : req.body.tags,

                coverImage,

                createdBy:
                    req.user._id,

                publishedAt:
                    req.body.status ===
                        "published"
                        ? new Date()
                        : null,
            });

        return res.status(201).json({
            success: true,
            message:
                "Blog created successfully",
            data: blog,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

// get blogs
export const getBlogs = async (
    req,
    res
) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            category,
        } = req.query;

        const query = {};

        if (search) {
            query.title = {
                $regex: search,
                $options: "i",
            };
        }

        if (status && status !== "all") {
            query.status = status;
        } else if (!status) {
            query.status = "published";
        }

        if (category) {
            query.category =
                category;
        }

        const blogs =
            await Blog.find(query)
                .sort({
                    createdAt: -1,
                })
                .skip(
                    (page - 1) * limit
                )
                .limit(Number(limit));

        const total =
            await Blog.countDocuments(
                query
            );

        return res.status(200).json({
            success: true,
            data: blogs,
            pagination: {
                page:
                    Number(page),
                total,
                pages: Math.ceil(
                    total / limit
                ),
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};


// get blog by slug
export const getBlogBySlug =
    async (req, res) => {
        try {
            const blog =
                await Blog.findOne({
                    slug:
                        req.params.slug,
                });

            if (!blog) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Blog not found",
                    });
            }

            blog.views += 1;

            await blog.save();

            return res.status(200).json({
                success: true,
                data: blog,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }

    };

// update blog
export const updateBlog =
    async (req, res) => {
        try {
            const blog =
                await Blog.findById(
                    req.params.id
                );

            if (!blog) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Blog not found",
                    });
            }

            if (
                req.file &&
                blog.coverImage
                    ?.publicId
            ) {
                await deleteFromS3(
                    blog.coverImage
                        .publicId
                );

                blog.coverImage =
                    await uploadToS3(
                        req.file.buffer,
                        "abeer-label/blogs",
                        req.file.mimetype
                    );
            }

            if (req.body.content) {
                req.body.content = req.body.content.replace(/&nbsp;/g, " ");
            }

            Object.assign(
                blog,
                req.body
            );

            if (
                req.body.status ===
                "published" &&
                !blog.publishedAt
            ) {
                blog.publishedAt =
                    new Date();
            }

            await blog.save();

            return res.status(200).json({
                success: true,
                message:
                    "Blog updated successfully",
                data: blog,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }

    };

// delete blog
export const deleteBlog =
    async (req, res) => {
        try {
            const blog =
                await Blog.findById(
                    req.params.id
                );

            if (!blog) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Blog not found",
                    });
            }

            if (
                blog.coverImage
                    ?.publicId
            ) {
                await deleteFromS3(
                    blog.coverImage
                        .publicId
                );
            }

            await blog.deleteOne();

            return res.status(200).json({
                success: true,
                message:
                    "Blog deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }

    };


// update status
export const updateBlogStatus =
    async (req, res) => {
        try {
            const blog =
                await Blog.findByIdAndUpdate(
                    req.params.id,
                    {
                        status:
                            req.body.status,
                    },
                    {
                        new: true,
                    }
                );

            return res.status(200).json({
                success: true,
                data: blog,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }

    };