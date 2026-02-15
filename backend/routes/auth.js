import express from 'express';
import {
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    socialLogin
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/social-login', socialLogin);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
