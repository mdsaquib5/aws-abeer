import Collection from "../models/collectionSchema.js";

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
export const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, collections });
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create a collection
// @route   POST /api/collections
// @access  Admin/Manager
export const createCollection = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const collection = await Collection.create({
            name,
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, collection });
    } catch (error) {
        console.error("Error creating collection:", error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Collection already exists" });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Admin/Manager
export const updateCollection = async (req, res) => {
    try {
        const { name } = req.body;
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        if (name) collection.name = name;
        await collection.save();

        res.status(200).json({ success: true, collection });
    } catch (error) {
        console.error("Error updating collection:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Admin/Manager
export const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        await collection.deleteOne();

        res.status(200).json({ success: true, message: "Collection deleted" });
    } catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
