"use client";
import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import Logo from '../shared/Logo';
import FooterNav from '../shared/FooterNav';

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/shop" },
    { label: "Blogs", href: "/blog" }
];

const policyLinks = [
    { label: "Return & Exchange Policy", href: "/return-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Payment & Cancellation", href: "/payment-policy" },
];

const Footer = () => {
    return (
        <footer className="footer-bg">
            <div className="container">
                <div className="footer-content-split">
                    <div className="footer-brand-area">
                        <Logo />
                        <div className="footer-tagline">Desi Maximalism</div>
                        <p className="footer-bio">
                            Abeer is a reflection of slow fashion, quiet luxury, and timeless design. We create consciously made pieces that remain relevant long after trends fade, crafted for the modern desi muse.
                        </p>
                    </div>

                    <div className="footer-links-area">
                        <FooterNav title="QUICK LINKS" links={quickLinks} />

                        <FooterNav title="POLICIES" links={policyLinks} />

                        <FooterNav title="CUSTOMER CARE">
                            <div className="contact-info">
                                <p>
                                    <span>WHATSAPP:</span>
                                    <a href="https://wa.me/918076006802" target="_blank" rel="noopener noreferrer">+91 8076006802</a>
                                </p>
                                <p>
                                    <span>INSTAGRAM:</span>
                                    <a href="https://instagram.com/abeer.label" target="_blank" rel="noopener noreferrer">@abeer.label</a>
                                </p>
                                <p>
                                    <span>EMAIL:</span>
                                    <a href="mailto:write@abeerlabel.com">write@abeerlabel.com</a>
                                </p>
                            </div>
                            <div className="footer-socials">
                                <a href="https://wa.me/918076006802" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <FaWhatsapp size={18} />
                                </a>
                                <a href="https://instagram.com/abeer.label" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <FaInstagram size={18} />
                                </a>
                                <a href="mailto:write@abeerlabel.com" aria-label="Email">
                                    <FiMail size={18} />
                                </a>
                            </div>
                        </FooterNav>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        © 2026 ABEER All Rights Reserved.
                    </div>
                    <div className="footer-author">
                        Developed by <a href="https://noohark.com" target="_blank" rel="noopener noreferrer">NoohArk.com</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;