"use client";

import { useState, useEffect } from "react";
import DashboardTitles from "@/components/layout/DashboardTitles";
import BlogCard from "@/components/shared/BlogCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";
import Link from "next/link";
import { BsPlusLg, BsPencil, BsTrash } from "react-icons/bs";
import useBlogStore from "@/store/blogStore";
import { toast } from "sonner";

export default function BlogsPage() {
    const [view, setView] = useState("cards"); // "cards" | "list"
    const { blogs, isLoading, loadBlogs, removeBlog, changeStatus, setFilter, filters, pagination } = useBlogStore();

    useEffect(() => {
        loadBlogs();
    }, [loadBlogs]);

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this blog?")) {
            const res = await removeBlog(id);
            if (res.success) {
                toast.success("Blog deleted successfully!");
            } else {
                toast.error(res.message);
            }
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === "published" ? "draft" : "published";
        const res = await changeStatus(id, newStatus);
        if (res.success) {
            toast.success(`Blog status updated to ${newStatus}!`);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="dashboard-page">
            <DashboardTitles title="Abeer Stories" subtitle="Content • Blog Management" />
            <div className="dashboard-wrapper">

                <div className="blogs-top-bar">
                    <Searchbar
                        placeholder="Search blogs..."
                        onChange={(e) => setFilter('search', e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') loadBlogs();
                        }}
                    />
                    <div className="blogs-top-actions">
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${view === "cards" ? "active" : ""}`}
                                onClick={() => setView("cards")}
                            >Cards</button>
                            <button
                                className={`view-btn ${view === "list" ? "active" : ""}`}
                                onClick={() => setView("list")}
                            >List</button>
                        </div>
                        <Link href="/dashboard/blogs/add" className="btn-add-blog">
                            <BsPlusLg /> Write New Post
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Loading blogs...</div>
                ) : blogs.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>No blogs found.</div>
                ) : (
                    <>
                        {view === "cards" && (
                            <div className="admin-blogs-grid">
                                {blogs.map((blog) => (
                                    <div key={blog._id} className="admin-blog-wrapper">
                                        <BlogCard item={{
                                            ...blog,
                                            blogLink: "#", // Add this to prevent undefined href in Link
                                            img: blog.coverImage?.url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=640&auto=format&fit=crop",
                                            desc: blog.excerpt || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 100),
                                            date: new Date(blog.createdAt).toLocaleDateString(),
                                        }} />
                                        <div className="blog-card-actions">
                                            <span
                                                className={`blog-status-badge ${blog.status?.toLowerCase()}`}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleStatusToggle(blog._id, blog.status)}
                                            >
                                                {blog.status}
                                            </span>
                                            <div className="blog-action-btns">
                                                <Link href={`/dashboard/blogs/edit/${blog.slug}`} className="blog-action-btn"><BsPencil /></Link>
                                                <button className="blog-action-btn danger" onClick={() => handleDelete(blog._id)}><BsTrash /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {view === "list" && (
                            <div className="orders-table-wrapper glass-panel" style={{ padding: 0 }}>
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blogs.map((blog) => (
                                            <tr key={blog._id}>
                                                <td className="blog-list-title">{blog.title}</td>
                                                <td className="customer-name">{blog.author}</td>
                                                <td className="order-date">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span
                                                        className={`blog-status-badge ${blog.status?.toLowerCase()}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleStatusToggle(blog._id, blog.status)}
                                                    >
                                                        {blog.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="blog-list-actions">
                                                        <Link href={`/dashboard/blogs/edit/${blog.slug}`} className="blog-action-btn"><BsPencil /></Link>
                                                        <button className="blog-action-btn danger" onClick={() => handleDelete(blog._id)}><BsTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                <Pagination />

            </div>
        </div>
    );
}
