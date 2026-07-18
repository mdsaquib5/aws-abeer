const CollabButtons = ({ prevStep }) => {
    return (
        <div className="collab-btns">
            {prevStep && (
                <div className="btn secondary-btn" onClick={prevStep}>
                    Back
                </div>
            )}
            <button type="submit" className="btn primary-btn">Next</button>
        </div>
    )
}

export default CollabButtons;