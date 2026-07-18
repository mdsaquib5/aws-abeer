import CouponCampaign from '../../models/crm/CouponCampaign.js';
import CampaignSend from '../../models/crm/CampaignSend.js';
import CustomerAnalytics from '../../models/crm/CustomerAnalytics.js';
import { enqueueEmails } from '../../queues/email.queue.js';

export const createCampaign = async (req, res) => {
    try {
        // req.user comes from auth middleware (which we haven't implemented strictly, assuming we pass userId in body for now or jwt middleware sets it)
        const campaignData = {
            ...req.body,
            // createdBy: req.user._id
        };
        
        const campaign = await CouponCampaign.create(campaignData);
        
        res.status(201).json({ success: true, data: campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await CouponCampaign.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await CouponCampaign.findById(id).lean();
        
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        
        // Aggregate send stats
        const stats = await CampaignSend.aggregate([
            { $match: { campaignId: campaign._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        const formattedStats = {
            queued: 0,
            sent: 0,
            delivered: 0,
            failed: 0
        };
        
        stats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
        });
        
        res.status(200).json({ 
            success: true, 
            data: {
                campaign,
                stats: formattedStats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await CouponCampaign.findById(id);
        
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        
        // Ensure campaign is not already running or completed
        if (campaign.status === 'running' || campaign.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Campaign is already running or completed' });
        }
        
        // Update status
        campaign.status = 'running';
        await campaign.save();

        // Reconstruct the filter query
        // Normally you'd share this logic, simplified here:
        const filterSnapshot = campaign.filterSnapshot || {};
        // Find matching users
        const audience = await CustomerAnalytics.find(filterSnapshot).select('userId name email').lean();
        
        if (!audience.length) {
            campaign.status = 'completed';
            await campaign.save();
            return res.status(400).json({ success: false, message: 'No audience found for this segment/filter' });
        }

        // We will process emails for now
        const jobs = [];
        const sendRecords = [];

        for (const user of audience) {
            // Create a CampaignSend record first
            sendRecords.push({
                campaignId: campaign._id,
                userId: user.userId,
                channel: 'email',
                status: 'queued'
            });
        }
        
        const insertedSends = await CampaignSend.insertMany(sendRecords, { ordered: false }).catch(err => {
            // Ignore duplicate key errors if already queued
            return err.insertedDocs || [];
        });

        for (const sendDoc of insertedSends) {
            const user = audience.find(u => String(u.userId) === String(sendDoc.userId));
            jobs.push({
                name: 'sendEmail',
                data: {
                    campaignSendId: sendDoc._id,
                    toEmail: user.email,
                    couponCode: campaign.couponCode,
                    discount: campaign.discount,
                    title: campaign.title
                },
                opts: {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 1000 },
                    removeOnComplete: true,
                    removeOnFail: false
                }
            });
        }

        // Push to BullMQ
        await enqueueEmails(jobs);
        
        res.status(200).json({ 
            success: true, 
            message: `Campaign dispatched. ${jobs.length} emails queued.` 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
