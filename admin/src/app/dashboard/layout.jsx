"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import useAuthStore from "@/store/authStore";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isHydrated, isAuthenticated, isLoading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebarStateChange', { detail: isSidebarOpen }));
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleCustomToggle = () => setIsSidebarOpen(prev => !prev);
    window.addEventListener('toggleSidebarEvent', handleCustomToggle);
    return () => window.removeEventListener('toggleSidebarEvent', handleCustomToggle);
  }, []);

  if (!isHydrated || isLoading) {
    return (
      <div className="admin-loading-screen" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-outfit)',
        color: 'var(--primary)',
        background: '#090505'
      }}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}