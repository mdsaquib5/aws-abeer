export const SEGMENTS = [
    {
        key: 'VIP Customers',
        label: 'VIP Customers',
        predicate: (analytics) => ['VIP', 'Platinum'].includes(analytics.valueTier) || analytics.score >= 85
    },
    {
        key: 'High Spending',
        label: 'High Spending',
        predicate: (analytics) => analytics.totalSpend >= 10000
    },
    {
        key: 'Premium Customers',
        label: 'Premium Customers',
        predicate: (analytics) => analytics.averageOrderValue >= 5000
    },
    {
        key: 'Low Spending',
        label: 'Low Spending',
        predicate: (analytics) => analytics.totalOrders >= 1 && analytics.totalSpend < 1000
    },
    {
        key: 'Inactive',
        label: 'Inactive',
        predicate: (analytics) => analytics.status === 'Inactive'
    },
    {
        key: 'New Customers',
        label: 'New Customers',
        predicate: (analytics) => analytics.customerSinceDays <= 30
    },
    {
        key: 'Recently Joined',
        label: 'Recently Joined',
        predicate: (analytics) => analytics.customerSinceDays <= 7
    },
    {
        key: 'Frequent Buyers',
        label: 'Frequent Buyers',
        predicate: (analytics) => analytics.totalOrders >= 5
    },
    {
        key: 'One Time Buyers',
        label: 'One Time Buyers',
        predicate: (analytics) => analytics.totalOrders === 1
    },
    {
        key: 'Never Purchased',
        label: 'Never Purchased',
        predicate: (analytics) => analytics.totalOrders === 0
    },
    {
        key: 'Coupon Lovers',
        label: 'Coupon Lovers',
        predicate: (analytics) => analytics.couponUsed >= 3
    },
    {
        key: 'Cart Abandoners',
        label: 'Cart Abandoners',
        predicate: (analytics) => analytics.cartAbandoned >= 1
    }
];

export const assignSegments = (analyticsData) => {
    const assignedSegments = [];
    for (const segment of SEGMENTS) {
        if (segment.predicate(analyticsData)) {
            assignedSegments.push(segment.key);
        }
    }
    return assignedSegments;
};
