import React from 'react';
import CollabButtons from '../CollabButtons';

const Step1 = ({ formData, handleInputChange, nextStep }) => {
    return (
        <form className="collab-card" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <h2 className="collab-step-title">Brand Details</h2>
            <div className="auth-form-collab">
                <div className="form-group-collab">
                    <label>Brand Name *</label>
                    <input type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} placeholder="e.g. Abeer Label" required />
                </div>
                <div className="form-group-collab">
                    <label>Website</label>
                    <input type="text" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://" required />
                </div>
                <div className="form-grid">
                    <div className="form-group-collab">
                        <label>Contact Name</label>
                        <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} placeholder="Your full name" required />
                    </div>
                    <div className="form-group-collab">
                        <label>Your Role</label>
                        <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g. Marketing Manager" required />
                    </div>
                </div>
                <div className="form-group-collab">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1234 567 8900" required />
                </div>
            </div>
            <CollabButtons prevStep={null} />
        </form>
    )
}

export default Step1;