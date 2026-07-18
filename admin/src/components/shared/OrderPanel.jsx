import DashboardTitles from "@/components/layout/DashboardTitles";
import OrderItems from "@/components/shared/panel-items/OrderItems";
import Link from "next/link";

const OrderPanel = ({ orders = [] }) => {
    return (
        <div className="glass-panel">
            <div className="stats-header">
                <DashboardTitles title="Orders" />
                <Link href={'/dashboard/orders'} className="stats-btn">view all</Link>
            </div>
            <div className="activity-list">
                {orders.length === 0 ? (
                    <div style={{ padding: "20px", color: "#888", textAlign: "center", fontSize: "14px" }}>No recent orders</div>
                ) : orders.map((order, index) => (
                    <OrderItems key={order._id || index} item={{
                        id: order.orderNumber,
                        item: order.items?.[0]?.name || "N/A",
                        status: order.orderStatus,
                        price: order.totalAmount?.toLocaleString() || "0"
                    }} />
                ))}
            </div>
        </div>
    )
}

export default OrderPanel;