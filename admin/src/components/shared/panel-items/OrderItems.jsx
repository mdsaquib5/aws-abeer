const OrderItems = ({ item }) => {
    return (
        <div className="activity-item">
            <div className="activity-main">
                <span className="activity-primary">{item.id}</span>
                <span className="activity-secondary">{item.item}</span>
            </div>
            <div className="activity-meta">
                <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                <span className="activity-price">₹{item.price}</span>
            </div>
        </div>
    )
}

export default OrderItems;
