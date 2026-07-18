import React from 'react';
import Image from 'next/image';
import { IoCardOutline } from 'react-icons/io5';

const OrderSummary = ({ items, removeItem, subtotal, shipping, discount, total, promoCode, setPromoCode, onApplyPromo }) => {
    return (
        <div className="co-summary-box">
            <div className="co-summary-header">
                <h2>Order Summary</h2>
                <IoCardOutline className="co-summary-icon" />
            </div>

            <div className="co-items-list">
                {items.map(item => (
                    <div key={item.id} className="co-item">
                        <div className="co-item-image">
                            <Image src={item.image} alt={item.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="co-item-details">
                            <h4 className="co-item-title">{item.name}</h4>
                            <p className="co-item-variant">Size: {item.size} &nbsp;|&nbsp; Qty: {item.quantity}</p>
                            <button className="co-item-remove" onClick={() => removeItem(item.id)}>
                                Remove
                            </button>
                        </div>
                        <div className="co-item-price">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <p className="empty-cart-msg">Your bag is empty.</p>
                )}
            </div>

            <div className="co-summary-lines">
                <div className="co-line">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="co-line">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
                {discount > 0 && (
                    <div className="co-line discount">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                )}
            </div>



            <div className="co-promo-section">
                <p className="co-promo-label">Promocode / Gift Card</p>
                <div className="co-promo-input-group">
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="co-promo-input"
                    />
                    <button className="co-promo-btn" onClick={onApplyPromo}>Apply</button>
                </div>
            </div>

            <div className="co-summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
        </div>
    )
}

export default OrderSummary;