import React from 'react';

const ServiceCard = ({ icon, title, description }) => {
    return (
        <div className="service-card">
            <div className="service-icon-wrapper">
                {icon}
            </div>
            <h4 className="service-title">{title}</h4>
            <p className="service-desc">{description}</p>
        </div>
    );
};

export default ServiceCard;