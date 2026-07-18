import express from "express";

import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    updateBlogStatus,
} from "../controllers/blog.js";

import { protect } from "../middlewares/auth.js";

import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
});

const router =
    express.Router();

// public

router.get(
    "/",
    getBlogs
);

router.get(
    "/:slug",
    getBlogBySlug
);


// admin

router.post(
    "/",
    protect("admin", "manager"),
    upload.single("coverImage"),
    createBlog
);

router.put(
    "/:id",
    protect("admin", "manager"),
    upload.single("coverImage"),
    updateBlog
);

router.delete(
    "/:id",
    protect("admin", "manager"),
    deleteBlog
);

router.patch(
    "/:id/status",
    protect("admin", "manager"),
    updateBlogStatus
);

export default router;