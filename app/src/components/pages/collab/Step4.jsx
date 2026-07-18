import React from 'react';

const Step4 = ({ formData, prevStep }) => {
    return (
        <div className="collab-card">
            <h2 className="collab-step-title">Review Pitch</h2>

            <div className="collab-review-block">
                <h3 className="collab-review-title">Brand & Contact</h3>
                <div className="collab-review-item"><span className="collab-review-label">Brand</span><span className="collab-review-value">{formData.brandName || '-'}</span></div>
                <div className="collab-review-item"><span className="collab-review-label">Website</span><span className="collab-review-value">{formData.website || '-'}</span></div>
                <div className="collab-review-item"><span className="collab-review-label">Contact</span><span className="collab-review-value">{formData.contactName} - {formData.role}</span></div>
                <div className="collab-review-item"><span className="collab-review-label">Phone</span><span className="collab-review-value">{formData.phone || '-'}</span></div>
            </div>

            <div className="collab-review-block">
                <h3 className="collab-review-title">Collaboration</h3>
                <div className="collab-review-item"><span className="collab-review-label">Collab Types</span><span className="collab-review-value">{formData.types.join(', ') || '-'}</span></div>
                <div className="collab-review-item"><span className="collab-review-label">Niches</span><span className="collab-review-value">{formData.niches.join(', ') || '-'}</span></div>
            </div>

            <div className="collab-review-block">
                <h3 className="collab-review-title">Campaign</h3>
                <div className="collab-review-item"><span className="collab-review-label">Budget</span><span className="collab-review-value">{formData.budget || '-'}</span></div>
                <div className="collab-review-item"><span className="collab-review-label">Timeline</span><span className="collab-review-value">{formData.timeline || '-'}</span></div>
                <div className="collab-review-item"><span className="collab-review-label">Goals</span><span className="collab-review-value">{formData.goals || '-'}</span></div>
            </div>

            <div className="collab-btns">
                <div className="btn secondary-btn" onClick={prevStep} >
                    Back
                </div>
                <button className="btn primary-btn">Submit Pitch</button>
            </div>
        </div>
    );
}

export default Step4;