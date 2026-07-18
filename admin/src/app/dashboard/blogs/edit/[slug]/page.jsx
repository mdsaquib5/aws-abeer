"use client";

import { useState, useEffect } from "react";
import DashboardTitles from "@/components/layout/DashboardTitles";
import Link from "next/link";
import { BsArrowLeft, BsImage } from "react-icons/bs";
import { useRouter, useParams } from "next/navigation";
import { getBlogBySlug, updateBlog } from "@/lib/blogApi";
import useCategoryStore from "@/store/categoryStore";
import dynamic from 'next/dynamic';
import { toast } from "sonner";
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditBlogPage() {
    const router = useRouter();
    const { slug } = useParams();
    const { categories, loadCategories } = useCategoryStore();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState("draft");
    const [charCount, setCharCount] = useState(0);
    const [blogId, setBlogId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        author: "Abeer Team",
        category: "Fashion",
        coverImage: null,
        coverImagePreview: null,
    });

    useEffect(() => {
        loadCategories("blog");
    }, [loadCategories]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await getBlogBySlug(slug);
                if (res.success && res.data) {
                    const blog = res.data;
                    setBlogId(blog._id);
                    setFormData({
                        title: blog.title || "",
                        excerpt: blog.excerpt || "",
                        content: blog.content || "",
                        author: blog.author || "Abeer Team",
                        category: blog.category || "Fashion",
                        coverImage: null,
                        coverImagePreview: blog.coverImage?.url || null,
                    });
                    setStatus(blog.status || "draft");
                    setCharCount((blog.excerpt || "").length);
                }
            } catch (error) {
                toast.error("Failed to load blog data.");
                router.push("/dashboard/blogs");
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug, router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                coverImage: file,
                coverImagePreview: URL.createObjectURL(file),
            });
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content) {
            return toast.error("Title and Content are required!");
        }

        setIsSaving(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("excerpt", formData.excerpt);
            data.append("content", formData.content);
            data.append("author", formData.author);
            data.append("category", formData.category);
            data.append("status", status);
            
            if (formData.coverImage) {
                data.append("coverImage", formData.coverImage);
            }

            await updateBlog(blogId, data);
            toast.success("Blog post updated successfully!");
            router.push("/dashboard/blogs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update blog");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading blog editor...</div>;
    }

    return (
        <div className="dashboard-page">
            <div className="add-blog-header">
                <DashboardTitles title="Edit Blog Post" subtitle="Content • Edit Post" />
                <Link href="/dashboard/blogs" className="back-btn">
                    <BsArrowLeft /> Back to Blogs
                </Link>
            </div>

            <div className="dashboard-wrapper">
                <div className="add-blog-layout glass-panel">

                    {/* Blog Title */}
                    <div className="product-form-group">
                        <label>Blog Title *</label>
                        <input 
                            type="text" 
                            className="product-form-input" 
                            placeholder="Enter blog title" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Description (Excerpt) */}
                    <div className="product-form-group">
                        <label>Description (Max 200 chars) *</label>
                        <textarea
                            className="product-form-textarea"
                            rows={3}
                            maxLength={200}
                            placeholder="Write a brief, catchy summary for listing cards (1-2 lines)"
                            value={formData.excerpt}
                            onChange={(e) => {
                                setCharCount(e.target.value.length);
                                setFormData({...formData, excerpt: e.target.value});
                            }}
                        />
                        <span className="char-count">{charCount}/200 characters</span>
                    </div>

                    {/* Category */}
                    <div className="product-form-group">
                        <label>Category</label>
                        <select 
                            className="product-form-input"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="Fashion">Fashion</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Cover Image */}
                    <div className="product-form-group">
                        <label>Cover Image</label>
                        <div 
                            className="image-upload-zone" 
                            style={{ position: 'relative', overflow: 'hidden', backgroundImage: `url(${formData.coverImagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <input 
                                type="file" 
                                accept="image/*"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                                onChange={handleImageChange}
                            />
                            {!formData.coverImagePreview && (
                                <>
                                    <BsImage style={{ fontSize: "28px", color: "#666" }} />
                                    <span className="upload-text">Upload Cover Image</span>
                                    <span className="upload-hint">PNG, JPG up to 5MB</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Editorial Content */}
                    <div className="product-form-group">
                        <label>Editorial Content *</label>
                        <div className="blog-editor-wrapper" style={{ minHeight: "300px", background: "#fff", color: "#000", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "4px", paddingBottom: "40px" }}>
                            <ReactQuill 
                                theme="snow" 
                                value={formData.content} 
                                onChange={(val) => setFormData({...formData, content: val})} 
                                style={{ height: "250px" }}
                            />
                        </div>
                    </div>

                    {/* Author */}
                    <div className="product-form-group">
                        <label>Author Name</label>
                        <input 
                            type="text" 
                            className="product-form-input" 
                            value={formData.author}
                            onChange={(e) => setFormData({...formData, author: e.target.value})}
                        />
                    </div>

                    {/* Footer */}
                    <div className="add-blog-footer">
                        <div className="blog-status-toggle">
                            <span className="modal-footer-label">Status:</span>
                            <button
                                className={`status-toggle-btn ${status === "draft" ? "active-draft" : ""}`}
                                onClick={() => setStatus("draft")}
                            >Draft</button>
                            <button
                                className={`status-toggle-btn ${status === "published" ? "active-publish" : ""}`}
                                onClick={() => setStatus("published")}
                            >Publish</button>
                        </div>
                        <button 
                            className="btn-save-blog" 
                            onClick={handleSave} 
                            disabled={isSaving}
                            style={{ opacity: isSaving ? 0.7 : 1 }}
                        >
                            {isSaving ? "Saving Updates..." : "Update Blog Post"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
