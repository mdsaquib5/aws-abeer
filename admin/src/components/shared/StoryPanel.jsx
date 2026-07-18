import DashboardTitles from "@/components/layout/DashboardTitles";
import StoryItems from "@/components/shared/panel-items/StoryItems";
import Link from "next/link";

const StoryPanel = ({ blogs = [] }) => {
    return (
        <div className="glass-panel">
            <div className="stats-header">
                <DashboardTitles title="Recent Story" />
                <Link href={'/dashboard/blogs'} className="stats-btn">view all</Link>
            </div>
            <div className="activity-list">
                {blogs.length === 0 ? (
                    <div style={{ padding: "20px", color: "#888", textAlign: "center", fontSize: "14px" }}>No recent stories</div>
                ) : blogs.map((blog, index) => (
                    <StoryItems key={blog._id || index} item={{
                        title: blog.title,
                        status: blog.status,
                        date: new Date(blog.createdAt).toLocaleDateString()
                    }} />
                ))}
            </div>
        </div>
    )
}

export default StoryPanel;
