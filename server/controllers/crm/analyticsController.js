import { runAnalyticsEngine } from '../../cron/updateCustomerAnalytics.js';
import CustomerAnalytics from '../../models/crm/CustomerAnalytics.js';
import CouponCampaign from '../../models/crm/CouponCampaign.js';
import CampaignSend from '../../models/crm/CampaignSend.js';

export const recomputeAnalytics = async (req, res) => {
    try {
        // Run in background so we don't block the request if there are thousands of users
        runAnalyticsEngine();
        
        res.status(200).json({
            success: true,
            message: 'Analytics recomputation started in the background.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to trigger recomputation',
            error: error.message
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalCustomers = await CustomerAnalytics.countDocuments();
        
        const aggregation = await CustomerAnalytics.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalSpend" },
                    avgScore: { $avg: "$score" }
                }
            }
        ]);

        const activeCount = await CustomerAnalytics.countDocuments({ status: 'Active' });
        const inactiveCount = await CustomerAnalytics.countDocuments({ status: 'Inactive' });
        const campaignCount = await CouponCampaign.countDocuments();
        const runningCampaignCount = await CouponCampaign.countDocuments({ status: 'running' });
        const completedCampaignCount = await CouponCampaign.countDocuments({ status: 'completed' });
        const expiredCampaignCount = await CouponCampaign.countDocuments({ status: 'expired' });
        const totalMessagesSent = await CampaignSend.countDocuments({ status: { $in: ['sent', 'delivered'] } });

        res.status(200).json({
            success: true,
            data: {
                totalCustomers,
                totalRevenue: aggregation[0]?.totalRevenue || 0,
                avgScore: Math.round(aggregation[0]?.avgScore || 0),
                activeCount,
                inactiveCount,
                campaignCount,
                runningCampaignCount,
                completedCampaignCount,
                expiredCampaignCount,
                totalMessagesSent
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
