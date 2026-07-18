import express from 'express';
import { recomputeAnalytics, getDashboardStats } from '../../controllers/crm/analyticsController.js';
import { createCampaign, getCampaigns, getCampaignStatus, sendCampaign } from '../../controllers/crm/campaignController.js';
import { crmLogin } from '../../controllers/crm/authController.js';
import { getCustomers, getCustomerDetails, getFiltersPreview } from '../../controllers/crm/customerController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CRM API is working'
    });
});

// Auth Routes
router.post('/auth/login', crmLogin);

// Customer Routes
router.get('/customers/preview', getFiltersPreview);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetails);

// Campaign Routes
router.post('/campaigns', createCampaign);
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaignStatus);
router.post('/campaigns/:id/send', sendCampaign);

// Admin Action Routes
router.post('/recompute', recomputeAnalytics);
router.get('/dashboard-stats', getDashboardStats);

export default router;
