"use client";
import { useState, useEffect } from "react";
import { BsFlower2 } from "react-icons/bs";
import { IoBagOutline, IoCloseOutline, IoPersonOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2, HiOutlineMail } from "react-icons/hi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../shared/Logo";
import Nav from "../shared/Nav";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

const taglines = [
    "Slow Fashion",
    "Sustainable Choice",
    "Made With Care",
    "Wear Your Soul",
    "Modern Desi Muse",
    "Quiet Luxury",
    "Handcrafted Details",
    "Timeless Silhouettes",
    "Premium Ethnic Wear",
    "Nostalgic Yet Contemporary"
];

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();
    const { items, loadCart } = useCartStore();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart, isAuthenticated]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header>
            <div className="top-bar">
                <div className="marquee">
                    <div className="marquee-content">
                        {taglines.map((tagline, index) => (
                            <div className="marquee-item" key={`orig-${index}`}>
                                <span>{tagline}</span>
                                <BsFlower2 className="flower-icon" />
                            </div>
                        ))}
                    </div>
                    <div className="marquee-content" aria-hidden="true">
                        {taglines.map((tagline, index) => (
                            <div className="marquee-item" key={`dup-${index}`}>
                                <span>{tagline}</span>
                                <BsFlower2 className="flower-icon" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`main-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="header-container">
                        <div className="mobile-menu-icon" onClick={() => setIsMenuOpen(true)} role="button" aria-label="Open menu" tabIndex={0}>
                            <HiOutlineMenuAlt2 />
                        </div>
                        <div className="navbar">
                            <Nav />
                        </div>
                        <div className="logo-bar">
                            <Logo />
                        </div>
                        <div className="cart-icon">
                            {isHydrated && (
                                isAuthenticated ? (
                                    <div className="user-menu-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                                        <span
                                            className="user-greet"
                                            style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--primary)', cursor: 'pointer' }}
                                        >
                                            Hi, {user?.name?.split(' ')[0]}
                                        </span>
                                        <div className="user-dropdown" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            backgroundColor: 'var(--white)',
                                            boxShadow: '0 8px 24px rgba(77, 38, 24, 0.1)',
                                            border: '1px solid rgba(77, 38, 24, 0.08)',
                                            borderRadius: '6px',
                                            padding: '8px 0',
                                            minWidth: '130px',
                                            zIndex: 10,
                                            display: 'none'
                                        }}>
                                            <Link href="/my-orders" style={{ display: 'block', padding: '8px 16px', fontSize: '0.85rem', color: 'var(--primary)', fontFamily: 'var(--font-outfit)' }}>My Orders</Link>
                                            <button onClick={() => logout()} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '0.85rem', color: '#dc2626', fontFamily: 'var(--font-outfit)', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
                                        </div>
                                        <style>{`
                                            .user-menu-wrapper:hover .user-dropdown {
                                                display: block !important;
                                            }
                                        `}</style>
                                    </div>
                                ) : (
                                    <Link href={'/login'} aria-label="Login"> <IoPersonOutline /> </Link>
                                )
                            )}
                            <Link href={'/cart'} aria-label="Cart">
                                <IoBagOutline />
                                {isHydrated && cartCount > 0 && (
                                    <span className="cart-badge">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            className="mobile-menu-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            className="mobile-menu-drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        >
                            <div className="drawer-header">
                                <Logo />
                                <button className="close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                                    <IoCloseOutline />
                                </button>
                            </div>

                            <div className="drawer-content">
                                <Nav onClose={() => setIsMenuOpen(false)} />
                                {isAuthenticated && (
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="btn primary-btn" style={{ marginTop: '20px' }}
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>

                            <div className="drawer-footer">
                                <span className="drawer-tagline">Desi Maximalism</span>
                                <div className="social-links">
                                    <Link href="#" aria-label="WhatsApp"><FaWhatsapp /></Link>
                                    <Link href="#" aria-label="Instagram"><FaInstagram /></Link>
                                    <Link href="#" aria-label="Email"><HiOutlineMail /></Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header;