import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            index: true,
        },

        excerpt: {
            type: String,
            trim: true,
            default: "",
        },

        content: {
            type: String,
            required: true,
        },

        coverImage: {
            url: {
                type: String,
            },

            publicId: {
                type: String,
            },
        },

        author: {
            type: String,
            default: "Abeer Label",
        },

        category: {
            type: String,
            default: "Fashion",
            index: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        readTime: {
            type: Number,
            default: 1,
        },

        views: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "draft",
                "published",
                "archived",
            ],
            default: "draft",
            index: true,
        },

        seoTitle: {
            type: String,
            default: "",
        },

        seoDescription: {
            type: String,
            default: "",
        },

        publishedAt: Date,

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },

    },
    {
        timestamps: true,
    }
);

blogSchema.pre("save", async function () {
    if (!this.isModified("title")) return;

    let baseSlug = slugify(this.title, {
        lower: true,
        strict: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (
        await mongoose.models.Blog.findOne({
            slug,
            _id: { $ne: this._id },
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;
});

const Blog =
    mongoose.models.Blog ||
    mongoose.model("Blog", blogSchema);

export default Blog;