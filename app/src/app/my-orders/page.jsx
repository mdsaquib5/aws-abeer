"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoBagHandleOutline, IoLockClosedOutline } from "react-icons/io5";
import { FiChevronRight, FiAlertTriangle, FiChevronDown, FiCheck } from "react-icons/fi";
import useAuthStore from "@/store/authStore";
import useOrderStore from "@/store/orderStore";
import TopHeader from "@/components/pages/TopHeader";
import "./orders.css";

const STATUS_STEPS = ["Placed", "Confirmed", "Packing", "Shipped", "Delivered"];

const MyOrdersPage = () => {
    const router = useRouter();
    const { isAuthenticated, fetchMe, isLoading: authLoading } = useAuthStore();
    const { orders, isLoading: ordersLoading, loadMyOrders, error } = useOrderStore();
    const [isHydrated, setIsHydrated] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState({});

    const toggleExpand = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    useEffect(() => {
        setIsHydrated(true);
        fetchMe();
    }, [fetchMe]);

    useEffect(() => {
        if (isHydrated && isAuthenticated) {
            loadMyOrders();
        }
    }, [isHydrated, isAuthenticated, loadMyOrders]);

    useEffect(() => {
        document.title = "My Orders | ABEER.LABEL";
    }, []);

    if (!isHydrated || authLoading) {
        return (
            <div className="pages my-orders-wrapper">
                <TopHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Orders", href: null }]} />
                <div className="shop-page-wrapper">
                    <div className="container">
                        <div className="my-orders-skeleton-card"></div>
                        <div className="my-orders-skeleton-card"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="pages my-orders-wrapper">
                <TopHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Orders", href: null }]} />
                <div className="shop-page-wrapper">
                    <div className="container">
                        <div className="my-orders-login-required">
                            <IoLockClosedOutline className="my-orders-login-icon" />
                            <h2 className="my-orders-login-title">LOGIN REQUIRED</h2>
                            <p className="my-orders-login-text">
                                Please login to your account to view your complete order history, track shipments, and manage details.
                            </p>
                            <button
                                className="button-primary"
                                onClick={() => router.push("/login?redirect=/my-orders")}
                                style={{ paddingInline: "32px" }}
                            >
                                SIGN IN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pages my-orders-wrapper">
            <TopHeader breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Orders", href: null }]} />
            <div className="shop-page-wrapper">
                <div className="container">
                    <div className="my-orders-title-section">
                        <h1 className="my-orders-title">MY ORDERS</h1>
                        <p className="my-orders-subtitle">Track status and view details of your past purchases</p>
                    </div>

                    {ordersLoading ? (
                        <div className="my-orders-list">
                            {[1, 2].map((n) => (
                                <div key={n} className="my-orders-skeleton-card"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="my-orders-list">
                            <div className="my-orders-empty" style={{ borderColor: "#fee2e2" }}>
                                <FiAlertTriangle className="my-orders-empty-icon" style={{ color: "#dc2626" }} />
                                <h3 className="my-orders-empty-title" style={{ color: "#dc2626" }}>Error Fetching Orders</h3>
                                <p className="my-orders-empty-text">{error}</p>
                                <button className="button-primary" onClick={() => loadMyOrders()}>
                                    RETRY
                                </button>
                            </div>
                        </div>
                    ) : orders && orders.length > 0 ? (
                        <div className="my-orders-list">
                            {orders.map((order) => {
                                const isCancelled = order.orderStatus === "Cancelled";
                                const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

                                // Find tracker width percentage
                                let progressWidth = 0;
                                if (currentStepIndex > 0) {
                                    progressWidth = (currentStepIndex / (STATUS_STEPS.length - 1)) * 100;
                                }

                                const dateFormatted = new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                });

                                return (
                                    <div className="my-orders-card" key={order._id}>
                                        {/* Card Header */}
                                        <div className="my-orders-card-header">
                                            <div className="my-orders-info-group">
                                                <div className="my-orders-info-item">
                                                    ORDER PLACED
                                                    <strong>{dateFormatted}</strong>
                                                </div>
                                                <div className="my-orders-info-item">
                                                    TOTAL AMOUNT
                                                    <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                                                </div>
                                                <div className="my-orders-info-item">
                                                    ORDER NUMBER
                                                    <strong>{order.orderNumber}</strong>
                                                </div>
                                                <div className="my-orders-info-item">
                                                    PAYMENT METHOD
                                                    <strong>{order.paymentMethod || "COD"}</strong>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`my-orders-status-badge my-orders-status-${order.orderStatus.toLowerCase()}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="my-orders-card-body">
                                            {/* Step Tracker (Skip if Cancelled) */}
                                            {!isCancelled && (
                                                <div className="my-orders-tracker-wrapper">
                                                    <div className="my-orders-tracker">
                                                        <div className="my-orders-tracker-line-container">
                                                            <div className="my-orders-tracker-bg-line"></div>
                                                            <div
                                                                className="my-orders-tracker-progress-line"
                                                                style={{ width: `${progressWidth}%` }}
                                                            ></div>
                                                        </div>
                                                        {STATUS_STEPS.map((step, idx) => {
                                                            let stepClass = "";
                                                            if (idx < currentStepIndex) {
                                                                stepClass = "completed";
                                                            } else if (idx === currentStepIndex) {
                                                                stepClass = "active";
                                                            }

                                                            return (
                                                                <div className={`my-orders-tracker-step ${stepClass}`} key={step}>
                                                                    <div className="my-orders-tracker-dot">
                                                                        {idx < currentStepIndex ? (
                                                                            <FiCheck style={{ fontSize: "0.95rem" }} />
                                                                        ) : (
                                                                            idx + 1
                                                                        )}
                                                                    </div>
                                                                    <span className="my-orders-tracker-label">{step}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {isCancelled && (
                                                <div style={{ background: "#fee2e2", padding: "12px 18px", borderRadius: "8px", color: "#dc2626", fontFamily: "var(--font-outfit)", fontSize: "0.88rem", marginBottom: "24px" }}>
                                                    <strong>Order Cancelled:</strong> This order was cancelled and will not be processed further. If this was a mistake, please contact customer support.
                                                </div>
                                            )}

                                            {/* Items List */}
                                            <div className="my-orders-items-list">
                                                {order.items.map((item, index) => (
                                                    <div className="my-orders-item-row" key={`${order._id}-item-${index}`}>
                                                        <div className="my-orders-item-image">
                                                            {item.image && (
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fill
                                                                    style={{ objectFit: "cover" }}
                                                                    sizes="65px"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="my-orders-item-details">
                                                            <h4 className="my-orders-item-name">{item.name}</h4>
                                                            <div className="my-orders-item-meta">
                                                                {item.size && <span>Size: {item.size}</span>}
                                                                <span>Quantity: {item.quantity}</span>
                                                            </div>
                                                        </div>
                                                        <div className="my-orders-item-price">
                                                            ₹{item.price.toLocaleString("en-IN")}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Toggle Button */}
                                            <div className="my-orders-actions">
                                                <button
                                                    className={`my-orders-expand-btn ${expandedOrders[order._id] ? "expanded" : ""}`}
                                                    onClick={() => toggleExpand(order._id)}
                                                >
                                                    {expandedOrders[order._id] ? "Hide Order Details" : "View Order Details"}
                                                    <FiChevronDown />
                                                </button>
                                            </div>

                                            {/* Expandable Info / Address & Cost Invoice Summary */}
                                            <div className={`my-orders-details-wrapper ${expandedOrders[order._id] ? "expanded" : ""}`}>
                                                <div className="my-orders-details-grid">
                                                    <div className="my-orders-shipping-section">
                                                        <h5 className="my-orders-shipping-title">SHIPPING ADDRESS</h5>
                                                        <strong>{order.shippingAddress.fullName}</strong>
                                                        <p style={{ margin: "4px 0" }}>
                                                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                        </p>
                                                        <p style={{ margin: 0 }}>Phone: {order.shippingAddress.phone}</p>
                                                        <p style={{ margin: 0 }}>Email: {order.shippingAddress.email}</p>
                                                    </div>

                                                    <div className="my-orders-summary-section">
                                                        <div className="my-orders-summary-row">
                                                            <span>Subtotal</span>
                                                            <span>₹{order.subtotal?.toLocaleString("en-IN") || "0"}</span>
                                                        </div>
                                                        <div className="my-orders-summary-row">
                                                            <span>Shipping Charge</span>
                                                            <span>
                                                                {order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge}`}
                                                            </span>
                                                        </div>
                                                        <div className="my-orders-summary-row total">
                                                            <span>Total Amount</span>
                                                            <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="my-orders-empty">
                            <IoBagHandleOutline className="my-orders-empty-icon" />
                            <h3 className="my-orders-empty-title">NO ORDERS FOUND</h3>
                            <p className="my-orders-empty-text">You haven't placed any orders yet. Visit our collections to find your style.</p>
                            <button className="button-primary" onClick={() => router.push("/shop")}>
                                START SHOPPING
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
