import mongoose from "mongoose";
import Blog from "../models/blogSchema.js";

const migrateBlogs = async () => {
    try {
        const blogs = await Blog.find({ content: { $regex: "&nbsp;" } });
        if (blogs.length > 0) {
            console.log(`[Migration] Found ${blogs.length} blogs containing &nbsp; characters. Migrating...`);
            for (const blog of blogs) {
                blog.content = blog.content.replace(/&nbsp;/g, " ");
                // bypass title modification pre-save slug check by marking modified
                blog.markModified("content");
                await blog.save();
                console.log(`[Migration] Updated blog: "${blog.title}"`);
            }
            console.log("[Migration] Database migration for blogs completed successfully!");
        } else {
            console.log("[Migration] No blogs with &nbsp; formatting were found.");
        }
    } catch (err) {
        console.error("[Migration] Error migrating blogs:", err);
    }
};

const mongoConnection = async () => {
    try {
        mongoose.connection.on('connected', async () => {
            console.log('MongoDB Connected Successfully!');
            // Run migration once connected
            await migrateBlogs();
        });
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB error:', err);
        });

        await mongoose.connect(`${process.env.MONGO_URI}/abeer-label`);
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
}

export default mongoConnection;