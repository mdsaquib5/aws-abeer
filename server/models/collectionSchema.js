import mongoose from "mongoose";
import slugify from "slugify";

const collectionSchema = new mongoose.Schema(
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
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: true,
    }
);

collectionSchema.pre("save", async function () {
    if (!this.isModified("name")) return;

    let baseSlug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (
        await mongoose.models.Collection?.findOne({
            slug,
            _id: { $ne: this._id },
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;
});

export default mongoose.model("Collection", collectionSchema);
