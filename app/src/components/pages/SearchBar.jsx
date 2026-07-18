"use client";
import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="search-bar-wrapper">
            <IoSearchOutline className="search-icon" />
            <input
                type="text"
                placeholder="Search products..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
            />
        </div>
    );
};

export default SearchBar;