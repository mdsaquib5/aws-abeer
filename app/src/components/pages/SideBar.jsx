"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useCategoryStore from '@/store/categoryStore';
import { getCollections } from '@/lib/collectionApi';

const SideBar = ({
    products = [],
    selectedCategory = "All",
    onSelectCategory,
    selectedSize = "",
    onSelectSize,
    selectedPriceRange,
    onSelectPriceRange,
    maxPriceLimit,
    onClearAll
}) => {
    const { categories: dbCategories, loadCategories } = useCategoryStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCollectionSlug = searchParams ? searchParams.get('collection') : null;

    const [collections, setCollections] = useState([]);

    useEffect(() => {
        loadCategories("product");
        const fetchCols = async () => {
            try {
                const res = await getCollections();
                if (res.success) {
                    setCollections(res.collections);
                }
            } catch (err) {
                console.error("Failed to load collections in sidebar", err);
            }
        };
        fetchCols();
    }, [loadCategories]);

    const categories = React.useMemo(() => {
        // Derive categories strictly from the available products to ensure 
        // they match the currently viewed collection
        return ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))].sort();
    }, [products]);
    const sizes = ["XS", "S", "M", "L", "XL", "2XL"];

    // Standard independent filter behavior: 
    // Collections are driven solely by URL, Categories by state.
    const activeCollections = React.useMemo(() => {
        const active = new Set();
        if (currentCollectionSlug) {
            active.add(currentCollectionSlug);
        } else if (selectedCategory !== "All") {
            // Find all products in this category
            const productsInCategory = products.filter(p => p.category === selectedCategory);
            
            productsInCategory.forEach(p => {
                const colObj = p.collectionId || p.collection;
                
                // If it's a populated object with a slug
                if (colObj && typeof colObj === 'object' && colObj.slug) {
                    active.add(colObj.slug);
                } 
                // If it's a raw MongoDB string ID
                else if (typeof colObj === 'string' && /^[0-9a-fA-F]{24}$/.test(colObj)) {
                    const matchedCol = collections.find(c => c._id === colObj);
                    if (matchedCol) active.add(matchedCol.slug);
                }
            });

            // Fallback: If no products found or no collection linked, check by name
            if (active.size === 0) {
                collections.forEach(col => {
                    if (selectedCategory.toLowerCase().includes(col.name.toLowerCase())) {
                        active.add(col.slug);
                    }
                });
            }
        }
        return active;
    }, [currentCollectionSlug, selectedCategory, collections, products]);
    const getCategoryCount = (category) => {
        if (category === "All") return products.length;
        return products.filter(p => p.category === category).length;
    };

    return (
        <aside className="shop-sidebar">
            <div className="sidebar-header">
                <h3 className="sidebar-title">Filters</h3>
                <button
                    onClick={() => {
                        if (currentCollectionSlug) router.push('/shop');
                        onClearAll();
                    }}
                    className="clear-all-btn"
                    disabled={selectedCategory === "All" && selectedPriceRange === maxPriceLimit && selectedSize === "" && !currentCollectionSlug}
                >
                    Clear
                </button>
            </div>

            <div className="filter-group">
                <h4 className="filter-group-title">Collections</h4>
                <ul className="category-list">
                    <li
                        className={`category-item ${activeCollections.size === 0 ? "active" : ""}`}
                        onClick={() => {
                            if (currentCollectionSlug) {
                                router.push('/shop');
                            }
                            if (selectedCategory !== "All") {
                                onSelectCategory("All");
                            }
                        }}
                    >
                        <span className="category-name">
                            {activeCollections.size === 0 && <span className="bullet">•</span>}
                            All Collections
                        </span>
                    </li>
                    {collections.map((col) => {
                        const isActive = activeCollections.has(col.slug);
                        return (
                            <li
                                key={col._id}
                                className={`category-item ${isActive ? "active" : ""}`}
                                onClick={() => {
                                    if (!isActive) {
                                        router.push(`/shop?collection=${col.slug}`);
                                        if (selectedCategory !== "All") {
                                            onSelectCategory("All");
                                        }
                                    }
                                }}
                            >
                                <span className="category-name">
                                    {isActive && <span className="bullet">•</span>}
                                    {col.name}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="filter-group">
                <h4 className="filter-group-title">Categories</h4>
                <ul className="category-list">
                    {categories.map((category) => {
                        const count = getCategoryCount(category);
                        const isActive = selectedCategory === category;
                        return (
                            <li
                                key={category}
                                className={`category-item ${isActive ? "active" : ""}`}
                                onClick={() => onSelectCategory(category)}
                            >
                                <span className="category-name">
                                    {isActive && <span className="bullet">•</span>}
                                    {category}
                                </span>
                                <span className="category-count">({count})</span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="filter-group">
                <h4 className="filter-group-title">Sizes</h4>
                <div className="size-selector-grid">
                    {sizes.map((size) => {
                        const isActive = selectedSize === size;
                        return (
                            <button
                                key={size}
                                className={`size-filter-btn ${isActive ? "active" : ""}`}
                                onClick={() => onSelectSize(isActive ? "" : size)}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="filter-group">
                <h4 className="filter-group-title">Filter by Price</h4>
                <div className="price-slider-container">
                    <input
                        type="range"
                        min="0"
                        max={maxPriceLimit}
                        value={selectedPriceRange}
                        onChange={(e) => onSelectPriceRange(Number(e.target.value))}
                        className="price-slider"
                    />
                    <div className="price-labels">
                        <span className="price-label-min">₹0</span>
                        <span className="price-label-current">Max: ₹{selectedPriceRange.toLocaleString('en-IN')}</span>
                        <span className="price-label-max">₹{maxPriceLimit.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;