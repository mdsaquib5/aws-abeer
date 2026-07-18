'use client';
import { useEffect } from "react";
import Titles from "../layout/Titles";
import ProductCard from "../shared/ProductCard";
import useProductStore from "@/store/productStore";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductSkeleton } from "@/components/shared/Skeletons";

const OurProduct = () => {
    const { products, loadProducts, isLoading } = useProductStore();

    useEffect(() => {
        loadProducts({ limit: 8 }); // Fetch top 8 published products for home page slider
    }, [loadProducts]);

    return (
        <section>
            <div className="container">
                <Titles subTitle="Designed to Stay" title="Our Products" />
                <div className="product-slider">
                    {isLoading ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                            {[1, 2, 3, 4].map((num) => (
                                <ProductSkeleton key={num} />
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={4}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 10 },
                                640: { slidesPerView: 2, spaceBetween: 15 },
                                1024: { slidesPerView: 3, spaceBetween: 20 },
                                1440: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                            style={{ paddingBottom: '40px' }}>
                            {products.map((product, index) => (
                                <SwiperSlide key={product._id || product.id}>
                                    <ProductCard product={product} index={index} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.6; }
                }
            ` }} />
        </section >
    )
}

export default OurProduct;