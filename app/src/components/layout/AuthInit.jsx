"use client";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthInit() {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return null;
}
