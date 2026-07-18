import mongoose from "mongoose";

const couponCampaignSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        couponCode: { type: String, required: true, unique: true, uppercase: true },
        discount: { type: Number, required: true },
        discountType: { type: String, enum: ['flat', 'percent'], default: 'flat' },
        minimumOrder: { type: Number, default: 0 },
        maximumDiscount: { type: Number },
        
        validFrom: { type: Date, required: true },
        validTo: { type: Date, required: true },
        
        targetSegment: { type: String }, // optional, if sending to specific segment
        filterSnapshot: { type: Object }, // saved filter configuration used for the audience
        inactiveDays: { type: Number }, // optional specifically targeting inactive users
        
        channels: { 
            type: [{ type: String, enum: ['email', 'whatsapp', 'sms'] }],
            default: ['email'],
            validate: {
                validator: function(v) {
                    return v && v.length > 0;
                },
                message: 'At least one channel must be selected.'
            }
        },
        
        status: { 
            type: String, 
            enum: ['draft', 'scheduled', 'running', 'completed', 'expired', 'disabled'],
            default: 'draft' 
        },
        
        scheduledAt: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true,
    }
);

const CouponCampaign = mongoose.models.CouponCampaign || mongoose.model("CouponCampaign", couponCampaignSchema);

export default CouponCampaign;
