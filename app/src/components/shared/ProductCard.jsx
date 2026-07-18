import Image from "next/image";
import Link from "next/link";
import { IoBagOutline } from "react-icons/io5";

const ProductCard = ({ product, index }) => {
    const productLink = `/product/${product.slug || product._id || product.id}`;

    // Support both MongoDB images object array and fallback string array
    const image1 = product.images?.[0]?.url || product.images?.[0] || null;
    const image2 = product.images?.[1]?.url || product.images?.[1] || null;

    // Safely extract collection name
    const collectionObj = product.collectionId || product.collection;
    let collectionNameStr = null;
    if (typeof collectionObj === 'object' && collectionObj !== null && collectionObj.name) {
        collectionNameStr = collectionObj.name;
    } else if (typeof collectionObj === 'string' && !/^[0-9a-fA-F]{24}$/.test(collectionObj)) {
        // If it's a string but NOT a 24-char hex ID, we assume it's the actual name
        collectionNameStr = collectionObj;
    }
    const collection = product.collectionName || collectionNameStr || null;

    return (
        <div className="product-card">
            <div className="product-image">
                <Link href={productLink} className="cart-button" aria-label={`Add ${product.name} to cart`}><IoBagOutline /></Link>
                <div className="product-overlay">
                    <Link href={productLink} className="product-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        View Detail
                    </Link>
                </div>
                <Link href={productLink} className="image-link">
                    {image1 ? (
                        <Image src={image1} alt={product.name} className="display-image" fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw" priority={true} quality={60} style={{ objectFit: "cover" }} />
                    ) : (
                        <div style={{ width: "100%", height: "100%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>No Image</div>
                    )}
                    {image2 && (
                        <Image src={image2} alt={`${product.name} Hover`} className="hover-image" fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw" loading="lazy" quality={60} style={{ objectFit: "cover" }} />
                    )}
                </Link>
            </div>
            <div className="product-details-area">
                <div className="taglines">
                    <div className="branding">Abeer.label</div>
                    {collection && <div className="collection">{collection}</div>}
                </div>
                <Link href={productLink} className="product-name">{product.name}</Link>
                <p className="product-description">{product.description}</p>
                <div className="pricing">
                    <div className="price-tag">
                        {product.originalPrice && (
                            <span className="offered-price">₹ {product.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                        <span className="final-price">₹ {product.price.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;