import React from "react";
import { outfit, sacramento, cinzel, khand } from "../fonts/font";
import { Toaster } from "sonner";
import "./layout.css";
import "./globals.css";
import "./responsive.css";
import AuthInit from "@/components/layout/AuthInit";

export const metadata = {
  title: "ABEER.LABEL – Admin Dashboard",
  description: "Abeer.label | Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" style={{ scrollBehavior: 'smooth' }}>
      <body className={`${outfit.variable} ${sacramento.variable} ${cinzel.variable} ${khand.variable} ${outfit.className}`}>
        <AuthInit />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid #975e2540',
              color: '#fffaf5',
              fontFamily: 'var(--font-outfit)',
            },
          }}
        />
      </body>
    </html>
  );
}