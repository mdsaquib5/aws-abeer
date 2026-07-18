import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import blogRoutes from './routes/blog.js';
import categoryRoutes from './routes/category.js';
import collectionRoutes from './routes/collection.js';
const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    process.env.CRM_URL,
    'http://localhost:3000',
    'http://localhost:3001',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Basic route to test API
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Abeer Label API',
    });
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
// Root route
app.get('/', (req, res) => {
    const port = process.env.PORT || 4000;
    res.send(`Abeer Label Server is running on ${port}`);
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Centralized Error:", err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
});

export default app;
