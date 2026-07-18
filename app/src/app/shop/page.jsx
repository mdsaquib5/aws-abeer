"use client";
import React, { Suspense } from 'react';
import TopHeader from '@/components/pages/TopHeader';
import SearchBar from '@/components/pages/SearchBar';
import SideBar from '@/components/pages/SideBar';
import ProductCard from '@/components/shared/ProductCard';
import useShopFilters from '@/hooks/useShopFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoOptionsOutline } from 'react-icons/io5';
import { ProductSkeleton } from '@/components/shared/Skeletons';
const ShopContent = () => {
    const {
        products,
        isLoading,
        maxPriceLimit,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSize,
        setSelectedSize,
        selectedPriceRange,
        setSelectedPriceRange,
        sortBy,
        setSortBy,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        tempCategory,
        setTempCategory,
        tempSize,
        setTempSize,
        tempPriceRange,
        setTempPriceRange,
        tempSortBy,
        setTempSortBy,
        filteredProducts,
        sortedProducts,
        handleClearFilters,
        activeTags,
    } = useShopFilters();

    return (
        <div className="pages">
            <TopHeader />
            <div className="shop-page-wrapper">
                <div className="container">
                    <div className="shop-control-bar">
                        <div className="shop-search-section">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                        <div className="shop-actions-section">
                            <div className="sort-dropdown-wrapper">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-dropdown"
                                >
                                    <option value="default">Default Sorting</option>
                                    <option value="low-to-high">Price: Low to High</option>
                                    <option value="high-to-low">Price: High to Low</option>
                                    <option value="name-asc">Alphabetical: A-Z</option>
                                </select>
                            </div>
                            <button
                                className="mobile-filter-trigger"
                                onClick={() => setIsMobileDrawerOpen(true)}
                            >
                                <IoOptionsOutline />
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>
                    {activeTags.length > 0 && (
                        <div className="active-tags-row">
                            <span className="active-tags-label">Active Filters:</span>
                            <div className="active-tags-list">
                                {activeTags.map((tag) => (
                                    <span key={tag.id} className="active-tag-item">
                                        {tag.label}
                                        <button className="remove-tag-btn" onClick={tag.onRemove}>
                                            <IoCloseOutline />
                                        </button>
                                    </span>
                                ))}
                                <button className="clear-all-tag-btn" onClick={handleClearFilters}>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="shop-main-layout">
                        <div className="desktop-sidebar-container">
                            <SideBar
                                products={products}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                                selectedSize={selectedSize}
                                onSelectSize={setSelectedSize}
                                selectedPriceRange={selectedPriceRange}
                                onSelectPriceRange={setSelectedPriceRange}
                                maxPriceLimit={maxPriceLimit}
                                onClearAll={handleClearFilters}
                            />
                        </div>
                        <div className="shop-products-column">
                            {isLoading ? (
                                <div className="shop-products-grid">
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <ProductSkeleton key={num} />
                                    ))}
                                </div>
                            ) : sortedProducts.length > 0 ? (
                                <div className="shop-products-grid">
                                    {sortedProducts.map((product, index) => (
                                        <ProductCard
                                            key={product._id || product.id}
                                            product={product}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products-found">
                                    <h3>No Products Found</h3>
                                    <p>We couldn't find any products matching your active filters. Try adjusting your search query, price range, or categories.</p>
                                    <button onClick={handleClearFilters} className="reset-filters-btn">
                                        Reset All Filters
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isMobileDrawerOpen && (
                    <>
                        <motion.div
                            className="mobile-filter-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileDrawerOpen(false)}
                        />
                        <motion.div
                            className="mobile-filter-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="drawer-header">
                                <h3>Filters & Sorting</h3>
                                <button
                                    className="close-drawer-btn"
                                    onClick={() => setIsMobileDrawerOpen(false)}
                                >
                                    <IoCloseOutline />
                                </button>
                            </div>
                            <div className="drawer-body-content">
                                <div className="drawer-sort-section">
                                    <h4 className="filter-group-title">Sort By</h4>
                                    <select
                                        value={tempSortBy}
                                        onChange={(e) => setTempSortBy(e.target.value)}
                                        className="sort-dropdown-mobile"
                                    >
                                        <option value="default">Default Sorting</option>
                                        <option value="low-to-high">Price: Low to High</option>
                                        <option value="high-to-low">Price: High to Low</option>
                                        <option value="name-asc">Alphabetical: A-Z</option>
                                    </select>
                                </div>
                                <hr className="drawer-separator" />
                                <SideBar
                                    products={products}
                                    selectedCategory={tempCategory}
                                    onSelectCategory={setTempCategory}
                                    selectedSize={tempSize}
                                    onSelectSize={setTempSize}
                                    selectedPriceRange={tempPriceRange}
                                    onSelectPriceRange={setTempPriceRange}
                                    maxPriceLimit={maxPriceLimit}
                                    onClearAll={() => {
                                        setTempCategory("All");
                                        setTempSize("");
                                        setTempPriceRange(maxPriceLimit);
                                    }}
                                />
                            </div>
                            <div className="drawer-actions">
                                <button
                                    className="apply-filters-btn"
                                    onClick={() => {
                                        setSelectedCategory(tempCategory);
                                        setSelectedSize(tempSize);
                                        setSelectedPriceRange(tempPriceRange);
                                        setSortBy(tempSortBy);
                                        setIsMobileDrawerOpen(false);
                                    }}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const ShopPage = () => {
    return (
        <Suspense fallback={
            <div className="pages">
                <TopHeader />
                <div className="container" style={{ padding: "100px 0", textAlign: "center", color: "var(--accent)" }}>
                    Loading Shop...
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
};

export default ShopPage;