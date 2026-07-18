"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
    {
        id: 1,
        image: 'https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/2_hkflkm.webp',
        objectPosition: '100% 70%',
        tagline: 'Abeer.Label',
        mainHeading: 'Modern Desi Muse',
        title: 'The Poetic Geet Kurta Set',
        description: 'Embrace the melody of slow fashion with the Geet Kurta. Handcrafted with love for the modern desi muse who seeks quiet luxury.'
    },
    {
        id: 2,
        image: 'https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/14_wvgybs.webp',
        objectPosition: '100% 50%',
        tagline: 'Abeer.Label',
        mainHeading: 'Timeless Elegance',
        title: 'The Handcrafted Hania Silhouette',
        description: 'Step into effortless grace. The Hania Kurta brings together nostalgic charm and contemporary minimalism for a truly premium experience.'
    },
    {
        id: 3,
        image: 'https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/5_ij2rmc.webp',
        objectPosition: '100% 70%',
        tagline: 'Abeer.Label',
        mainHeading: 'Artistry In Motion',
        title: 'The Exclusive Qala Ethnic Edit',
        description: 'Wear your soul with Qala. A masterpiece of traditional craftsmanship designed for the woman who appreciates the finer details of slow fashion.'
    },
    {
        id: 4,
        image: 'https://pub-cb079d032bb540259b2f627128c60f40.r2.dev/static%20media/3_oyvmjr.webp',
        objectPosition: '100% 80%',
        tagline: 'Abeer.Label',
        mainHeading: 'Radiant Luxury',
        title: 'The Luminous Noor Set',
        description: 'Illuminate your wardrobe with the Noor Kurta. Soft feminine luxury defined by exquisite handwork and premium, sustainable fabrics.'
    }
];

const Hero = () => {
    return (
        <div className="hero-bg">
            <Swiper
                modules={[EffectFade, Navigation, Pagination, Autoplay]}
                effect="fade"
                speed={1200}
                loop={true}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                allowTouchMove={true}
                pagination={{
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<div class="' + className + '"><span class="num">0' + (index + 1) + '</span><span class="line"></span></div>';
                    }
                }}
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {({ isActive }) => (
                            <div className={`hero-slider ${isActive ? 'is-active' : ''}`}>
                                <div className="hero-image">
                                    <div className="placeholder-image">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            sizes="(max-width: 576px) 100vw, 100vw"
                                            quality={70}
                                            style={{ objectFit: 'cover', objectPosition: slide.objectPosition }}
                                            priority={slide.id === 1 || slide.id === 2}
                                            fetchPriority={slide.id === 1 ? "high" : "auto"}
                                        />
                                    </div>
                                </div>
                                <div className="content-wrapper">
                                    <div className="content-container">
                                        <span className="hero-tagline">{slide.tagline}</span>
                                        <h1 className="hero-heading">{slide.mainHeading}</h1>
                                        <h2 className="hero-title">{slide.title}</h2>
                                        <p className="hero-para">{slide.description}</p>
                                        <div className="hero-btns">
                                            <Link href={'/shop'} className="primary-btn btn">Shop Now</Link>
                                            <Link href={'/shop'} className="secondary-btn btn">New Collection</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Hero;