"use client";

import { useEffect, useState } from "react";
import DashboardTitles from "@/components/layout/DashboardTitles";
import Stats from "@/components/shared/Stats";
import { BsBoxSeam, BsCart3, BsBagCheck, BsPeople, BsJournalText } from "react-icons/bs";
import { TbCurrencyRupee } from "react-icons/tb";
import { CiBoxes, CiShoppingCart, CiWallet, CiTimer, CiUser, CiViewList } from "react-icons/ci";
import OrderPanel from "@/components/shared/OrderPanel";
import CollabPanel from "@/components/shared/CollabPanel";
import StoryPanel from "@/components/shared/StoryPanel";

import useProductStore from "@/store/productStore";
import useOrderStore from "@/store/orderStore";
import useBlogStore from "@/store/blogStore";
import api from "@/lib/api";

export default function DashboardOverview() {
    const { products, pagination: productPagination, loadProducts } = useProductStore();
    const { orders, loadOrders } = useOrderStore();
    const { blogs, pagination: blogPagination, loadBlogs } = useBlogStore();

    const [totalCustomers, setTotalCustomers] = useState("...");

    useEffect(() => {
        // Global State Caching: Only load if arrays are empty
        if (products.length === 0) loadProducts();
        if (orders.length === 0) loadOrders();
        if (blogs.length === 0) loadBlogs();

        // Fetch Total Customers count
        const fetchCustomersCount = async () => {
            try {
                const res = await api.get('/user/admin/count');
                if (res.data.success) {
                    setTotalCustomers(res.data.data.toString());
                }
            } catch (err) {
                console.error("Failed to load customer count", err);
                setTotalCustomers("0");
            }
        };
        fetchCustomersCount();
    }, [products.length, orders.length, blogs.length, loadProducts, loadOrders, loadBlogs]);

    // Calculate dynamic stats
    const totalProducts = productPagination?.total || products.length || 0;
    const totalOrders = orders.length || 0;
    const totalBlogs = blogPagination?.total || blogs.length || 0;

    // Revenue logic: sum of all order totalAmounts (if available)
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    // Calculate pending COD orders
    const codPending = orders.filter(order => order.paymentStatus === "Pending").length || 0;

    const statsData = [
        { id: 1, title: "Total Products", number: totalProducts.toString(), icon: <BsBoxSeam />, numberIcon: <CiBoxes /> },
        { id: 2, title: "Total Orders", number: totalOrders.toString(), icon: <BsBagCheck />, numberIcon: <CiShoppingCart /> },
        { id: 3, title: "Total Revenue", number: totalRevenue.toLocaleString(), icon: <TbCurrencyRupee />, numberIcon: <CiWallet /> },
        { id: 4, title: "COD Pending", number: codPending.toString(), icon: <BsCart3 />, numberIcon: <CiTimer /> },
        { id: 5, title: "Total Customers", number: totalCustomers, icon: <BsPeople />, numberIcon: <CiUser /> },
        { id: 6, title: "Total Story", number: totalBlogs.toString(), icon: <BsJournalText />, numberIcon: <CiViewList /> }
    ];

    return (
        <div className="dashboard-page">
            <DashboardTitles title="Dashboard Overview" />
            <div className="dashboard-wrapper">
                <div className="dashbaord-stats-grid">
                    {statsData.map((item, index) => (
                        <Stats key={index} item={item} />
                    ))}
                </div>
                <div className="recent-grid recent-activities-grid">
                    <OrderPanel orders={orders.slice(0, 5)} />
                    <CollabPanel />
                    <StoryPanel blogs={blogs.slice(0, 5)} />
                </div>
            </div>
        </div>
    );
}