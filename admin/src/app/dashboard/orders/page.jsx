"use client";

import React from "react";
import Image from "next/image";
import DashboardTitles from "@/components/layout/DashboardTitles";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";
import { RxCross2 } from "react-icons/rx";
import useOrdersDashboard, { STATUS_STEPS, DROPDOWN_STATUSES, FILTERS } from "@/hooks/useOrdersDashboard";

export default function OrdersPage() {
    const {
        activeFilter,
        setActiveFilter,
        searchTerm,
        setSearchTerm,
        selectedOrder,
        setSelectedOrder,
        popupStatus,
        setPopupStatus,
        orders,
        isLoading,
        filteredOrders,
        openDetails,
        closeDetails,
        handlePopupUpdate,
        changeOrderStatus
    } = useOrdersDashboard();

    return (
        <div className="dashboard-page">
            <DashboardTitles title="Customer Orders" subtitle="Sales • Order Management" />
            <div className="dashboard-wrapper">

                {/* Top Bar */}
                <div className="orders-top-bar">
                    <Searchbar
                        placeholder="Search by ID, product, customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="order-filters">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                className={`filter-btn ${activeFilter === f ? "active" : ""}`}
                                onClick={() => setActiveFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders Table */}
                <div className="orders-table-wrapper glass-panel" style={{ padding: 0 }}>
                    {isLoading && orders.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                            Loading customer orders...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                            No orders found matching the criteria.
                        </div>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Customer</th>
                                    <th>Sizes / Qty</th>
                                    <th>Payment</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const firstItem = order.items?.[0] || {};
                                    const name = firstItem.name || "N/A";
                                    const image = firstItem.image || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=100&auto=format&fit=crop";
                                    const sizes = order.items?.map(i => i.size).filter(Boolean).join(", ") || "N/A";
                                    const totalQty = order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
                                    const date = new Date(order.createdAt).toLocaleDateString("en-IN");

                                    return (
                                        <tr key={order._id}>
                                            <td className="order-id">{order.orderNumber}</td>
                                            <td>
                                                <div className="order-product">
                                                    <Image src={image} alt={name} className="order-product-img" width={40} height={40} style={{ objectFit: 'cover' }} />
                                                    <span>
                                                        {name} {order.items?.length > 1 && `+ ${order.items.length - 1} more`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="order-customer">
                                                    <span className="customer-name">{order.shippingAddress?.fullName || order.user?.name}</span>
                                                    <span className="customer-email">{order.shippingAddress?.email || order.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="order-size">
                                                <span className="size-badge">{sizes}</span>
                                                <span className="qty-text">× {totalQty}</span>
                                            </td>
                                            <td>
                                                <div className="order-payment">
                                                    <span className="payment-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                                    <span className={`payment-status ${order.paymentStatus?.toLowerCase()}`}>{order.paymentStatus}</span>
                                                </div>
                                            </td>
                                            <td className="order-date">{date}</td>
                                            <td>
                                                <select
                                                    className={`status-select ${order.orderStatus?.toLowerCase()}`}
                                                    value={order.orderStatus}
                                                    onChange={(e) => changeOrderStatus(order._id, e.target.value)}
                                                >
                                                    {DROPDOWN_STATUSES.map(s => (
                                                        <option key={s} value={s}>{s.toUpperCase()}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button className="details-btn" onClick={() => openDetails(order)}>
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    <Pagination />
                </div>

            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={closeDetails}>
                    <div className="order-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Order {selectedOrder.orderNumber}</h2>
                            <button className="modal-close" onClick={closeDetails}><RxCross2 /></button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-grid">
                                {/* Product List */}
                                <div className="modal-section" style={{ gridColumn: "1 / -1" }}>
                                    <div className="modal-section-label">Product(s)</div>
                                    <div style={{ maxHeight: "200px", overflowY: "auto", paddingRight: "8px" }}>
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="modal-product-row" style={{ display: "flex", gap: "16px", marginBottom: "16px", borderBottom: idx < selectedOrder.items.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", paddingBottom: "12px" }}>
                                                <Image src={item.image || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=100&auto=format&fit=crop"} alt={item.name} className="modal-product-img" width={60} height={60} style={{ objectFit: 'cover' }} />
                                                <div>
                                                    <div className="modal-product-name">{item.name}</div>
                                                    <div className="modal-product-meta">Size: {item.size || "N/A"} · Qty: {item.quantity} · Price: ₹{item.price?.toLocaleString('en-IN')}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customer Address */}
                                <div className="modal-section">
                                    <div className="modal-section-label">Shipping Details</div>
                                    <div className="modal-customer-name">{selectedOrder.shippingAddress?.fullName}</div>
                                    <div className="modal-customer-meta">{selectedOrder.shippingAddress?.email}</div>
                                    <div className="modal-customer-meta">{selectedOrder.shippingAddress?.phone}</div>
                                    <div className="modal-customer-meta" style={{ marginTop: "8px", fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
                                        {selectedOrder.shippingAddress?.address},<br />
                                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                    </div>
                                </div>

                                {/* Payment details */}
                                <div className="modal-section">
                                    <div className="modal-section-label">Payment Information</div>
                                    <div className="modal-payment-amount">₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</div>
                                    <div className="modal-customer-meta">Method: {selectedOrder.paymentMethod}</div>
                                    <div className="modal-customer-meta" style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                                        Subtotal: ₹{selectedOrder.subtotal?.toLocaleString('en-IN')}<br />
                                        Shipping: ₹{selectedOrder.shippingCharge?.toLocaleString('en-IN')}
                                    </div>
                                    <span className={`payment-status ${selectedOrder.paymentStatus?.toLowerCase()}`} style={{ marginTop: "8px", display: "inline-block" }}>
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>

                                {/* Order Date */}
                                <div className="modal-section">
                                    <div className="modal-section-label">Order Details</div>
                                    <div className="modal-customer-name" style={{ fontSize: "13px" }}>
                                        Placed On: {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            {/* Status Tracker */}
                            <div className="status-tracker">
                                <div className="modal-section-label" style={{ marginBottom: "16px" }}>Status Tracker</div>
                                {selectedOrder.orderStatus === "Cancelled" ? (
                                    <div style={{ color: "#d9534f", fontWeight: "600", fontSize: "14px", padding: "8px 12px", background: "#fdf7f7", border: "1px solid #ebccd1", borderRadius: "4px", display: "inline-block" }}>
                                        THIS ORDER HAS BEEN CANCELLED
                                    </div>
                                ) : (
                                    <div className="tracker-steps">
                                        {STATUS_STEPS.map((step, idx) => {
                                            const currentIdx = STATUS_STEPS.findIndex(s => s === selectedOrder.orderStatus);
                                            const isDone = idx <= currentIdx;
                                            return (
                                                <div key={step} className="tracker-step">
                                                    <div className={`tracker-dot ${isDone ? "done" : ""}`}>
                                                        {isDone && <span className="tracker-inner" />}
                                                    </div>
                                                    {idx < STATUS_STEPS.length - 1 && (
                                                        <div className={`tracker-line ${idx < currentIdx ? "done" : ""}`} />
                                                    )}
                                                    <div className={`tracker-label ${isDone ? "done" : ""}`}>{step.toUpperCase()}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="modal-footer">
                                <span className="modal-footer-label">Update Status:</span>
                                <select
                                    className={`status-select ${popupStatus?.toLowerCase()}`}
                                    value={popupStatus}
                                    onChange={(e) => setPopupStatus(e.target.value)}
                                >
                                    {DROPDOWN_STATUSES.map(s => (
                                        <option key={s} value={s}>{s.toUpperCase()}</option>
                                    ))}
                                </select>
                                <button className="details-btn" onClick={handlePopupUpdate}>Update</button>
                                <button className="modal-close-btn" onClick={closeDetails}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
