"use client";

import React, { useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiCalendar, FiUser, FiClock, FiTag } from "react-icons/fi";
import useBlogStore from "@/store/blogStore";
import TopHeader from "@/components/pages/TopHeader";
import "./blog-details.css";

const BlogDetailPage = ({ params }) => {
    const { slug } = use(params);
    const router = useRouter();
    const { singleBlog, isSingleLoading, loadSingleBlog, clearSingleBlog, error } = useBlogStore();

    useEffect(() => {
        if (slug) {
            loadSingleBlog(slug);
        }
        return () => {
            clearSingleBlog();
        };
    }, [slug, loadSingleBlog, clearSingleBlog]);

    // Dynamic Title for client-side SEO
    useEffect(() => {
        if (singleBlog?.title) {
            document.title = `${singleBlog.title} | ABEER.LABEL`;
        }
    }, [singleBlog]);

    const formattedDate = React.useMemo(() => {
        if (!singleBlog) return "";
        const dateObj = singleBlog.publishedAt || singleBlog.createdAt;
        if (!dateObj) return "";
        return new Date(dateObj).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }, [singleBlog]);

    if (error) {
        return (
            <div className="pages blog-details-wrapper">
                <TopHeader
                    breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "Blog", href: "/blog" },
                        { label: "Error", href: null },
                    ]}
                />
                <div className="shop-page-wrapper">
                    <div className="container blog-details-error-wrapper">
                        <h2 className="blog-details-error-title">
                            Blog Post Not Found
                        </h2>
                        <p className="blog-details-error-text">
                            {error || "The article you are looking for might have been removed or is temporarily unavailable."}
                        </p>
                        <Link href="/blog" className="blog-details-back-link">
                            <FiChevronLeft /> Back to Blogs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pages blog-details-wrapper">
            <TopHeader
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Blog", href: "/blog" },
                    { label: singleBlog?.title || "Reading...", href: null },
                ]}
            />
            <div className="shop-page-wrapper">
                <div className="container">
                    <div className="blog-details-card">
                        {/* Go back */}
                        <div className="blog-details-back-container">
                            <Link href="/blog" className="blog-details-back-link">
                                <FiChevronLeft /> Back to Blogs
                            </Link>
                        </div>

                        {isSingleLoading || !singleBlog ? (
                            /* SKELETON LOADING STATE */
                            <div className="blog-details-skeleton-wrapper">
                                <div className="blog-details-skeleton-title"></div>
                                <div className="blog-details-skeleton-meta"></div>
                                <div className="blog-details-skeleton-image"></div>
                                <div className="blog-details-skeleton-text blog-details-skeleton-w95"></div>
                                <div className="blog-details-skeleton-text blog-details-skeleton-w100"></div>
                                <div className="blog-details-skeleton-text blog-details-skeleton-w90"></div>
                                <div className="blog-details-skeleton-text blog-details-skeleton-w85"></div>
                            </div>
                        ) : (
                            /* BLOG CONTENT STATE */
                            <>
                                <header className="blog-details-header">
                                    {singleBlog.category && (
                                        <span className="blog-details-cat">
                                            {singleBlog.category}
                                        </span>
                                    )}
                                    <h1 className="blog-details-title">
                                        {singleBlog.title}
                                    </h1>
                                    <div className="blog-details-meta">
                                        {singleBlog.author && (
                                            <span>
                                                <FiUser /> By {singleBlog.author}
                                            </span>
                                        )}
                                        {formattedDate && (
                                            <span>
                                                <FiCalendar /> {formattedDate}
                                            </span>
                                        )}
                                        {singleBlog.readTime && (
                                            <span>
                                                <FiClock /> {singleBlog.readTime} min read
                                            </span>
                                        )}
                                    </div>
                                </header>

                                {singleBlog.coverImage?.url && (
                                    <div className="blog-details-image-container">
                                        <Image
                                            src={singleBlog.coverImage.url}
                                            alt={singleBlog.title}
                                            fill
                                            className="blog-details-image"
                                            priority
                                            sizes="(max-width: 1200px) 100vw, 1200px"
                                        />
                                    </div>
                                )}

                                <article
                                    className="blog-details-content"
                                    dangerouslySetInnerHTML={{ 
                                        __html: singleBlog.content ? singleBlog.content.replace(/&nbsp;/g, " ") : "" 
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
