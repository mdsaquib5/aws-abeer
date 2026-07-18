import React from 'react';
import CollabButtons from '../CollabButtons';

const Step3 = ({ formData, handleInputChange, prevStep, nextStep }) => {
    return (
        <form className="collab-card" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <h2 className="collab-step-title">Campaign Details</h2>

            <div className="auth-form">
                <div className="form-grid">
                    <div className="form-group-collab">
                        <label>Estimated Budget *</label>
                        <select name="budget" value={formData.budget} onChange={handleInputChange} required>
                            <option value="">Select budget range</option>
                            <option value="Under $500">Under $500</option>
                            <option value="$500 - $1,000">$500 - $1,000</option>
                            <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                            <option value="$5,000+">$5,000+</option>
                        </select>
                    </div>
                    <div className="form-group-collab">
                        <label>Timeline *</label>
                        <select name="timeline" value={formData.timeline} onChange={handleInputChange} required>
                            <option value="">Select timeline</option>
                            <option value="ASAP">ASAP</option>
                            <option value="2-4 weeks">2-4 weeks</option>
                            <option value="1-3 months">1-3 months</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>
                </div>
                <div className="form-group-collab">
                    <label>Campaign Goals *</label>
                    <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        placeholder="Describe what you want to achieve with this collaboration..."
                        rows="8" cols={10}
                        required
                    ></textarea>
                </div>
            </div>
            <CollabButtons prevStep={prevStep} />
        </form>
    );
}

export default Step3;