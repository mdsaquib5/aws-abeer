import mongoose from "mongoose";

const customerAnalyticsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        
        // Denormalized fields for fast filtering
        name: { type: String },
        email: { type: String, index: true },
        phone: { type: String },
        city: { type: String, index: true },
        state: { type: String },
        country: { type: String },
        pincode: { type: String },
        
        // Orders metrics
        totalOrders: { type: Number, default: 0, index: true },
        completedOrders: { type: Number, default: 0 },
        cancelledOrders: { type: Number, default: 0 },
        returnedOrders: { type: Number, default: 0 },
        totalSpend: { type: Number, default: 0, index: true },
        averageOrderValue: { type: Number, default: 0 },
        
        // Dates & Activity
        firstOrderDate: { type: Date },
        lastOrderDate: { type: Date, index: true },
        lastLogin: { type: Date },
        lastActivity: { type: Date, index: true },
        customerSinceDays: { type: Number, default: 0 },
        
        // Engagement
        couponUsed: { type: Number, default: 0 },
        wishlistCount: { type: Number, default: 0 },
        cartCount: { type: Number, default: 0 },
        cartAbandoned: { type: Number, default: 0 },
        
        // Preferences
        boughtCategories: [{ type: String }],
        boughtBrands: [{ type: String }],
        boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        boughtLuxury: { type: Boolean, default: false },
        
        // Communication
        emailVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        whatsappAvailable: { type: Boolean, default: false },
        newsletterSubscribed: { type: Boolean, default: false },
        marketingConsent: { type: Boolean, default: false },
        
        // Scoring and Segments
        valueTier: { 
            type: String, 
            enum: ["Bronze", "Silver", "Gold", "VIP", "Platinum"],
            index: true 
        },
        segments: [{ type: String, index: true }], // Array of segment keys
        score: { type: Number, default: 0, index: true, min: 0, max: 100 },
        scoreBreakdown: {
            purchase: { type: Number, default: 0 },
            activity: { type: Number, default: 0 },
            login: { type: Number, default: 0 },
            coupon: { type: Number, default: 0 },
            return: { type: Number, default: 10 },
            wishlist: { type: Number, default: 0 },
            review: { type: Number, default: 0 },
            referral: { type: Number, default: 0 },
        },
        
        status: { 
            type: String, 
            enum: ["Active", "Inactive"],
            default: "Active",
            index: true
        }
    },
    {
        timestamps: true,
    }
);

const CustomerAnalytics = mongoose.models.CustomerAnalytics || mongoose.model("CustomerAnalytics", customerAnalyticsSchema);

export default CustomerAnalytics;
