'use client';

import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Titles from '../layout/Titles';
import { reelsData } from '../../constants/product';
import ReelCard from '../shared/ReelCard';

export default function Instagram() {
    return (
        <section className="instagram-bg">
            <div className="container">
                <Titles subTitle="Wear Your Soul in Motion" title="The Abeer Muse" />

                <div className="reels-sliderWrapper">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation={{
                            nextEl: `.reels-swiperButtonNext`,
                            prevEl: `.reels-swiperButtonPrev`,
                        }}
                        pagination={{
                            clickable: true,
                            el: `.reels-swiperPagination`,
                            bulletClass: 'reels-swiperBullet',
                            bulletActiveClass: 'reels-swiperBulletActive'
                        }}
                        breakpoints={{
                            480: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1440: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            }
                        }}
                        className="reels-swiperContainer"
                    >
                        {reelsData.map((reel) => (
                            <SwiperSlide key={reel.id} className="reels-swiperSlide">
                                <ReelCard reel={reel} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className={`reels-swiperButtonPrev reels-navArrow`} aria-label="Previous slide">
                        <IoChevronBack size={20} />
                    </button>
                    <button className={`reels-swiperButtonNext reels-navArrow`} aria-label="Next slide">
                        <IoChevronForward size={20} />
                    </button>

                    <div className="reels-swiperPagination"></div>
                </div>
            </div>
        </section>
    );
}