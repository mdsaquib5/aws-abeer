import React from 'react';
import { IoWaterOutline, IoColorWandOutline, IoSnowOutline, IoBagHandleOutline } from 'react-icons/io5';

export const DescriptionTab = ({ product }) => (
    <div className="pd-tab-content-inner">
        <p>{product.description}</p>
        {product.fit && (
            <div className="pd-tab-details-list">
                <div className="pd-tab-detail-row"><span>Fit</span><span>{product.fit}</span></div>
                <div className="pd-tab-detail-row"><span>Print</span><span>{product.print}</span></div>
                <div className="pd-tab-detail-row"><span>Details</span><span>{product.details}</span></div>
            </div>
        )}
    </div>
);

export const CompositionTab = ({ product }) => (
    <div className="pd-tab-content-inner">
        <div className="pd-tab-details-list">
            <div className="pd-tab-detail-row"><span>Composition</span><span>{product.composition}</span></div>
            <div className="pd-tab-detail-row"><span>Lining</span><span>{product.lining}</span></div>
        </div>
    </div>
);

export const CareTab = ({ product }) => (
    <div className="pd-tab-content-inner">
        <p>{product.care}</p>
        <ul className="pd-care-list">
            <li><IoWaterOutline className="care-icon" /><span>Do not machine wash</span></li>
            <li><IoColorWandOutline className="care-icon" /><span>Iron on reverse side only</span></li>
            <li><IoSnowOutline className="care-icon" /><span>Store in a cool, dry place</span></li>
            <li><IoBagHandleOutline className="care-icon" /><span>Keep in the muslin bag provided</span></li>
        </ul>
    </div>
);

export const ShippingTab = () => (
    <div className="pd-tab-content-inner">
        <div className="pd-tab-details-list">
            <div className="pd-tab-detail-row"><span>Dispatch</span><span>Within 2–3 business days</span></div>
            <div className="pd-tab-detail-row"><span>Delivery</span><span>12–15 business days across India</span></div>
            <div className="pd-tab-detail-row"><span>Returns</span><span>No returns</span></div>
            <div className="pd-tab-detail-row"><span>Exchange</span><span>Size exchange available</span></div>
        </div>
    </div>
);
