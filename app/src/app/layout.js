import Script from "next/script";
import { outfit, sacramento, cinzel, khand } from "../fonts/font";
import { Toaster } from "sonner";
import "./layout.css";
import "./globals.css";
import "./responsive.css";
import { ConditionalHeader, ConditionalFooter } from "@/components/layout/ConditionalLayout";
import TopButton from "@/components/layout/TopButton";
import AuthInit from "@/components/layout/AuthInit";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "ABEER.LABEL – Wear Your Soul | Luxury Women's Ethnic Wear",
  description: "Abeer.label | Fashion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" style={{ scrollBehavior: 'smooth' }}>
      <body className={`${outfit.variable} ${sacramento.variable} ${cinzel.variable} ${khand.variable} ${outfit.className}`}>
        <AuthInit />
        <ConditionalHeader />
        <main>
          {children}
        </main>
        <ConditionalFooter />
        <TopButton />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--white)',
              border: '1px solid #380e0e17',
              color: 'var(--primary)',
              fontFamily: 'var(--font-outfit)',
            },
          }}
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}