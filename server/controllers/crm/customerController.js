import CustomerAnalytics from '../../models/crm/CustomerAnalytics.js';

// Helper to build MongoDB query from req.query
const buildFilterQuery = (query) => {
    const filter = {};

    // 1. Search (Name, Email, Phone)
    if (query.search) {
        const regex = new RegExp(query.search, 'i');
        filter.$or = [
            { name: regex },
            { email: regex },
            { phone: regex }
        ];
    }

    // 2. Activity / Inactive Days
    if (query.inactiveDays) {
        const days = parseInt(query.inactiveDays);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filter.lastActivity = { $lte: cutoffDate };
    }

    // 3. Spending
    if (query.minSpend) {
        filter.totalSpend = filter.totalSpend || {};
        filter.totalSpend.$gte = parseInt(query.minSpend);
    }
    if (query.maxSpend) {
        filter.totalSpend = filter.totalSpend || {};
        filter.totalSpend.$lte = parseInt(query.maxSpend);
    }

    // 4. Orders count
    if (query.minOrders) {
        filter.totalOrders = { $gte: parseInt(query.minOrders) };
    }
    if (query.noOrders === 'true') {
        filter.totalOrders = 0;
    }

    // 5. Value Tier
    if (query.tier) {
        filter.valueTier = query.tier;
    }

    // 6. Location
    if (query.city) {
        filter.city = { $regex: new RegExp(`^${query.city}$`, 'i') };
    }
    if (query.state) {
        filter.state = { $regex: new RegExp(`^${query.state}$`, 'i') };
    }

    // 7. Segments
    if (query.segment) {
        filter.segments = query.segment;
    }

    // 8. Product Categories (Bought)
    if (query.category) {
        filter.boughtCategories = query.category;
    }

    return filter;
};

// GET /api/crm/customers
export const getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = buildFilterQuery(req.query);

        // Fetch paginated customers from CustomerAnalytics
        const customers = await CustomerAnalytics.find(filter)
            .sort({ lastActivity: -1 }) // default sort by recent activity
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await CustomerAnalytics.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: customers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/crm/customers/:id
export const getCustomerDetails = async (req, res) => {
    try {
        const customerId = req.params.id; // This is the User _id or Analytics _id depending on routing, let's assume it's userId
        const customer = await CustomerAnalytics.findOne({ userId: customerId }).lean();
        
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer analytics not found' });
        }
        
        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/crm/customers/preview
export const getFiltersPreview = async (req, res) => {
    try {
        const filter = buildFilterQuery(req.query);
        const count = await CustomerAnalytics.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
