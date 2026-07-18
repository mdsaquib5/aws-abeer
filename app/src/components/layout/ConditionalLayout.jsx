"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const ConditionalHeader = () => {
    const pathname = usePathname();
    if (pathname === '/login') return null;
    return <Header />;
};

export const ConditionalFooter = () => {
    const pathname = usePathname();
    if (pathname === '/login') return null;
    return <Footer />;
};
