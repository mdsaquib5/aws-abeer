"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoHomeOutline } from 'react-icons/io5';
import Form from "@/components/pages/Form";
import useAuthStore from "@/store/authStore";

const page = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && isAuthenticated) {
            router.push('/');
        }
    }, [isHydrated, isAuthenticated, router]);

    // Avoid rendering the login/signup form briefly before store is hydrated or if authenticated
    if (!isHydrated || isAuthenticated) {
        return null;
    }

    return (
        <div className="pages">
            <div className="shop-page-wrapper login-bg">
                <Link href="/" className="auth-home-btn" aria-label="Go to Home">
                    <IoHomeOutline />
                </Link>
                <div className="container">
                    <Form isLogin={isLogin} setIsLogin={setIsLogin} />
                </div>
            </div>
        </div>
    )
}

export default page;