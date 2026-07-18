import mongoose from 'mongoose';
import User from '../models/userSchema.js';
import Order from '../models/orderSchema.js';
import CustomerAnalytics from '../models/crm/CustomerAnalytics.js';
import { calculateValueTier } from '../config/crm/tiers.js';
import { calculateScores } from '../config/crm/scoring.js';
import { assignSegments } from '../config/crm/segments.js';

export const runAnalyticsEngine = async () => {
    console.log("Starting Customer Analytics Engine...");
    try {
        const users = await User.find({}).lean();

        for (const user of users) {
            const userId = user._id;

            // Find all orders for this user
            const orders = await Order.find({ user: userId }).lean();

            let totalOrders = 0;
            let completedOrders = 0;
            let cancelledOrders = 0;
            let returnedOrders = 0;
            let totalSpend = 0;

            let firstOrderDate = null;
            let lastOrderDate = null;

            let city = null;
            let state = null;
            let country = 'India'; // Defaulting based on typical usage
            let pincode = null;
            let phone = null;

            // Iterate over orders to calculate metrics
            for (const order of orders) {
                totalOrders++;

                if (order.orderStatus === 'Delivered' || order.orderStatus === 'Completed') {
                    completedOrders++;
                    totalSpend += order.totalAmount || 0;
                } else if (order.orderStatus === 'Cancelled') {
                    cancelledOrders++;
                } else if (order.orderStatus === 'Returned') {
                    returnedOrders++;
                }

                // Dates
                const orderDate = new Date(order.createdAt);
                if (!firstOrderDate || orderDate < firstOrderDate) firstOrderDate = orderDate;
                if (!lastOrderDate || orderDate > lastOrderDate) lastOrderDate = orderDate;

                // Get latest address details if available
                if (order.shippingAddress && (!lastOrderDate || orderDate >= lastOrderDate)) {
                    city = order.shippingAddress.city;
                    state = order.shippingAddress.state;
                    pincode = order.shippingAddress.pincode;
                    phone = order.shippingAddress.phone;
                }
            }

            const averageOrderValue = completedOrders > 0 ? (totalSpend / completedOrders) : 0;

            // Time logic
            const now = new Date();
            const customerSinceDays = Math.floor((now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));

            const lastLogin = user.updatedAt || user.createdAt; // Approximation for now
            const lastActivity = lastOrderDate && lastOrderDate > lastLogin ? lastOrderDate : lastLogin;

            const daysSinceActivity = Math.floor((now - new Date(lastActivity)) / (1000 * 60 * 60 * 24));
            const daysSinceLogin = Math.floor((now - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
            const status = daysSinceActivity > 90 ? "Inactive" : "Active";

            // Generate Data Object for Scoring and Segmentation
            const analyticsDataForRules = {
                totalOrders,
                totalSpend,
                averageOrderValue,
                daysSinceActivity,
                daysSinceLogin,
                cancelledOrders,
                returnedOrders,
                couponUsed: 0, // Placeholder until CouponHistory exists
                wishlistCount: 0, // Placeholder
                cartAbandoned: 0, // Placeholder
                customerSinceDays,
                status
            };

            const scoreObj = calculateScores(analyticsDataForRules);

            // Value Tier
            const valueTier = calculateValueTier(totalSpend);
            analyticsDataForRules.valueTier = valueTier;
            analyticsDataForRules.score = scoreObj.total;

            // Segments logic
            const segments = assignSegments(analyticsDataForRules);

            // Update or create document
            await CustomerAnalytics.findOneAndUpdate(
                { userId: userId },
                {
                    name: user.name,
                    email: user.email,
                    phone: phone, // Extracted from order
                    city: city,
                    state: state,
                    country: country,
                    pincode: pincode,
                    totalOrders,
                    completedOrders,
                    cancelledOrders,
                    returnedOrders,
                    totalSpend,
                    averageOrderValue,
                    firstOrderDate,
                    lastOrderDate,
                    lastLogin,
                    lastActivity,
                    customerSinceDays,
                    valueTier,
                    segments,
                    status,
                    score: scoreObj.total,
                    scoreBreakdown: scoreObj.breakdown,
                    // Flags based on user doc (if they existed in user doc)
                    emailVerified: true, // Example fallback
                    phoneVerified: !!phone,
                    marketingConsent: true
                },
                { upsert: true, returnDocument: 'after' }
            );
        }

        console.log(`Customer Analytics Engine completed successfully for ${users.length} users.`);
    } catch (error) {
        console.error("Error in Customer Analytics Engine:", error);
    }
};
