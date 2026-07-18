"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Titles from "../layout/Titles";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useCategoryStore from "@/store/categoryStore";
import { CategorySkeleton } from "@/components/shared/Skeletons";

const GLOBAL_DEFAULT_IMAGE = "https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/comming-soon.png";

const Category = () => {
    const swiperRef = useRef(null);
    const { categories, loadCategories, isLoading: isCategoriesLoading } = useCategoryStore();

    useEffect(() => {
        loadCategories("product");
    }, [loadCategories]);

    // Format display categories from live DB data
    const displayCategories = React.useMemo(() => {
        if (isCategoriesLoading) return [];

        return categories.map((cat) => {
            let resolvedImg = cat.resolvedImage || GLOBAL_DEFAULT_IMAGE;

            return {
                id: cat._id || cat.id,
                name: cat.name,
                image: resolvedImg,
                productsCount: cat.productsCount || 0
            };
        });
    }, [categories, isCategoriesLoading]);

    const isLoading = isCategoriesLoading;

    return (
        <section className="category-section section-padding">
            <div className="container category-container">
                <Titles subTitle="Explore the Silhouettes" title="Shop By Category" />

                {!isLoading && displayCategories.length > 0 && (
                    <>
                        <button className="category-nav left" aria-label="Previous category">
                            <FiChevronLeft size={24} />
                        </button>
                        <button className="category-nav right" aria-label="Next category">
                            <FiChevronRight size={24} />
                        </button>
                    </>
                )}

                <div className="category-slider-wrapper">
                    {isLoading ? (
                        <div className="category-skeleton-grid">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <CategorySkeleton key={num} />
                            ))}
                        </div>
                    ) : displayCategories.length > 0 ? (
                        <Swiper
                            modules={[Navigation]}
                            onSwiper={(swiper) => swiperRef.current = swiper}
                            spaceBetween={20}
                            slidesPerView={1.5}
                            navigation={{
                                prevEl: '.category-nav.left',
                                nextEl: '.category-nav.right',
                            }}
                            watchOverflow={true}
                            breakpoints={{
                                480: { slidesPerView: 2, spaceBetween: 20, allowTouchMove: true },
                                768: { slidesPerView: 3, spaceBetween: 30, allowTouchMove: true },
                                992: { slidesPerView: 4, spaceBetween: 40, allowTouchMove: true },
                                1440: { slidesPerView: 5, spaceBetween: 50, allowTouchMove: false }
                            }}
                            className="category-swiper"
                        >
                            {displayCategories.map((cat) => (
                                <SwiperSlide key={cat.id}>
                                    <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-card">
                                        <div className="category-img">
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                sizes="(max-width: 768px) 150px, 260px"
                                                className="pd-media-cover"
                                                priority={true}
                                            />
                                        </div>
                                        <h3 className="category-title">{cat.name}</h3>
                                        <p className="category-products">{cat.productsCount} Product{cat.productsCount !== 1 ? 's' : ''}</p>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="no-categories-message">
                            <p>No categories found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Category;