import jwt from 'jsonwebtoken';

export const crmLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const validEmail = process.env.CRM_ADMIN_EMAIL || 'admin@crm.com';
        const validPassword = process.env.CRM_ADMIN_PASSWORD || 'admin123';

        if (email !== validEmail || password !== validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: 'static-admin-id', role: 'crm-admin' },
            process.env.JWT_SECRET || 'crm_super_secret_key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: 'static-admin-id',
                name: 'CRM Admin',
                email: validEmail,
                role: 'crm-admin'
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
