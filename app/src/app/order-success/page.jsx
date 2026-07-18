"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import TopHeader from "@/components/pages/TopHeader";
import useOrderStore from "@/store/orderStore";

const OrderSuccessPage = () => {
    const router = useRouter();
    const { currentOrder, clearOrderState } = useOrderStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Clean up order state on unmount
    useEffect(() => {
        return () => {
            clearOrderState();
        };
    }, [clearOrderState]);

    if (!isHydrated) {
        return null;
    }

    const orderNumber = currentOrder?.orderNumber || "ABL-" + Math.floor(10000000 + Math.random() * 90000000);
    const totalAmount = currentOrder?.totalAmount || 0;
    const shippingAddress = currentOrder?.shippingAddress || {};

    return (
        <div className="pages">
            <TopHeader
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Checkout", href: "/checkout" },
                    { label: "Success", href: null },
                ]}
            />
            <div className="shop-page-wrapper">
                <div className="container">
                    <div className="success-card">
                        <IoCheckmarkCircleOutline className="success-icon" />
                        <h2 className="success-title">
                            ORDER PLACED SUCCESSFULLY!
                        </h2>
                        <p className="success-message">
                            Thank you for shopping with Abeer Label. Your order has been registered and is being processed.
                        </p>

                        <div className="order-details-box">
                            <div className="order-detail-row">
                                <span className="order-detail-label">Order Number:</span>
                                <span className="order-detail-value">{orderNumber}</span>
                            </div>
                            <div className="order-detail-row">
                                <span className="order-detail-label">Payment Method:</span>
                                <span className="order-detail-value">Cash on Delivery (COD)</span>
                            </div>
                            {totalAmount > 0 && (
                                <div className="order-detail-total">
                                    <span className="order-detail-label">Total Paid:</span>
                                    <span className="order-detail-value">₹{totalAmount.toLocaleString("en-IN")}</span>
                                </div>
                            )}
                            {shippingAddress.fullName && (
                                <div className="delivery-info">
                                    <strong className="delivery-title">Delivery To:</strong><br />
                                    {shippingAddress.fullName}<br />
                                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}<br />
                                    Phone: {shippingAddress.phone}
                                </div>
                            )}
                        </div>

                        <div className="success-actions">
                            <button
                                className="button-primary success-btn"
                                onClick={() => router.push("/shop")}
                            >
                                CONTINUE SHOPPING
                            </button>
                            <button
                                className="button-outline"
                                onClick={() => router.push("/")}
                            >
                                BACK TO HOME
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;