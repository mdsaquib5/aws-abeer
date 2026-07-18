"use client";

import { useState, useEffect } from "react";
import DashboardTitles from "@/components/layout/DashboardTitles";
import { BsPencil, BsTrash, BsPlusLg } from "react-icons/bs";
import { getCollections, createCollection, updateCollection, deleteCollection } from "@/lib/collectionApi";
import { toast } from "sonner";

export default function CollectionsPage() {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadCollections = async () => {
        setIsLoading(true);
        try {
            const res = await getCollections();
            if (res.success) {
                setCollections(res.collections);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCollections();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Collection name is required");

        setIsSubmitting(true);
        const data = { name };

        try {
            if (editingId) {
                const res = await updateCollection(editingId, data);
                if (res.success) {
                    toast.success("Collection updated successfully!");
                    setEditingId(null);
                    setName("");
                    loadCollections();
                } else {
                    toast.error(res.message);
                }
            } else {
                const res = await createCollection(data);
                if (res.success) {
                    toast.success("Collection added successfully!");
                    setName("");
                    loadCollections();
                } else {
                    toast.error(res.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        setIsSubmitting(false);
    };

    const handleEdit = (collection) => {
        setEditingId(collection._id);
        setName(collection.name);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setName("");
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this collection?")) {
            try {
                const res = await deleteCollection(id);
                if (res.success) {
                    toast.success("Collection deleted successfully!");
                    loadCollections();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Failed to delete collection");
            }
        }
    };

    return (
        <div className="dashboard-page">
            <DashboardTitles title="Collections" subtitle="Catalog • Manage Collections" />
            <div className="dashboard-wrapper">

                <div className="categories-layout">

                    {/* Add / Edit Form */}
                    <div className="glass-panel category-form-panel">
                        <h3 className="category-form-title">
                            {editingId ? "Edit Collection" : "Add New Collection"}
                        </h3>
                        <form onSubmit={handleSubmit} className="category-form-inner">
                            <div className="product-form-group">
                                <label>Collection Name</label>
                                <input
                                    type="text"
                                    className="product-form-input"
                                    placeholder="Enter collection name (e.g. Nargis)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="category-form-actions">
                                <button
                                    type="submit"
                                    className="btn-add-blog"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : editingId ? "Update Collection" : <><BsPlusLg /> Add Collection</>}
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

                    {/* Collection List */}
                    <div className="orders-table-wrapper glass-panel category-list-panel">
                        <div className="panel-header-simple">
                            <h3>All Collections ({collections.length})</h3>
                        </div>
                        {isLoading && collections.length === 0 ? (
                            <div className="category-empty">Loading collections...</div>
                        ) : collections.length === 0 ? (
                            <div className="category-empty">No collections found.</div>
                        ) : (
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Slug</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collections.map((col) => (
                                        <tr key={col._id}>
                                            <td className="font-weight-500 text-white">{col.name}</td>
                                            <td className="text-gray">{col.slug}</td>
                                            <td>
                                                <div className="blog-list-actions flex-end">
                                                    <button className="blog-action-btn" onClick={() => handleEdit(col)}><BsPencil /></button>
                                                    <button className="blog-action-btn danger" onClick={() => handleDelete(col._id)}><BsTrash /></button>
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
