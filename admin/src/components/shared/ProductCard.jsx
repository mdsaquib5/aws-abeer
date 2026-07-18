"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsPencil, BsTrash } from "react-icons/bs";
import { toast } from "sonner";
import useProductStore from "@/store/productStore";

const ProductCard = ({ item }) => {
    const router = useRouter();
    const { removeProduct } = useProductStore();

    const handleDelete = async () => {
        if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

        const toastId = toast.loading("Deleting product...");
        const result = await removeProduct(item._id);

        if (result.success) {
            toast.success("Product deleted", { id: toastId });
        } else {
            toast.error(result.message || "Failed to delete", { id: toastId });
        }
    };

    const imageUrl = item.images?.[0]?.url || null;
    const statusColor =
        item.status === "published"
            ? "#4ade80"
            : item.status === "archived"
                ? "#f87171"
                : "#facc15";

    return (
        <div className="product-card">
            <div className="product-img-wrapper" style={{ position: "relative" }}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={item.name}
                        className="product-img"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 30vw"
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            background: "#1a1a1a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#555",
                            fontSize: "13px",
                        }}
                    >
                        No Image
                    </div>
                )}
                {/* Status badge */}
                <span
                    style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: statusColor,
                        color: "#000",
                        fontSize: "10px",
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "1.5px",
                    }}
                >
                    {item.status}
                </span>
            </div>
            <div className="product-info">
                <div className="product-title">{item.name}</div>
                <div className="product-price">₹{item.price?.toLocaleString("en-IN")}</div>
                {item.originalPrice > item.price && (
                    <div style={{ fontSize: "12px", color: "#777", textDecoration: "line-through" }}>
                        ₹{item.originalPrice?.toLocaleString("en-IN")}
                    </div>
                )}
                <div className="product-sizes">
                    {(item.sizes || []).map((size, idx) => (
                        <span key={idx} className="size-badge">
                            {size}
                        </span>
                    ))}
                </div>
                <div className="product-stock">
                    Stock:{" "}
                    <span style={{ color: item.stock === 0 ? "#f87171" : "inherit" }}>
                        {item.stock}
                    </span>
                </div>
                <div className="product-actions">
                    <button
                        className="btn-edit"
                        onClick={() => router.push(`/dashboard/products/edit/${item._id}`)}
                    >
                        <BsPencil /> Edit
                    </button>
                    <button className="btn-delete" onClick={handleDelete}>
                        <BsTrash /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;