"use client";
import React, { useState } from 'react';
import NavLink from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { useMediaQuery } from 'react-responsive';
import { getCollections } from '@/lib/collectionApi';

const Nav = ({ onClose }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [collections, setCollections] = useState([]);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });

    React.useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await getCollections();
                if (res.success) {
                    setCollections(res.collections);
                }
            } catch (error) {
                console.error("Failed to fetch collections", error);
            }
        };
        fetchCollections();
    }, []);

    const toggleDropdown = (e) => {
        if (isTabletOrMobile) {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const handleLinkClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <nav className="main-nav">
            <ul className="nav-list">
                <li>
                    <NavLink href="/shop" onClick={handleLinkClick}>Shop</NavLink>
                </li>
                <li className="dropdown-wrapper" onMouseLeave={() => setIsDropdownOpen(false)}>
                    <NavLink
                        href="/shop"
                        onClick={toggleDropdown}
                        className="dropdown-trigger"
                    >
                        Collection <FiChevronDown className="chevron-icon" />
                    </NavLink>

                    <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
                        <ul className="dropdown-list">
                            <li style={{ '--delay': '1' }}>
                                {/* <NavLink href="/shop" onClick={handleLinkClick}>All Collections</NavLink> */}
                            </li>
                            {collections.map((col, idx) => (
                                <li key={col._id} style={{ '--delay': `${idx + 2}` }}>
                                    <NavLink href={`/shop?collection=${col.slug}`} onClick={handleLinkClick}>{col.name}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
                <li>
                    <NavLink href="/blog" onClick={handleLinkClick}>Blogs</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;