'use client';

import React from 'react';
import Titles from "../layout/Titles";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { BsFlower2 } from 'react-icons/bs';
import { VscQuote } from "react-icons/vsc"

const testimonialsData = [
    {
        id: 1,
        text: "The fabric is very soft and comfortable. Got so many compliments when I wore it!",
        name: "SANA KHAN",
        title: "ABEER MUSE"
    },
    {
        id: 2,
        text: "The embroidery is super neat and beautiful. Looks exactly like the pictures.",
        name: "MEERA IYER",
        title: "ABEER MUSE"
    },
    {
        id: 3,
        text: "Very nice fit and drape. Extremely comfortable to wear all day long.",
        name: "AISHA RAHIL",
        title: "ABEER MUSE"
    }
];

const Testimonial = () => {
    return (
        <section className="testimonial-section">
            <div className="container">
                <Titles subTitle={'Love from Our Muses'} title={'The Abeer Voice'} />

                <div className="testimonial-slider-wrapper">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            el: '.testimonial-pagination',
                            bulletClass: 'reels-swiperBullet',
                            bulletActiveClass: 'reels-swiperBulletActive'
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 1,
                            },
                            1024: {
                                slidesPerView: 2,
                            },
                            1440: {
                                slidesPerView: 3,
                            }
                        }}
                    >
                        {testimonialsData.map((item) => (
                            <SwiperSlide key={item.id} style={{ height: 'auto' }}>
                                <div className="testimonial-card">
                                    <div className="testimonial-inner">
                                        <div className="quote-icon"><VscQuote /></div>
                                        <div className="stars">
                                            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                        </div>
                                        <p className="test-text">{item.text}</p>
                                        <div className="test-divider"><BsFlower2 /></div>
                                        <h4 className="test-name">{item.name}</h4>
                                        <span className="test-title">{item.title}</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="testimonial-pagination"></div>
                </div>
            </div>
        </section>
    )
}

export default Testimonial;