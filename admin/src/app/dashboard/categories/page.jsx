"use client";

import { useState, useEffect } from "react";
import DashboardTitles from "@/components/layout/DashboardTitles";
import { BsPencil, BsTrash, BsPlusLg } from "react-icons/bs";
import { toast } from "sonner";
import { getCollections } from "@/lib/collectionApi";
import useCategoryStore from "@/store/categoryStore";

export default function CategoriesPage() {
    const { categories, isLoading, loadCategories, addCategory, editCategory, removeCategory } = useCategoryStore();

    const [name, setName] = useState("");
    const [type, setType] = useState("product");
    const [collectionId, setCollectionId] = useState("");
    const [image, setImage] = useState(null);
    const [collections, setCollections] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
        // Load collections
        const loadCols = async () => {
            try {
                const res = await getCollections();
                if (res.success) setCollections(res.collections);
            } catch (error) {
                console.error(error);
            }
        };
        loadCols();
    }, [loadCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Category name is required");

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        if (collectionId) formData.append("collectionId", collectionId);
        if (type === 'product' && image) {
            formData.append("image", image);
        }

        if (editingId) {
            const res = await editCategory(editingId, formData);
            if (res.success) {
                toast.success("Category updated successfully!");
                setEditingId(null);
                setName("");
                setType("product");
                setCollectionId("");
                setImage(null);
                setPreviewUrl(null);
            } else {
                toast.error(res.message);
            }
        } else {
            const res = await addCategory(formData);
            if (res.success) {
                toast.success("Category added successfully!");
                setName("");
                setType("product");
                setCollectionId("");
                setImage(null);
                setPreviewUrl(null);
            } else {
                toast.error(res.message);
            }
        }
        setIsSubmitting(false);
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setName(category.name);
        setType(category.type);
        setCollectionId(category.collectionId || "");
        setImage(null);
        setPreviewUrl(category.image?.url || null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setName("");
        setType("product");
        setCollectionId("");
        setImage(null);
        setPreviewUrl(null);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            const res = await removeCategory(id);
            if (res.success) {
                toast.success("Category deleted successfully!");
            } else {
                toast.error(res.message);
            }
        }
    };

    return (
        <div className="dashboard-page">
            <DashboardTitles title="Categories" subtitle="Catalog • Manage Categories" />
            <div className="dashboard-wrapper">

                <div className="categories-layout">

                    {/* Add / Edit Form */}
                    <div className="glass-panel category-form-panel">
                        <h3 className="category-form-title">
                            {editingId ? "Edit Category" : "Add New Category"}
                        </h3>
                        <form onSubmit={handleSubmit} className="category-form-inner">
                            <div className="product-form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    className="product-form-input"
                                    placeholder="Enter category name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="product-form-group">
                                <label>Category Type</label>
                                <select
                                    className="product-form-input"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="product">Product</option>
                                    <option value="blog">Blog</option>
                                </select>
                            </div>
                            {type === 'product' && (
                                <div className="product-form-group">
                                    <label>Assign to Collection (Optional)</label>
                                    <select
                                        className="product-form-input"
                                        value={collectionId}
                                        onChange={(e) => setCollectionId(e.target.value)}
                                    >
                                        <option value="">-- No Collection --</option>
                                        {collections.map(col => (
                                            <option key={col._id} value={col._id}>{col.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {type === 'product' && (
                                <div className="product-form-group">
                                    <label>Category Image (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="product-form-input"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImage(file);
                                                setPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {previewUrl && (
                                        <div style={{ marginTop: '10px' }}>
                                            <img src={previewUrl} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="category-form-actions">
                                <button
                                    type="submit"
                                    className="btn-add-blog"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : editingId ? "Update Category" : <><BsPlusLg /> Add Category</>}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn-add-blog category-btn-cancel"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Category List */}
                    <div className="orders-table-wrapper glass-panel category-list-panel">
                        <div className="panel-header-simple">
                            <h3>All Categories ({categories.length})</h3>
                        </div>
                        {isLoading && categories.length === 0 ? (
                            <div className="category-empty">Loading categories...</div>
                        ) : categories.length === 0 ? (
                            <div className="category-empty">No categories found.</div>
                        ) : (
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Slug</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat._id}>
                                            <td>
                                                {cat.image?.url ? (
                                                    <img src={cat.image.url} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>N/A</div>
                                                )}
                                            </td>
                                            <td className="font-weight-500 text-white">{cat.name}</td>
                                            <td>
                                                <span className="blog-status-badge published category-type-badge">
                                                    {cat.type}
                                                </span>
                                            </td>
                                            <td className="text-gray">{cat.slug}</td>
                                            <td>
                                                <div className="blog-list-actions flex-end">
                                                    <button className="blog-action-btn" onClick={() => handleEdit(cat)}><BsPencil /></button>
                                                    <button className="blog-action-btn danger" onClick={() => handleDelete(cat._id)}><BsTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
