import DashboardTitles from "@/components/layout/DashboardTitles";
import ActiveItems from "@/components/shared/panel-items/ActiveItems";
import Link from "next/link";

const CollabPanel = () => {
    const recentLeads = [
        { name: "Aisha Khan", email: "aisha@example.com", source: "Instagram" },
        { name: "Rohan Sharma", email: "rohan.sharma@gmail.com", source: "Website" },
        { name: "Priya Singh", email: "priya.design@yahoo.com", source: "Instagram" },
        { name: "Ananya Patel", email: "ananya.creates@outlook.com", source: "Facebook" },
        { name: "Karan Mehta", email: "karan_m@example.com", source: "Twitter" },
    ];

    return (
        <div className="glass-panel">
            <div className="stats-header">
                <DashboardTitles title="Collaborators" />
                <Link href={'/dashboard/collaborations'} className="stats-btn">view all</Link>
            </div>
            <div className="activity-list">
                {recentLeads.map((item, index) => (
                    <ActiveItems key={index} item={item} />
                ))}
            </div>
        </div>
    )
}

export default CollabPanel;