'use client';

import React, { useRef, useState } from 'react';
import { IoVolumeMuteOutline, IoVolumeHighOutline, IoPlayOutline, IoPauseOutline } from 'react-icons/io5';

const ReelCard = ({ reel }) => {
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

    const posterSrc = reel.videoSrc.replace('.mp4', '.jpg');

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

export default ReelCard;