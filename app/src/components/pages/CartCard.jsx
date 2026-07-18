"use client";
import React from 'react';
import Image from 'next/image';
import { IoTrashOutline } from 'react-icons/io5';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';

const CartCard = ({ item }) => {
    const { addToCart, decreaseCartItem, removeCartItem } = useCartStore();

    const product = item.product || {};
    const productId = product._id || product.id || item.id;
    const productSlug = product.slug || productId;
    const imageUrl = product.images?.[0]?.url || product.images?.[0] || product.image || item.image || null;
    const collection = product.collectionName || product.collection || item.collection || "Basant Bahaar";

    return (
        <div className="cart-card">
            <Link href={`/product/${productSlug}`} className="cart-card-image">
                {imageUrl ? (
                    <Image src={imageUrl} alt={product.name || item.name} fill sizes="120px" style={{ objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: "100%", height: "100%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "11px" }}>No Image</div>
                )}
            </Link>

            <div className="cart-card-details">
                <div className="brand-tag">Abeer.label</div>
                <Link href={`/product/${productSlug}`} className="cart-card-title">{product.name || item.name}</Link>
                <div className="cart-card-variant">Size: {item.size}</div>
                <div className="pd-qty-control cart-qty-control" style={{ marginTop: '12px' }}>
                    <button className="pd-qty-btn" onClick={() => decreaseCartItem(productId, item.size)}>−</button>
                    <span className="pd-qty-val">{item.quantity}</span>
                    <button className="pd-qty-btn" onClick={() => addToCart(product, item.size)}>+</button>
                </div>
            </div>

            <div className="cart-card-footer">
                <button className="cart-card-remove" aria-label="Remove item" onClick={() => removeCartItem(productId, item.size)}>
                    <IoTrashOutline /> REMOVE
                </button>
                <div className="cart-card-price">
                    ₹{((product.price || item.price) * item.quantity).toLocaleString('en-IN')}
                </div>
            </div>
        </div>
    )
}

export default CartCard;