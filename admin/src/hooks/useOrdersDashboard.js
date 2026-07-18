"use client";

import { useState, useEffect } from "react";
import useOrderStore from "@/store/orderStore";

export const STATUS_STEPS = ["Placed", "Confirmed", "Packing", "Shipped", "Delivered"];
export const DROPDOWN_STATUSES = ["Placed", "Confirmed", "Packing", "Shipped", "Delivered", "Cancelled"];
export const FILTERS = ["All Orders", "Placed", "Confirmed", "Packing", "Shipped", "Delivered", "Cancelled"];

export default function useOrdersDashboard() {
    const [activeFilter, setActiveFilter] = useState("All Orders");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [popupStatus, setPopupStatus] = useState("");

    const { orders, loadOrders, changeOrderStatus, isLoading } = useOrderStore();

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const filteredOrders = orders.filter(o => {
        // Filter by tab status
        if (activeFilter !== "All Orders" && o.orderStatus?.toLowerCase() !== activeFilter.toLowerCase()) {
            return false;
        }
        // Filter by search query
        if (searchTerm.trim() !== "") {
            const query = searchTerm.toLowerCase();
            const orderIdMatch = o.orderNumber?.toLowerCase().includes(query);
            const customerNameMatch = o.shippingAddress?.fullName?.toLowerCase().includes(query);
            const customerEmailMatch = o.shippingAddress?.email?.toLowerCase().includes(query);
            const productNameMatch = o.items?.some(item => item.name?.toLowerCase().includes(query));
            return orderIdMatch || customerNameMatch || customerEmailMatch || productNameMatch;
        }
        return true;
    });

    const openDetails = (order) => {
        setSelectedOrder(order);
        setPopupStatus(order.orderStatus);
    };

    const closeDetails = () => setSelectedOrder(null);

    const handlePopupUpdate = async () => {
        if (selectedOrder) {
            await changeOrderStatus(selectedOrder._id, popupStatus);
            setSelectedOrder(prev => ({ ...prev, orderStatus: popupStatus }));
        }
    };

    return {
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
    };
}
