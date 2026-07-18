"use client";
import React, { useEffect } from 'react';
import BlogCard from "@/components/pages/BlogCard";
import TopHeader from "@/components/pages/TopHeader";
import useBlogStore from "@/store/blogStore";
import { BlogSkeleton } from "@/components/shared/Skeletons";

const BlogPage = () => {
    const { blogs, isLoading, loadBlogs } = useBlogStore();

    useEffect(() => {
        loadBlogs();
    }, [loadBlogs]);

    const displayBlogs = React.useMemo(() => {
        if (isLoading) return [];

        return blogs.map((blog) => {
            const coverUrl = blog.coverImage?.url || "https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/5_o9evmi.webp";

            const dateFormatted = blog.publishedAt || blog.createdAt
                ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
                : "Oct 15, 2026";

            return {
                img: coverUrl,
                blogLink: `/blog/${blog.slug}`,
                title: blog.title,
                desc: blog.excerpt || (blog.content ? blog.content.substring(0, 150) + "..." : ""),
                author: blog.author || "Abeer Label",
                date: dateFormatted
            };
        });
    }, [blogs, isLoading]);

    return (
        <div className="pages">
            <TopHeader
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: null }]}
            />
            <div className="shop-page-wrapper">
                <div className="container">
                    {isLoading ? (
                        <div className="blogs-grid">
                            {[1, 2, 3, 4].map((num) => (
                                <BlogSkeleton key={num} />
                            ))}
                        </div>
                    ) : displayBlogs.length > 0 ? (
                        <div className="blogs-grid">
                            {displayBlogs.map((item, index) => (
                                <BlogCard key={index} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-blogs-message">
                            <p>No blogs found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BlogPage;