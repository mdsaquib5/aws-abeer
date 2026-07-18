const StoryItems = ({ item }) => {
    return (
        <div className="activity-item">
            <div className="activity-main">
                <span className="activity-primary">{item.title}</span>
                <span className="activity-secondary">{item.date}</span>
            </div>
            <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
        </div>
    )
}

export default StoryItems;