import { useState, useMemo, useEffect } from 'react';
import useProductStore from '@/store/productStore';
import { useSearchParams } from 'next/navigation';

export default function useShopFilters() {
    const { products, loadProducts, isLoading } = useProductStore();
    const searchParams = useSearchParams();
    const categoryParam = searchParams ? searchParams.get('category') : null;
    const collectionParam = searchParams ? searchParams.get('collection') : null;

    const maxPriceLimit = useMemo(() => {
        if (!products.length) return 5000;
        return Math.max(...products.map(p => p.price));
    }, [products]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState(5000);
    const [sortBy, setSortBy] = useState("default");
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const [tempCategory, setTempCategory] = useState(selectedCategory);
    const [tempSize, setTempSize] = useState(selectedSize);
    const [tempPriceRange, setTempPriceRange] = useState(selectedPriceRange);
    const [tempSortBy, setTempSortBy] = useState(sortBy);

    // Sync selectedCategory when category URL search param changes
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory("All");
        }
    }, [categoryParam]);

    // Fetch live products from DB on mount
    useEffect(() => {
        const params = { limit: 1000 };
        if (collectionParam) {
            params.collectionSlug = collectionParam;
        }
        loadProducts(params);
    }, [loadProducts, collectionParam]);

    // Keep the price range slider synced with the loaded products' max price
    useEffect(() => {
        setSelectedPriceRange(maxPriceLimit);
        setTempPriceRange(maxPriceLimit);
    }, [maxPriceLimit]);

    useEffect(() => {
        if (isMobileDrawerOpen) {
            setTempCategory(selectedCategory);
            setTempSize(selectedSize);
            setTempPriceRange(selectedPriceRange);
            setTempSortBy(sortBy);
        }
    }, [isMobileDrawerOpen, selectedCategory, selectedSize, selectedPriceRange, sortBy]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesPrice = product.price <= selectedPriceRange;
            const matchesSize = !selectedSize || (product.sizes && product.sizes.includes(selectedSize));

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                (product.collection && product.collection.toLowerCase().includes(searchLower)) ||
                (product.category && product.category.toLowerCase().includes(searchLower));

            return matchesCategory && matchesPrice && matchesSize && matchesSearch;
        });
    }, [products, selectedCategory, selectedPriceRange, selectedSize, searchQuery]);

    const sortedProducts = useMemo(() => {
        const list = [...filteredProducts];
        if (sortBy === "low-to-high") {
            return list.sort((a, b) => a.price - b.price);
        }
        if (sortBy === "high-to-low") {
            return list.sort((a, b) => b.price - a.price);
        }
        if (sortBy === "name-asc") {
            return list.sort((a, b) => a.name.localeCompare(b.name));
        }
        return list;
    }, [filteredProducts, sortBy]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSelectedSize("");
        setSelectedPriceRange(maxPriceLimit);
        setSortBy("default");
    };

    // Active tags helper
    const activeTags = useMemo(() => {
        const tags = [];
        if (selectedCategory !== "All") {
            tags.push({ id: "category", label: selectedCategory, onRemove: () => setSelectedCategory("All") });
        }
        if (selectedSize) {
            tags.push({ id: "size", label: `Size: ${selectedSize}`, onRemove: () => setSelectedSize("") });
        }
        if (searchQuery) {
            tags.push({ id: "search", label: `Search: "${searchQuery}"`, onRemove: () => setSearchQuery("") });
        }
        if (selectedPriceRange < maxPriceLimit) {
            tags.push({ id: "price", label: `Max Price: ₹${selectedPriceRange.toLocaleString('en-IN')}`, onRemove: () => setSelectedPriceRange(maxPriceLimit) });
        }
        return tags;
    }, [selectedCategory, selectedSize, searchQuery, selectedPriceRange, maxPriceLimit]);

    return {
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
    };
}
