import Link from "next/link";

const ActiveItems = ({ item }) => {
    return (
        <div className="activity-item">
            <div className="activity-main">
                <span className="activity-primary">{item.name}</span>
                <Link href={`mailto:${item.email}`} className="activity-secondary">{item.email}</Link>
            </div>
            <Link href={`#`} className="badge-source">{item.source}</Link>
        </div>
    )
}

export default ActiveItems;