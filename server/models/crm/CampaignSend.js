import mongoose from "mongoose";

const campaignSendSchema = new mongoose.Schema(
    {
        campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'CouponCampaign', required: true, index: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        channel: { type: String, enum: ['email', 'whatsapp', 'sms'], required: true },
        
        status: { 
            type: String, 
            enum: ['queued', 'sent', 'delivered', 'failed'],
            default: 'queued',
            index: true
        },
        
        attempts: { type: Number, default: 0 },
        error: { type: String },
        sentAt: { type: Date }
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure idempotency (no duplicate sends per channel per campaign)
campaignSendSchema.index({ campaignId: 1, userId: 1, channel: 1 }, { unique: true });

const CampaignSend = mongoose.models.CampaignSend || mongoose.model("CampaignSend", campaignSendSchema);

export default CampaignSend;
