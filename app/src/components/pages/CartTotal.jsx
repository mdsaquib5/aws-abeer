"use client";
import React from 'react';
import { IoLockClosedOutline, IoShieldCheckmarkOutline, IoCardOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const CartTotal = ({ items }) => {
    const router = useRouter();

    const subtotal = items.reduce((acc, item) => {
        const price = item.product?.price || item.price || 0;
        return acc + (price * item.quantity);
    }, 0);

    // Free shipping above 5000, else 150
    const shipping = subtotal > 10000 ? 0 : 150;

    const discount = 0;

    const total = subtotal + shipping - discount;

    return (
        <div className="cart-summary-box">
            <h2 className="summary-title">Cart Total</h2>

            <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
                <div className="summary-row discount-row">
                    <span>Discount (10%)</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
            )}

            <div className="summary-row">
                <span>Shipping</span>
                {shipping === 0 ? (
                    <span className="free-shipping-text">Free</span>
                ) : (
                    <span>₹{shipping.toLocaleString('en-IN')}</span>
                )}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <p className="taxes-note">Inclusive of all taxes.</p>

            <button
                className="button-primary checkout-btn"
                onClick={() => router.push('/checkout')}
            >
                PROCEED TO SECURE CHECKOUT <IoLockClosedOutline />
            </button>

            <div className="trust-indicators">
                <div className="trust-icon"><IoShieldCheckmarkOutline /> <span>Secure Checkout</span></div>
                <div className="trust-icon"><IoCardOutline /> <span>Safe Payments</span></div>
            </div>
        </div>
    )
}

export default CartTotal;