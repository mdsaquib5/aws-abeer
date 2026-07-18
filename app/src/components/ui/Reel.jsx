'use client';

import React, { useRef, useState } from 'react';
import { IoVolumeMuteOutline, IoVolumeHighOutline, IoPlayOutline, IoPauseOutline } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SectionTitle from '../ui/SectionTitle';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ReelCard({ reel }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(err => console.log('Video play interrupted:', err));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const posterSrc = reel.videoSrc ? reel.videoSrc.replace('.mp4', '.jpg') : undefined;

    return (
        <div className="reels-card" onClick={togglePlay}>
            <video
                ref={videoRef}
                src={reel.videoSrc}
                className="reels-video"
                loop
                muted={isMuted}
                autoPlay
                playsInline
                preload="metadata"
                poster={posterSrc}
            />

            <div className="reels-overlay">
                <div className="reels-meta">
                    <span className="reels-subtitle">{reel.subtitle}</span>
                    <h3 className="reels-title">{reel.title}</h3>
                </div>

                <div className="reels-controls">
                    <button className="reels-controlBtn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} style={{ display: 'none' }}>
                        {isMuted ? <IoVolumeMuteOutline /> : <IoVolumeHighOutline />}
                    </button>
                    <div className="reels-playStateIcon">
                        {isPlaying ? <IoPauseOutline /> : <IoPlayOutline />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReelsSection() {
    return (
        <section className="reels-section">
            <div className="container">
                <SectionTitle
                    title="The Abeer Muse"
                    subtitle="Wear Your Soul in Motion"
                />

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
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        className="reels-swiperContainer"
                    >
                        {reelsData.map((reel) => (
                            <SwiperSlide key={reel.id} className="reels-swiperSlide">
                                <ReelCard reel={reel} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Editorial Slider Navigation Controls */}
                    <button className={`reels-swiperButtonPrev reels-navArrow`} aria-label="Previous slide">
                        <span>←</span>
                    </button>
                    <button className={`reels-swiperButtonNext reels-navArrow`} aria-label="Next slide">
                        <span>→</span>
                    </button>

                    {/* Pagination container */}
                    <div className="reels-swiperPagination"></div>
                </div>
            </div>
        </section>
    );
}