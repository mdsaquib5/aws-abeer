import React from 'react';
import { FiAward, FiFeather, FiScissors, FiGlobe } from 'react-icons/fi';
import ServiceCard from '../shared/ServiceCard';

const servicesData = [
    {
        id: 1,
        icon: <FiAward size={26} />,
        title: "Handcrafted Heritage",
        description: "Consciously made in small batches by local Indian artisans."
    },
    {
        id: 2,
        icon: <FiFeather size={26} />,
        title: "Breathable Luxury",
        description: "Crafted in natural, skin-friendly cotton-silk & mulmul."
    },
    {
        id: 3,
        icon: <FiScissors size={26} />,
        title: "Bespoke Fit",
        description: "Made-to-measure custom adjustments & easy exchanges."
    },
    {
        id: 4,
        icon: <FiGlobe size={26} />,
        title: "Global Shipping",
        description: "Connecting modern Indian roots to muses worldwide."
    }
];

const Services = () => {
    return (
        <section className="services-bg">
            <div className="container">
                <div className="services-grid">
                    {servicesData.map((service) => (
                        <ServiceCard
                            key={service.id}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;