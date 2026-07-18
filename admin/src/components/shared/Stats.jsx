const Stats = ({ item }) => {
    return (
        <div className="stat-card">
            <div>
                <div className="icon">{item.icon}</div>
                <div className="stats-details">
                    <div className="stats-title">{item.title}</div>
                    <div className="stat-number">
                        {item.numberIcon && <span className="number-icon">{item.numberIcon}</span>}
                        {item.number}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats;