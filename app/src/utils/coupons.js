export const AVAILABLE_COUPONS = [
    { code: "SAVE5", type: "percent", value: 5 },
    { code: "SAVE10", type: "percent", value: 10 },
];

export const validateCoupon = (code, subtotal) => {
    if (!code) {
        return { isValid: false, message: "Please enter a coupon code." };
    }

    const coupon = AVAILABLE_COUPONS.find(c => c.code === code.toUpperCase());

    if (!coupon) {
        return { isValid: false, message: "Invalid coupon code." };
    }

    return { isValid: true, coupon };
};
