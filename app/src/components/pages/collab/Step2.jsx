import React from 'react';
import CollabButtons from '../CollabButtons';

const Step2 = ({ formData, togglePill, prevStep, nextStep, collabTypes, brandNiches }) => {
    return (
        <form className="collab-card" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <h2 className="collab-step-title">Collaboration Type</h2>

            <div className="form-group-collab" style={{ marginBottom: '40px' }}>
                <label style={{ marginBottom: '20px' }}>Collaboration Types *</label>
                <div className="collab-pills-group">
                    {collabTypes.map(type => (
                        <div
                            key={type}
                            className={`collab-pill ${formData.types.includes(type) ? 'active' : ''}`}
                            onClick={() => togglePill('types', type)}
                        >
                            {type}
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group-collab">
                <label style={{ marginBottom: '20px' }}>Brand Niches *</label>
                <div className="collab-pills-group">
                    {brandNiches.map(niche => (
                        <div
                            key={niche}
                            className={`collab-pill ${formData.niches.includes(niche) ? 'active' : ''}`}
                            onClick={() => togglePill('niches', niche)}
                        >
                            {niche}
                        </div>
                    ))}
                </div>
            </div>
            <CollabButtons prevStep={prevStep} />
        </form>
    );
}

export default Step2;