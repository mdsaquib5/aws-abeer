"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import DashboardTitles from "@/components/layout/DashboardTitles";
import { BsCloudUpload, BsCheckLg, BsTrash } from "react-icons/bs";
import { toast } from "sonner";
import { fetchProductById, updateProduct } from "@/lib/productApi";
import { getCollections } from "@/lib/collectionApi";
import { getCategories } from "@/lib/categoryApi";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

export default function EditProductPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    
    // Page state
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [stock, setStock] = useState("");
    const [collectionId, setCollectionId] = useState("");
    const [category, setCategory] = useState("");
    const [aspectRatio, setAspectRatio] = useState("portrait");
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [status, setStatus] = useState("draft");

    // Existing Media (retained on server)
    const [existingImages, setExistingImages] = useState([]);
    const [existingVideo, setExistingVideo] = useState(null);
    const [removeVideo, setRemoveVideo] = useState(false);

    // New Media State (to be uploaded)
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [newVideo, setNewVideo] = useState(null);
    const [newVideoPreview, setNewVideoPreview] = useState(null);

    // Product properties
    const [composition, setComposition] = useState("");
    const [lining, setLining] = useState("");
    const [fit, setFit] = useState("");
    const [print, setPrint] = useState("");
    const [details, setDetails] = useState("");
    const [care, setCare] = useState("");

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await getCollections();
                if (res.success) setCollections(res.collections);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCollections();
    }, []);

    // Fetch product details on mount
    useEffect(() => {
        const loadProduct = async () => {
            try {
                setIsFetching(true);
                const response = await fetchProductById(id);
                if (response.success && response.data) {
                    const product = response.data;
                    setName(product.name || "");
                    setDescription(product.description || "");
                    setPrice(product.price || "");
                    setOriginalPrice(product.originalPrice || "");
                    setStock(product.stock || "");
                    setCategory(product.category || "");
                    const colId = typeof product.collectionId === 'object' && product.collectionId !== null 
                        ? product.collectionId._id 
                        : product.collectionId || "";
                    setCollectionId(colId);
                    setAspectRatio(product.aspectRatio || "portrait");
                    setSelectedSizes(product.sizes || []);
                    setStatus(product.status || "draft");
                    setComposition(product.composition || "");
                    setLining(product.lining || "");
                    setFit(product.fit || "");
                    setPrint(product.print || "");
                    setDetails(product.details || "");
                    setCare(product.care || "");
                    setExistingImages(product.images || []);
                    setExistingVideo(product.video || null);
                } else {
                    toast.error("Failed to load product details");
                    router.push("/dashboard/products");
                }
            } catch (error) {
                console.error("Error loading product:", error);
                toast.error("Error loading product");
                router.push("/dashboard/products");
            } finally {
                setIsFetching(false);
            }
        };

        if (id) {
            loadProduct();
        }
    }, [id, router]);

    const handleSizeToggle = (size, e) => {
        e.preventDefault();
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter((s) => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    useEffect(() => {
        if (!collectionId) {
            setCategories([]);
            return;
        }

        const fetchCategories = async () => {
            try {
                const res = await getCategories("product", collectionId);
                if (res.success) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, [collectionId]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validation: Limit to 10 images total (existing + new)
        const totalImagesCount = existingImages.length + newImages.length + files.length;
        if (totalImagesCount > 10) {
            toast.error("You can have a maximum of 10 images total");
            return;
        }

        const validFiles = [];
        const validPreviews = [];

        files.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`${file.name} is larger than 2MB`);
                return;
            }
            validFiles.push(file);
            validPreviews.push(URL.createObjectURL(file));
        });

        setNewImages([...newImages, ...validFiles]);
        setNewImagePreviews([...newImagePreviews, ...validPreviews]);
    };

    const removeExistingImage = (index, e) => {
        e.preventDefault();
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index, e) => {
        e.preventDefault();
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Video file is larger than 10MB");
            return;
        }

        setNewVideo(file);
        setNewVideoPreview(URL.createObjectURL(file));
        setRemoveVideo(false); // If uploading new, don't trigger deletion of the new video
    };

    const removeNewVideo = (e) => {
        e.preventDefault();
        setNewVideo(null);
        setNewVideoPreview(null);
    };

    const removeExistingVideo = (e) => {
        e.preventDefault();
        setExistingVideo(null);
        setRemoveVideo(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !price || !stock || !category) {
            toast.error("Please fill in all required fields");
            return;
        }

        const totalImagesCount = existingImages.length + newImages.length;
        if (totalImagesCount === 0) {
            toast.error("Please have at least one image");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Updating product, uploading media...");

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", Number(price));
            formData.append("originalPrice", Number(originalPrice || price));
            formData.append("stock", Number(stock));
            formData.append("category", category);
            if (collectionId) formData.append("collectionId", collectionId);
            formData.append("aspectRatio", aspectRatio);
            formData.append("sizes", JSON.stringify(selectedSizes));
            formData.append("composition", composition);
            formData.append("lining", lining);
            formData.append("fit", fit);
            formData.append("print", print);
            formData.append("details", details);
            formData.append("care", care);
            formData.append("status", status);

            // Send list of existing images to keep
            formData.append("keepImages", JSON.stringify(existingImages));

            // Send remove video flag
            if (removeVideo && !newVideo) {
                formData.append("removeVideo", "true");
            }

            // Append new images
            newImages.forEach((img) => {
                formData.append("images", img);
            });

            // Append new video
            if (newVideo) {
                formData.append("video", newVideo);
            }

            const data = await updateProduct(id, formData);

            if (data.success) {
                toast.success("Product updated successfully! 🎉", { id: toastId });
                router.push("/dashboard/products");
            } else {
                toast.error(data.message || "Failed to update product", { id: toastId });
            }
        } catch (error) {
            console.error("Product Edit Error:", error);
            const errMsg = error.response?.data?.message || "Failed to update product due to a network error";
            toast.error(errMsg, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="dashboard-page">
                <DashboardTitles title="Edit Product" />
                <div className="dashboard-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                    <div style={{ color: "var(--white)", opacity: 0.6, fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Loading Product Details...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <DashboardTitles title="Edit Product" />
            <div className="dashboard-wrapper">
                <form className="add-product-layout" onSubmit={handleSubmit}>
                    <div className="left-column">
                        <div className="glass-panel">
                            <div className="product-form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    className="product-form-input"
                                    placeholder="e.g. Qala One Piece Ethnic Dress"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="product-form-group">
                                <label>Description *</label>
                                <textarea
                                    className="product-form-textarea"
                                    rows={4}
                                    placeholder="Describe your product — materials, craftsmanship, fit..."
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isLoading}
                                ></textarea>
                                <span className="char-count">{description.length}/500</span>
                            </div>

                            <div className="form-row">
                                <div className="product-form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        className="product-form-input"
                                        placeholder="₹ 0"
                                        required
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="product-form-group">
                                    <label>Original Price (₹)</label>
                                    <input
                                        type="number"
                                        className="product-form-input"
                                        placeholder="₹ 0"
                                        min="0"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="product-form-group">
                                    <label>Stock *</label>
                                    <input
                                        type="number"
                                        className="product-form-input"
                                        placeholder="10"
                                        required
                                        min="0"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="product-form-group">
                                    <label>COLLECTION *</label>
                                    <select
                                        className="product-form-input"
                                        value={collectionId}
                                        onChange={(e) => {
                                            setCollectionId(e.target.value);
                                            setCategory(""); // Reset category when collection changes
                                        }}
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>SELECT COLLECTION</option>
                                        {collections.map((col) => (
                                            <option key={col._id} value={col._id}>
                                                {col.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="product-form-group">
                                    <label>CATEGORY *</label>
                                    <select
                                        className="product-form-input"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        disabled={isLoading || !collectionId || categories.length === 0}
                                    >
                                        <option value="" disabled>
                                            {!collectionId ? "SELECT COLLECTION FIRST" : "SELECT CATEGORY"}
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="product-form-group">
                                    <label>Aspect Ratio *</label>
                                    <select
                                        className="product-form-input"
                                        style={{ background: "#090505", border: "1px solid #975e254d", color: "#aaa" }}
                                        value={aspectRatio}
                                        onChange={(e) => setAspectRatio(e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="portrait">Portrait (3:4)</option>
                                        <option value="landscape">Landscape (4:3)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="product-form-group" style={{ marginTop: "10px" }}>
                                <label>Status *</label>
                                <select
                                    className="product-form-input"
                                    style={{ background: "#090505", border: "1px solid #975e254d", color: "#aaa" }}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    disabled={isLoading}
                                >
                                    <option value="draft">Draft (Hidden)</option>
                                    <option value="published">Published (Visible)</option>
                                    <option value="archived">Archived (Out of stock/Inactive)</option>
                                </select>
                            </div>
                        </div>

                        <div className="glass-panel">
                            <h3 className="panel-title">Specifications</h3>
                            <div className="form-row">
                                <div className="product-form-group">
                                    <label>Composition</label>
                                    <input
                                        type="text"
                                        className="product-form-input"
                                        placeholder="e.g. 100% Cotton Malmal"
                                        value={composition}
                                        onChange={(e) => setComposition(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="product-form-group">
                                    <label>Lining</label>
                                    <input
                                        type="text"
                                        className="product-form-input"
                                        placeholder="e.g. Included"
                                        value={lining}
                                        onChange={(e) => setLining(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="product-form-group">
                                    <label>Fit</label>
                                    <input
                                        type="text"
                                        className="product-form-input"
                                        placeholder="e.g. Flowy A-Line Fit"
                                        value={fit}
                                        onChange={(e) => setFit(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="product-form-group">
                                    <label>Print/Pattern</label>
                                    <input
                                        type="text"
                                        className="product-form-input"
                                        placeholder="e.g. Solid Ivory"
                                        value={print}
                                        onChange={(e) => setPrint(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="product-form-group">
                                    <label>Details</label>
                                    <input
                                        type="text"
                                        className="product-form-input"
                                        placeholder="e.g. Hand Embroidery on Yoke"
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="product-form-group">
                                    <label>Care Instructions</label>
                                    <input
                                        type="text"
                                        className="product-form-input"
                                        placeholder="e.g. Dry Clean Only"
                                        value={care}
                                        onChange={(e) => setCare(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel">
                            <h3 className="panel-title">Available Sizes *</h3>
                            <div className="size-options">
                                {AVAILABLE_SIZES.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSizes.includes(size) ? "active" : ""}`}
                                        onClick={(e) => handleSizeToggle(size, e)}
                                        disabled={isLoading}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="right-column">
                        <div className="glass-panel" style={{ marginBottom: "24px" }}>
                            <div className="panel-header-row">
                                <div>
                                    <h3 className="panel-title" style={{ color: "var(--white)", borderBottom: "none", textTransform: "capitalize", fontSize: "18px" }}>Product Images</h3>
                                    <span className="error-text">* Max 10 total (less than 2MB each)</span>
                                </div>
                                <span className="header-badge">{existingImages.length + newImages.length}/10</span>
                            </div>

                            <input
                                type="file"
                                ref={imageInputRef}
                                style={{ display: "none" }}
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            <div className="image-upload-zone" onClick={() => imageInputRef.current?.click()}>
                                <BsCloudUpload className="upload-icon" />
                                <div className="upload-text">Drop images here or click to browse</div>
                                <div className="upload-subtext">PNG, JPG, WEBP — Less than 2MB each</div>
                            </div>

                            {/* Existing Images list */}
                            {existingImages.length > 0 && (
                                <div style={{ marginTop: "20px" }}>
                                    <div style={{ fontSize: "12px", color: "var(--white)", opacity: 0.6, marginBottom: "10px", textTransform: "uppercase" }}>Existing Images:</div>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                                        {existingImages.map((img, index) => (
                                            <div key={img.publicId || index} style={{ position: "relative", aspectRatio: "3/4", background: "#000", border: "1px solid #333" }}>
                                                <img
                                                    src={img.url}
                                                    alt="Existing"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                                <button
                                                    onClick={(e) => removeExistingImage(index, e)}
                                                    style={{ position: "absolute", top: "5px", right: "5px", background: "red", border: "none", color: "white", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                    title="Remove Image"
                                                >
                                                    <BsTrash style={{ color: "white" }} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Previews list */}
                            {newImagePreviews.length > 0 && (
                                <div style={{ marginTop: "20px" }}>
                                    <div style={{ fontSize: "12px", color: "#e1a489", marginBottom: "10px", textTransform: "uppercase" }}>New Images to Upload:</div>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                                        {newImagePreviews.map((preview, index) => (
                                            <div key={index} style={{ position: "relative", aspectRatio: "3/4", background: "#000", border: "1px solid #e1a489" }}>
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                                <button
                                                    onClick={(e) => removeNewImage(index, e)}
                                                    style={{ position: "absolute", top: "5px", right: "5px", background: "red", border: "none", color: "white", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                    title="Remove Image"
                                                >
                                                    <BsTrash style={{ color: "white" }} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel" style={{ marginBottom: "24px" }}>
                            <div className="panel-header-row">
                                <div>
                                    <h3 className="panel-title" style={{ color: "var(--white)", borderBottom: "none", textTransform: "capitalize", fontSize: "18px" }}>Product Video</h3>
                                    <span className="error-text">* Optional — Less than 10MB</span>
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={videoInputRef}
                                style={{ display: "none" }}
                                accept="video/*"
                                onChange={handleVideoChange}
                            />

                            {/* Existing Video */}
                            {existingVideo && !newVideo && (
                                <div style={{ position: "relative", width: "100%", height: "180px", background: "#000", marginTop: "10px" }}>
                                    <video
                                        src={existingVideo.url}
                                        controls
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                    <button
                                        onClick={removeExistingVideo}
                                        style={{ position: "absolute", top: "5px", right: "5px", background: "red", border: "none", color: "white", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        title="Delete Existing Video"
                                    >
                                        <BsTrash />
                                    </button>
                                </div>
                            )}

                            {/* New Video Preview */}
                            {newVideo && (
                                <div style={{ position: "relative", width: "100%", height: "180px", background: "#000", marginTop: "10px" }}>
                                    <video
                                        src={newVideoPreview}
                                        controls
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                    <button
                                        onClick={handleRemoveNewVideo}
                                        style={{ position: "absolute", top: "5px", right: "5px", background: "red", border: "none", color: "white", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        title="Remove Video"
                                    >
                                        <BsTrash />
                                    </button>
                                </div>
                            )}

                            {/* Upload Zone (show when no existing video and no new video selected) */}
                            {!existingVideo && !newVideo && (
                                <div className="image-upload-zone" onClick={() => videoInputRef.current?.click()}>
                                    <BsCloudUpload className="upload-icon" />
                                    <div className="upload-text">Select product video</div>
                                    <div className="upload-subtext">MP4, WEBM — Max 1 video (Less than 10MB)</div>
                                </div>
                            )}
                        </div>

                        <div className="right-column-actions">
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                <BsCheckLg style={{ strokeWidth: "1px" }} /> {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={() => router.push("/dashboard/products")} disabled={isLoading}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
