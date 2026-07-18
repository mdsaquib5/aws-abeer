"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Step1 from './collab/Step1';
import Step2 from './collab/Step2';
import Step3 from './collab/Step3';
import Step4 from './collab/Step4';

const collabTypes = [
    "Sponsored Post", "Product Review", "Brand Ambassador",
    "Giveaway", "Event Coverage", "YouTube Integration",
    "Instagram Reel", "Long-term Partnership"
];

const brandNiches = [
    "Travel", "Lifestyle", "Aviation", "Fashion", "Luxury",
    "Beauty", "Wellness", "Food & Dining", "Tech & Gadgets", "Fitness"
];

const CollaborationSlider = () => {
    const [activeStep, setActiveStep] = useState(1);

    const [formData, setFormData] = useState({
        brandName: '',
        website: '',
        contactName: '',
        role: '',
        phone: '',
        types: [],
        niches: [],
        budget: '',
        timeline: '',
        goals: ''
    });

    const [swiperInstance, setSwiperInstance] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePill = (field, value) => {
        setFormData(prev => {
            const currentList = prev[field];
            if (currentList.includes(value)) {
                return { ...prev, [field]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...currentList, value] };
            }
        });
    };

    const nextStep = () => {
        if (swiperInstance && activeStep < 4) {
            swiperInstance.slideNext();
        }
    };

    const prevStep = () => {
        if (swiperInstance && activeStep > 1) {
            swiperInstance.slidePrev();
        }
    };



    return (
        <div className="collab-slider-wrapper">
            <div className="collab-line-container">
            </div>
            <div style={{ position: 'relative', zIndex: 3, overflow: 'hidden', paddingBottom: '20px', width: '100%' }}>
                <Swiper
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => setActiveStep(swiper.activeIndex + 1)}
                    allowTouchMove={true}
                    autoHeight={true}
                    spaceBetween={30}
                    slidesPerView={'auto'}
                    centeredSlides={true}
                    className="collab-swiper"
                >
                    <SwiperSlide><Step1 formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} /></SwiperSlide>
                    <SwiperSlide><Step2 formData={formData} togglePill={togglePill} prevStep={prevStep} nextStep={nextStep} collabTypes={collabTypes} brandNiches={brandNiches} /></SwiperSlide>
                    <SwiperSlide><Step3 formData={formData} handleInputChange={handleInputChange} prevStep={prevStep} nextStep={nextStep} /></SwiperSlide>
                    <SwiperSlide><Step4 formData={formData} prevStep={prevStep} /></SwiperSlide>
                </Swiper>
            </div>

        </div>
    );
};

export default CollaborationSlider;
