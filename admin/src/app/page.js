"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLoginForm from "@/components/pages/AdminLoginForm";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isHydrated, isAuthenticated, isLoading, router]);

  if (!isHydrated || isLoading || isAuthenticated) {
    return null;
  }

  return (
    <>
      <AdminLoginForm />
    </>
  );
}