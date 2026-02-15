import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Webhook is handled in server.js to use raw body
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
