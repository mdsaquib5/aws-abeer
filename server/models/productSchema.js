import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
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

        originalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        category: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
        },

        sizes: {
            type: [String],
            default: ["XS", "S", "M", "L", "XL", "2XL"],
        },

        aspectRatio: {
            type: String,
            enum: ["landscape", "portrait"],
            default: "portrait",
        },

        images: [
            {
                url: {
                    type: String,
                    required: true,
                },

                publicId: {
                    type: String,
                    required: true,
                },
            },
        ],

        video: {
            url: String,
            publicId: String,
        },

        composition: {
            type: String,
            default: "",
        },

        lining: {
            type: String,
            default: "",
        },

        fit: {
            type: String,
            default: "",
        },

        print: {
            type: String,
            default: "",
        },

        details: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            required: true,
        },

        care: {
            type: String,
            default: "",
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        inStock: {
            type: Boolean,
            default: true,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["draft", "published", "archived"],
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

        seoKeywords: {
            type: [String],
            default: [],
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

productSchema.pre("save", async function () {
    this.inStock = this.stock > 0;

    if (!this.isModified("name")) return;

    let baseSlug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (
        await this.constructor.findOne({
            slug,
            _id: { $ne: this._id },
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;
});

const Product =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);

export default Product;