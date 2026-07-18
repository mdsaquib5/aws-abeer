import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["product", "blog"],
            default: "product",
            required: true,
        },
        image: {
            url: String,
            publicId: String,
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.pre("save", async function () {
    if (!this.isModified("name")) return;

    let baseSlug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (
        await mongoose.models.Category?.findOne({
            slug,
            _id: { $ne: this._id },
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;
});

const Category =
    mongoose.models.Category ||
    mongoose.model("Category", categorySchema);

export default Category;
