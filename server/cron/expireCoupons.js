import CouponCampaign from '../models/crm/CouponCampaign.js';

export const runExpireCoupons = async () => {
    console.log("Checking for expired coupons...");
    try {
        const now = new Date();
        const result = await CouponCampaign.updateMany(
            { 
                validTo: { $lt: now },
                status: { $in: ['draft', 'scheduled', 'running'] } 
            },
            { 
                $set: { status: 'expired' } 
            }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`Expired ${result.modifiedCount} coupon campaigns.`);
        }
    } catch (error) {
        console.error("Error in Expire Coupons Engine:", error);
    }
};
