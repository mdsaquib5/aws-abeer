import localFont from "next/font/local";
import { Khand } from "next/font/google";

export const outfit = localFont({
    src: [
        {
            path: "./outfit/outfit-v15-latin-300.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "./outfit/outfit-v15-latin-regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./outfit/outfit-v15-latin-500.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./outfit/outfit-v15-latin-600.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "./outfit/outfit-v15-latin-700.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "./outfit/outfit-v15-latin-800.woff2",
            weight: "800",
            style: "normal",
        },
        {
            path: "./outfit/outfit-v15-latin-900.woff2",
            weight: "900",
            style: "normal",
        },
    ],
    variable: "--font-outfit",
    display: "swap",
});

export const sacramento = localFont({
    src: [
        {
            path: "./sacramento/sacramento-v17-latin-regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-sacramento",
    display: "swap",
});

export const cinzel = localFont({
    src: [
        { path: "./cinzel/cinzel-v26-latin-regular.woff2", weight: "400", style: "normal" },
        { path: "./cinzel/cinzel-v26-latin-500.woff2", weight: "500", style: "normal" },
        { path: "./cinzel/cinzel-v26-latin-600.woff2", weight: "600", style: "normal" },
        { path: "./cinzel/cinzel-v26-latin-700.woff2", weight: "700", style: "normal" },
        { path: "./cinzel/cinzel-v26-latin-800.woff2", weight: "800", style: "normal" },
        { path: "./cinzel/cinzel-v26-latin-900.woff2", weight: "900", style: "normal" },
    ],
    variable: "--font-cinzel",
    display: "swap",
});

export const khand = Khand({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['devanagari', 'latin'],
    variable: '--font-khand',
    display: 'swap',
});