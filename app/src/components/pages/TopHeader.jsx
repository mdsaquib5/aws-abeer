import React from 'react';
import Link from 'next/link';
import { IoHomeOutline } from 'react-icons/io5';

const TopHeader = ({ breadcrumbs, title, desc }) => {
    const crumbs = breadcrumbs || [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: null },
    ];

    const pageTitle = title || "Abeer by Mariyam Rehan";
    const pageDesc = desc !== undefined ? desc : "A reflection of slow fashion, quiet luxury, and timeless design. We create consciously made pieces that remain relevant long after trends fade, crafted for the modern desi muse.";

    return (
        <div className="page-header">
            <div className="container">
                <div className="page-header-content">
                    <h2 className="page-header-title">{pageTitle}</h2>
                    {pageDesc && (
                        <p className="page-header-desc">
                            {pageDesc}
                        </p>
                    )}
                    <div className="breadcrumb">
                        {crumbs.map((crumb, idx) => {
                            const isLast = idx === crumbs.length - 1;
                            return (
                                <React.Fragment key={idx}>
                                    {idx > 0 && <span className="breadcrumb-separator">/</span>}
                                    {idx === 0 ? (
                                        <Link href={crumb.href || '/'}>
                                            <IoHomeOutline className="breadcrumb-home-icon" />
                                            <span>{crumb.label}</span>
                                        </Link>
                                    ) : isLast || !crumb.href ? (
                                        <span className="breadcrumb-current">{crumb.label}</span>
                                    ) : (
                                        <Link href={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;