
export const SCORING_WEIGHTS = {
    MAX_PURCHASE: 30,
    MAX_ACTIVITY: 20,
    MAX_LOGIN: 5,
    MAX_COUPON: 10,
    MAX_RETURN: 10,
    MAX_WISHLIST: 5,
    MAX_REVIEW: 10,
    MAX_REFERRAL: 10,
};

export const calculateScores = (analyticsData) => {
    const { 
        totalOrders, 
        totalSpend, 
        daysSinceActivity, 
        daysSinceLogin, 
        cancelledOrders, 
        returnedOrders,
        couponUsed,
        wishlistCount
    } = analyticsData;

    // 1. Purchase Score (Max 30) -> e.g. 2 points per order + 1 point per 3000 spend
    const purchase = Math.min(SCORING_WEIGHTS.MAX_PURCHASE, (totalOrders * 2) + (totalSpend / 3000));

    // 2. Activity Score (Max 20)
    let activity = 0;
    if (daysSinceActivity <= 7) activity = 20;
    else if (daysSinceActivity <= 30) activity = 16;
    else if (daysSinceActivity <= 90) activity = 10;
    else if (daysSinceActivity <= 180) activity = 5;

    // 3. Login Score (Max 5)
    let login = 0;
    if (daysSinceLogin <= 7) login = 5;
    else if (daysSinceLogin <= 30) login = 3;

    // 4. Coupon Score (Max 10)
    const coupon = Math.min(SCORING_WEIGHTS.MAX_COUPON, couponUsed * 2);

    // 5. Return Penalty Score (Max 10)
    const returnScore = Math.max(0, 10 - (cancelledOrders * 2) - (returnedOrders * 3));

    // 6. Wishlist Score (Max 5)
    const wishlist = Math.min(SCORING_WEIGHTS.MAX_WISHLIST, wishlistCount * 0.5);

    // Default 0 for features not yet fully seeded (Review, Referral)
    const review = 0;
    const referral = 0;

    const total = purchase + activity + login + coupon + returnScore + wishlist + review + referral;

    return {
        total: Math.min(100, Math.floor(total)),
        breakdown: {
            purchase: Math.floor(purchase),
            activity: Math.floor(activity),
            login: Math.floor(login),
            coupon: Math.floor(coupon),
            return: Math.floor(returnScore),
            wishlist: Math.floor(wishlist),
            review,
            referral
        }
    };
};
