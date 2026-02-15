import app from './app.js';

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 KMart API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💳 Stripe Webhook: http://localhost:${PORT}/api/payment/webhook`);
});

export default app;
