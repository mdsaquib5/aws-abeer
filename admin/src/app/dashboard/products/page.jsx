"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTitles from "@/components/layout/DashboardTitles";
import ProductCard from "@/components/shared/ProductCard";
import {
    BsPlus,
    BsSearch,
    BsArrowClockwise,
    BsChevronDown,
    BsBoxSeam,
} from "react-icons/bs";
import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { getCollections } from "@/lib/collectionApi";
import { getCategories } from "@/lib/categoryApi";

const STATUS_TABS = [
    { label: "All", value: "" },
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
];

const SORT_OPTIONS = [
    { label: "Newest First", value: "" },
    { label: "Price: Low → High", value: "price_asc" },
    { label: "Price: High → Low", value: "price_desc" },
];

export default function ProductsPage() {
    const router = useRouter();
    const {
        products,
        pagination,
        isLoading,
        error,
        filters,
        loadProducts,
    } = useProductStore();

    const { categories, loadCategories } = useCategoryStore();

    const [searchInput, setSearchInput] = useState("");
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [collections, setCollections] = useState([]);
    const [dynamicCategories, setDynamicCategories] = useState([]);

    // Initial load – show all statuses for admin
    useEffect(() => {
        loadProducts({ status: "" });
        loadCategories("product");
        
        const fetchCols = async () => {
            try {
                const res = await getCollections();
                if (res.success) setCollections(res.collections);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCols();
    }, []);

    // Load categories based on selected collection
    useEffect(() => {
        const fetchCats = async () => {
            if (!filters.collectionId) {
                setDynamicCategories(categories);
                return;
            }
            try {
                const res = await getCategories("product", filters.collectionId);
                if (res.success) {
                    setDynamicCategories(res.data);
                }
            } catch (err) {
                console.error(err);
                setDynamicCategories(categories);
            }
        };
        fetchCats();
    }, [filters.collectionId, categories]);

    // Debounced search
    const handleSearch = (value) => {
        setSearchInput(value);
        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(() => {
            loadProducts({ search: value, page: 1 });
        }, 400);
        setDebounceTimer(timer);
    };

    const handleReset = () => {
        setSearchInput("");
        loadProducts({ search: "", collectionId: "", category: "", status: "", sort: "", page: 1 });
    };

    const handlePageChange = (newPage) => {
        loadProducts({ page: newPage });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const skeletons = Array.from({ length: 6 });

    const activeStatusLabel =
        STATUS_TABS.find((t) => t.value === filters.status)?.label || "All";

    return (
        <div className="dashboard-page">
            <DashboardTitles
                title="Product Catalog"
                subtitle={`Inventory • ${pagination.total} Product${pagination.total !== 1 ? "s" : ""}`}
            />

            <div className="dashboard-wrapper">

                {/* ─────────────────────────────────── FILTER BAR ─── */}
                <div className="pf-bar">

                    {/* Search */}
                    <div className="pf-search-wrap">
                        <BsSearch className="pf-search-icon" />
                        <input
                            className="pf-search-input"
                            type="text"
                            placeholder="Search products…"
                            value={searchInput}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    {/* Divider */}
                    <div className="pf-divider" />

                    {/* Status Tabs */}
                    <div className="pf-status-tabs">
                        {STATUS_TABS.map((tab) => (
                            <button
                                key={tab.value}
                                className={`pf-tab ${filters.status === tab.value ? "pf-tab-active" : ""}`}
                                onClick={() => loadProducts({ status: tab.value, page: 1 })}
                            >
                                {tab.label}
                                {tab.value === "" && (
                                    <span className="pf-tab-count">{pagination.total}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="pf-divider" />

                    {/* Collection Select */}
                    <div className="pf-select-wrap">
                        <select
                            className="pf-select"
                            value={filters.collectionId || ""}
                            onChange={(e) => {
                                loadProducts({ collectionId: e.target.value, category: "", page: 1 });
                            }}
                        >
                            <option value="">All Collections</option>
                            {collections.map((col) => (
                                <option key={col._id} value={col._id}>{col.name}</option>
                            ))}
                        </select>
                        <BsChevronDown className="pf-select-arrow" />
                    </div>

                    {/* Category Select */}
                    <div className="pf-select-wrap">
                        <select
                            className="pf-select"
                            value={filters.category || ""}
                            onChange={(e) => loadProducts({ category: e.target.value, page: 1 })}
                        >
                            <option value="">All Categories</option>
                            {dynamicCategories.map((cat) => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <BsChevronDown className="pf-select-arrow" />
                    </div>

                    {/* Sort Select */}
                    <div className="pf-select-wrap">
                        <select
                            className="pf-select"
                            value={filters.sort}
                            onChange={(e) => loadProducts({ sort: e.target.value, page: 1 })}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <BsChevronDown className="pf-select-arrow" />
                    </div>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Reset */}
                    <button
                        className="pf-icon-btn"
                        onClick={handleReset}
                        title="Reset filters"
                    >
                        <BsArrowClockwise />
                    </button>

                    {/* Add Product */}
                    <button
                        className="pf-add-btn"
                        onClick={() => router.push("/dashboard/products/add")}
                    >
                        <BsPlus style={{ fontSize: "20px" }} />
                        Add Product
                    </button>
                </div>

                {/* Active filter pills */}
                {(filters.search || filters.category || filters.status) && (
                    <div className="pf-active-filters">
                        <span className="pf-active-label">Filters:</span>
                        {filters.status && (
                            <span className="pf-pill">
                                Status: {activeStatusLabel}
                                <button onClick={() => loadProducts({ status: "", page: 1 })} className="pf-pill-close">×</button>
                            </span>
                        )}
                        {filters.category && (
                            <span className="pf-pill">
                                {filters.category}
                                <button onClick={() => loadProducts({ category: "", page: 1 })} className="pf-pill-close">×</button>
                            </span>
                        )}
                        {filters.search && (
                            <span className="pf-pill">
                                "{filters.search}"
                                <button onClick={() => { setSearchInput(""); loadProducts({ search: "", page: 1 }); }} className="pf-pill-close">×</button>
                            </span>
                        )}
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div style={{
                        background: "#3f1f1f",
                        border: "1px solid #f87171",
                        borderRadius: "8px",
                        padding: "16px",
                        color: "#f87171",
                        marginBottom: "20px",
                        fontSize: "14px"
                    }}>
                        ⚠ {error}
                    </div>
                )}

                {/* ── Grid ── */}
                {isLoading ? (
                    <div className="products-grid">
                        {skeletons.map((_, i) => (
                            <div key={i} className="product-card pf-skeleton">
                                <div className="pf-skeleton-img" />
                                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div className="pf-skeleton-line" style={{ width: "70%" }} />
                                    <div className="pf-skeleton-line" style={{ width: "40%" }} />
                                    <div className="pf-skeleton-line" style={{ width: "55%" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="pf-empty">
                        <BsBoxSeam className="pf-empty-icon" />
                        <div className="pf-empty-title">No products found</div>
                        <div className="pf-empty-sub">
                            {filters.search || filters.category || filters.status
                                ? "Try clearing your filters to see all products"
                                : "Add your first product to get started"}
                        </div>
                        <button
                            className="pf-add-btn"
                            style={{ marginTop: "24px" }}
                            onClick={() => router.push("/dashboard/products/add")}
                        >
                            <BsPlus /> Add First Product
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} item={product} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {!isLoading && pagination.pages > 1 && (
                    <div className="pf-pagination">
                        <button
                            className="pf-page-btn"
                            disabled={pagination.page <= 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            ← Prev
                        </button>

                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pg) => (
                            <button
                                key={pg}
                                className={`pf-page-num ${pg === pagination.page ? "pf-page-num-active" : ""}`}
                                onClick={() => handlePageChange(pg)}
                            >
                                {pg}
                            </button>
                        ))}

                        <button
                            className="pf-page-btn"
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}