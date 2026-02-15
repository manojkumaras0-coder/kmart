import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import paymentRoutes from './routes/payment.js';
import { handleWebhook } from './controllers/paymentController.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Stripe Webhook MUST come before express.json() to get raw body
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'KMart API is running',
        timestamp: new Date().toISOString()
    });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Payment routes
app.use('/api/payment', paymentRoutes);

// API Routes Info
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to KMart API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/*',
            products: '/api/products/*',
            cart: '/api/cart/*',
            payment: '/api/payment/*',
            orders: '/api/orders/*',
            users: '/api/users/*'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;
