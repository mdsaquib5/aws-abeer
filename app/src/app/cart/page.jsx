"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopHeader from "@/components/pages/TopHeader";
import CartCard from "@/components/pages/CartCard";
import CartTotal from "@/components/pages/CartTotal";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";

const CartPage = () => {
    const { items, loadCart, isLoading } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push('/login');
        }
    }, [isHydrated, isAuthenticated, router]);

    useEffect(() => {
        if (isHydrated && isAuthenticated) {
            loadCart();
        }
    }, [isHydrated, isAuthenticated, loadCart]);

    if (!isHydrated || !isAuthenticated) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="pages">
                <TopHeader
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cart', href: null }]}
                />
                <div className="shop-page-wrapper">
                    <div className="container cart-loading-container">
                        <div className="cart-loading-text">
                            Loading your bag details...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="pages">
                <TopHeader
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cart', href: null }]}
                />
                <div className="shop-page-wrapper">
                    <div className="container cart-empty-container">
                        <h2 className="cart-empty-title">Your Bag is Empty</h2>
                        <p className="cart-empty-message">Add some premium ethnic collections to your wardrobe.</p>
                        <Link href="/shop" className="button-primary cart-empty-button">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pages">
            <TopHeader
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cart', href: null }]}
            />
            <div className="shop-page-wrapper">
                <div className="container">
                    <div className="cart-layout">
                        <div className="cart-items-section">
                            {items.map((item, idx) => {
                                const productId = item.product?._id || item.product?.id || idx;
                                return (
                                    <CartCard key={`${productId}-${item.size}`} item={item} />
                                );
                            })}
                        </div>

                        <div className="cart-summary-section">
                            <CartTotal items={items} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage;