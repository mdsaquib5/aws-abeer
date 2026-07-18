import React from 'react';
import Link from 'next/link';

const FooterNav = ({ title, links, children }) => {
    return (
        <div className="footer-nav-col">
            <h5 className="footer-col-title">{title}</h5>
            {links ? (
                <ul>
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            ) : children}
        </div>
    );
};

export default FooterNav;